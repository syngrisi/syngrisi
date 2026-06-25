"""SyngrisiApi client ported from JS `src/SyngrisiApi.ts`."""

import hashlib
import json
import os
import time
from urllib.parse import quote

import requests

from .compression import prepare_dom_dump_for_transfer
from .schemas import (
    validate_api_session_params,
    validate_baseline_params,
    validate_check_params,
    validate_config,
    validate_snapshot,
)
from .utils import error_object, pretty_check_result

# SDK version (matches the JS package.json version).
SDK_VERSION = "3.6.0"


def _hasha(value):
    """SHA-512 hex digest (matches JS hasha default of SHA-512)."""
    return hashlib.sha512((value or "").encode("utf-8")).hexdigest()


def _is_dom_data_disabled():
    return os.environ.get("SYNGRISI_DISABLE_DOM_DATA") == "true"


class SyngrisiApi:
    """API client for the Syngrisi visual regression testing service."""

    # Retry configuration (overridable in tests to keep them fast).
    max_retries = 3
    retry_delay_ms = 2000

    def __init__(self, cfg):
        validate_config(cfg, "SyngrisiApi, constructor, cfg")
        # Store a shallow copy so we can attach the computed apiHash.
        self.config = dict(cfg)
        self.config["apiHash"] = _hasha(cfg.get("apiKey") or "")

    # ----- internal helpers -------------------------------------------------

    @property
    def _headers(self):
        headers = {"x-syngrisi-sdk-version": SDK_VERSION}
        headers.update(self.config.get("headers") or {})

        if self.config.get("apiKey"):
            headers["apikey"] = self.config["apiHash"]

        # Hybrid Auth: fall back to ENV variable if not explicitly set.
        env_token = os.environ.get("SYNGRISI_AUTH_TOKEN")
        if "Authorization" not in headers and "authorization" not in headers and env_token:
            headers["Authorization"] = f"Bearer {env_token}"

        return headers

    def _url(self, item_name):
        # config.url already ends with '/'.
        return f"{self.config['url']}v1/client/{item_name}"

    def _request_with_retry(self, request_fn, method_name, error_message):
        max_retries = self.max_retries
        retry_delay_ms = self.retry_delay_ms

        for attempt in range(1, max_retries + 1):
            try:
                return request_fn()
            except Exception as e:  # noqa: BLE001 - mirror JS catch-all
                response = getattr(e, "response", None)
                is_401 = response is not None and getattr(response, "status_code", None) == 401
                is_last_attempt = attempt == max_retries

                if is_401 and not is_last_attempt:
                    time.sleep(retry_delay_ms / 1000.0)
                    continue

                return error_object(e)

        return error_object(Exception("Max retries exceeded"))

    @staticmethod
    def _get_json(method, url, **kwargs):
        resp = requests.request(method, url, **kwargs)
        resp.raise_for_status()
        return resp.json()

    # ----- session methods --------------------------------------------------

    def start_session(self, params):
        validate_api_session_params(params, "startSession, params")

        def do_request():
            fields = {}
            for field in ("run", "suite", "runident", "name", "viewport",
                          "browser", "browserVersion", "os", "app"):
                fields[field] = (None, str(params[field]))
            if params.get("tags"):
                fields["tags"] = (None, json.dumps(params["tags"], separators=(",", ":")))
            if params.get("branch"):
                fields["branch"] = (None, str(params["branch"]))
            return self._get_json("POST", self._url("startSession"),
                                   files=fields, headers=self._headers)

        return self._request_with_retry(
            do_request, "startSession", "Error posting start session data"
        )

    def stop_session(self, test_id):
        def do_request():
            url = f"{self._url('stopSession')}/{test_id}"
            # Empty multipart body.
            return self._get_json("POST", url, files={"_": (None, "")},
                                  headers=self._headers)

        return self._request_with_retry(
            do_request, "stopSession",
            f"Error posting stop session data for test: '{test_id}'"
        )

    # ----- check methods ----------------------------------------------------

    def _add_message_if_check_failed(self, result):
        patched = result
        if not isinstance(patched, dict):
            return patched
        # Skip if result is an error object or status is not a string.
        if patched.get("error") or not isinstance(patched.get("status"), str):
            return patched
        if "failed" in patched["status"]:
            check_view = f"'{self.config['url']}?checkId={patched.get('_id')}&modalIsOpen=true'"
            patched["message"] = f"To evaluate the results of the check, follow the link: '{check_view}'"
            # The links are basically useless - kept for backward compatibility.
            patched["vrsGroupLink"] = check_view
            patched["vrsDiffLink"] = check_view
        return patched

    def core_check(self, image_buffer, params):
        result_with_hash = self._perform_check(params, None, params.get("hashCode"))
        result_with_hash = self._add_message_if_check_failed(result_with_hash)

        if isinstance(result_with_hash, dict) and result_with_hash.get("status") == "requiredFileData":
            result_with_file = self._perform_check(params, image_buffer, params.get("hashCode"))
            result_with_file = self._add_message_if_check_failed(result_with_file)
            return result_with_file
        return result_with_hash

    _FIELDS_MAPPING = {
        "branch": "branch",
        "app": "appName",
        "suite": "suitename",
        "vShifting": "vShifting",
        "testId": "testid",
        "name": "name",
        "viewport": "viewport",
        "browserName": "browserName",
        "browserVersion": "browserVersion",
        "browserFullVersion": "browserFullVersion",
        "os": "os",
        "toleranceThreshold": "toleranceThreshold",
    }

    def _perform_check(self, params, image_buffer, hash_code):
        validate_check_params(params, "createCheck, params")
        url = self._url("createCheck")

        def do_request():
            fields = []
            request_headers = dict(self._headers)

            for key, mapped in self._FIELDS_MAPPING.items():
                value = params.get(key)
                if value is not None:
                    fields.append((mapped, (None, str(value))))

            # Handle domDump with compression for RCA.
            should_skip_dom = _is_dom_data_disabled() or params.get("skipDomData") is True
            if params.get("domDump") and not should_skip_dom:
                prepared = prepare_dom_dump_for_transfer(params["domDump"])
                fields.append(("domdump", (None, prepared["data"])))
                if prepared["isCompressed"]:
                    request_headers["x-domdump-compressed"] = "gzip"

            if hash_code:
                fields.append(("hashcode", (None, hash_code)))
            if image_buffer is not None:
                fields.append(("file", ("file", image_buffer)))

            return self._get_json("POST", url, files=fields, headers=request_headers)

        return self._request_with_retry(
            do_request, "createCheck",
            f"Error posting create check data params: '{json.dumps(params, default=str)}'"
        )

    # ----- read methods -----------------------------------------------------

    def get_ident(self):
        if self.config.get("apiKey"):
            url = f"{self._url('getIdent')}?apikey={self.config['apiHash']}"
        else:
            url = self._url("getIdent")
        return self._request_with_retry(
            lambda: self._get_json("GET", url, headers=self._headers),
            "getIdent", "Error getting ident data"
        )

    def get_baselines(self, params):
        validate_baseline_params(params, "getBaselines, params")
        filter_ = quote(json.dumps(params, separators=(",", ":")), safe="")
        if self.config.get("apiKey"):
            url = f"{self._url('baselines')}?filter={filter_}&apikey={self.config['apiHash']}"
        else:
            url = f"{self._url('baselines')}?filter={filter_}"
        return self._request_with_retry(
            lambda: self._get_json("GET", url, headers=self._headers),
            "getBaselines",
            f"Error getting baselines, params: '{json.dumps(params, default=str)}' data"
        )

    def get_snapshots(self, params):
        validate_snapshot(params, "getSnapshots, params")
        filter_ = quote(json.dumps(params, separators=(",", ":")), safe="")
        if self.config.get("apiKey"):
            url = f"{self._url('snapshots')}?filter={filter_}&apikey={self.config['apiHash']}"
        else:
            url = f"{self._url('snapshots')}?filter={filter_}"
        return self._request_with_retry(
            lambda: self._get_json("GET", url, headers=self._headers),
            "getSnapshots",
            f"Error getting snapshots, params: '{json.dumps(params, default=str)}' data"
        )

    def accept_check(self, check_id, baseline_id):
        if not check_id:
            return error_object(Exception("checkId is required"))
        if not baseline_id:
            return error_object(Exception("baselineId is required"))

        def do_request():
            url = f"{self.config['url']}v1/checks/{check_id}/accept"
            return self._get_json("PUT", url, json={"baselineId": baseline_id},
                                  headers=self._headers)

        return self._request_with_retry(
            do_request, "acceptCheck",
            f"Error accepting check, checkId: '{check_id}', baselineId: '{baseline_id}'"
        )

    def update_baseline(self, baseline_id, updates):
        if not baseline_id:
            return error_object(Exception("baselineId is required"))

        url = f"{self.config['url']}v1/baselines/{baseline_id}"

        def do_request():
            return self._get_json("PUT", url, json=updates, headers=self._headers)

        return self._request_with_retry(
            do_request, "updateBaseline",
            f"Error updating baseline, baselineId: '{baseline_id}', updates: '{json.dumps(updates, default=str)}'"
        )

    # ----- JS-style aliases -------------------------------------------------
    startSession = start_session
    stopSession = stop_session
    coreCheck = core_check
    getIdent = get_ident
    getBaselines = get_baselines
    getSnapshots = get_snapshots
    acceptCheck = accept_check
    updateBaseline = update_baseline
