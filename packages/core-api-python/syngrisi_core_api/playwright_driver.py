"""Minimal Playwright driver for the Syngrisi Python SDK.

Ports the core session/check surface of the JS `PlaywrightDriver`
(`packages/playwright-sdk/src/PlaywrightDriver.ts`), specifically:

- ``start_test_session`` / ``stop_test_session`` — session lifecycle
  (mirrors ``PlaywrightDriver.ts:99-169``).
- ``check`` — screenshot capture + param merging: the session's
  ``testId``, ``app``, ``branch``, ``suite``, ``browser``/``browserName``,
  ``browserVersion``, ``browserFullVersion`` and ``os`` are attached to
  every check, while ``viewport`` is re-read live and explicit
  ``params`` override the computed values (mirrors
  ``PlaywrightDriver.ts:259-330``).

The ``page`` argument is duck-typed: any object exposing ``screenshot()``
(returning bytes) and, optionally, ``viewport_size`` /
``context.browser.browser_type.name`` / ``context.browser.version`` for
best-effort environment auto-detection works. No dependency on the
``playwright`` package itself is required.

NOT ported (deferred — see plan 001, "Do NOT port" list):

- DOM collection for RCA (JS ``collectDomDump``).
- ``setIgnoreRegions`` / the ``Region`` helper class.
- Auto-accept of new baselines (JS ``autoAccept`` / ``acceptCheck`` wiring).
"""

import hashlib

from .api import SyngrisiApi


class PlaywrightDriver:
    """Wraps :class:`SyngrisiApi` with a Playwright-friendly session/check API."""

    def __init__(self, page, url, api_key=None, headers=None):
        self.page = page
        self.api = SyngrisiApi({"url": url, "apiKey": api_key, "headers": headers})
        self._test = {}

    # ----- environment auto-detection (best-effort, no extra deps) ---------

    def _detect_viewport(self):
        size = getattr(self.page, "viewport_size", None)
        if callable(size):
            size = size()
        if isinstance(size, dict) and size.get("width") and size.get("height"):
            return f"{size['width']}x{size['height']}"
        return "0x0"

    def _detect_browser_name(self):
        try:
            return self.page.context.browser.browser_type.name
        except AttributeError:
            return "unknown"

    def _detect_browser_version(self):
        try:
            return self.page.context.browser.version
        except AttributeError:
            return "0"

    @staticmethod
    def _detect_os():
        return "UNKNOWN"

    # ----- session lifecycle -------------------------------------------------

    def start_test_session(self, params):
        """Starts a test session; stores the merged session params for `check()`.

        Mirrors ``PlaywrightDriver.ts`` `startTestSession` — fields not
        provided in ``params`` fall back to environment auto-detection.
        Returns the session response (or raises if the API returns an
        error object).
        """
        params = dict(params or {})

        self._test = {
            "os": params.get("os") or self._detect_os(),
            "viewport": params.get("viewport") or self._detect_viewport(),
            "browser": params.get("browser") or self._detect_browser_name(),
            "browserVersion": params.get("browserVersion") or self._detect_browser_version(),
            "browserFullVersion": params.get("browserFullVersion") or self._detect_browser_version(),
            "name": params.get("name"),
            "app": params.get("app"),
            "run": params.get("run"),
            "branch": params.get("branch"),
            "runident": params.get("runident"),
            "suite": params.get("suite"),
            "tags": params.get("tags"),
        }

        result = self.api.start_session(self._test)
        if isinstance(result, dict) and result.get("error"):
            raise RuntimeError(f"Cannot start session: {result}")

        self._test["testId"] = result.get("_id") if isinstance(result, dict) else None
        return result

    def stop_test_session(self):
        """Stops the current test session using the stored test id."""
        test_id = self._test.get("testId")
        self._test["testId"] = None
        result = self.api.stop_session(test_id)
        if isinstance(result, dict) and result.get("error"):
            raise RuntimeError(f"Cannot stop session: {result}")
        return result

    # ----- check ---------------------------------------------------------------

    def check(self, check_name, image_buffer=None, params=None):
        """Submits a visual check.

        ``image_buffer`` defaults to ``page.screenshot()`` when omitted.
        Session params (``testId``, ``app``, ``branch``, ``suite``,
        ``browserName``, ``browserVersion``, ``browserFullVersion``,
        ``os``) are attached automatically; ``viewport`` is re-read live;
        explicit ``params`` override the computed values.
        """
        if not self._test.get("testId"):
            raise RuntimeError(
                "The test id is empty, the session may not have started yet: "
                f"check name: '{check_name}'"
            )

        if image_buffer is None:
            image_buffer = self.page.screenshot()

        opts = {
            "name": check_name,
            "viewport": self._detect_viewport(),
            "browserName": self._test.get("browser"),
            "os": self._test.get("os"),
            "app": self._test.get("app"),
            "branch": self._test.get("branch"),
            "testId": self._test.get("testId"),
            "suite": self._test.get("suite"),
            "browserVersion": self._test.get("browserVersion"),
            "browserFullVersion": self._test.get("browserFullVersion"),
            "hashCode": hashlib.sha512(image_buffer).hexdigest(),
        }
        opts.update(params or {})

        return self.api.core_check(image_buffer, opts)
