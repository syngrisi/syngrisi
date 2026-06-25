import os

import pytest
import responses

from syngrisi_core_api import SyngrisiApi


@pytest.fixture(autouse=True)
def _reset_env():
    os.environ.pop("SYNGRISI_AUTH_TOKEN", None)
    yield
    os.environ.pop("SYNGRISI_AUTH_TOKEN", None)


@responses.activate
def test_passes_headers_to_get_baselines():
    responses.add(
        responses.GET,
        "http://localhost:3000/v1/client/baselines",
        json={"results": []},
        status=200,
    )

    api = SyngrisiApi({
        "url": "http://localhost:3000/",
        "apiKey": "plain-api-key",
        "headers": {"X-Kanopy-Authorization": "Bearer token"},
    })

    api.get_baselines({
        "name": "baseline",
        "viewport": "1200x800",
        "browserName": "chrome",
        "os": "linux",
        "app": "app",
        "branch": "main",
    })

    assert len(responses.calls) == 1
    req = responses.calls[0].request
    assert req.headers["X-Kanopy-Authorization"] == "Bearer token"


@responses.activate
def test_adds_authorization_from_env_token_for_get_snapshots():
    os.environ["SYNGRISI_AUTH_TOKEN"] = "env-token"
    responses.add(
        responses.GET,
        "http://localhost:3000/v1/client/snapshots",
        json={"results": []},
        status=200,
    )

    api = SyngrisiApi({"url": "http://localhost:3000/", "apiKey": "plain-api-key"})

    api.get_snapshots({"_id": "0123456789abcdef01234567"})

    assert len(responses.calls) == 1
    req = responses.calls[0].request
    assert req.headers["Authorization"] == "Bearer env-token"


@responses.activate
def test_no_apikey_in_url_or_headers_when_apikey_omitted():
    responses.add(
        responses.GET,
        "http://localhost:3000/v1/client/baselines",
        json={"results": []},
        status=200,
    )

    api = SyngrisiApi({
        "url": "http://localhost:3000/",
        "headers": {"Authorization": "Bearer token"},
    })

    api.get_baselines({
        "name": "baseline",
        "viewport": "1200x800",
        "browserName": "chrome",
        "os": "linux",
        "app": "app",
        "branch": "main",
    })

    assert len(responses.calls) == 1
    req = responses.calls[0].request
    assert "/v1/client/baselines?filter=" in req.url
    assert "apikey=" not in req.url
    assert "apikey" not in req.headers
    assert req.headers["Authorization"] == "Bearer token"
