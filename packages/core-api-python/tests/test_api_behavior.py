import responses

from syngrisi_core_api import SyngrisiApi


def _api():
    return SyngrisiApi({"url": "http://localhost:3000/", "apiKey": "plain-api-key"})


def _check_params():
    return {
        "name": "homepage",
        "viewport": "1200x800",
        "browserName": "chrome",
        "os": "macOS",
        "app": "MyProject",
        "branch": "main",
        "testId": "0123456789abcdef01234567",
        "suite": "suite-name",
        "browserVersion": "113",
        "browserFullVersion": "113.0.0.0",
        "hashCode": "a" * 64,
    }


# ----- two-phase coreCheck --------------------------------------------------

@responses.activate
def test_core_check_two_phase():
    # Phase 1 returns requiredFileData (no file), phase 2 returns final result.
    responses.add(
        responses.POST,
        "http://localhost:3000/v1/client/createCheck",
        json={"status": "requiredFileData"},
        status=200,
    )
    responses.add(
        responses.POST,
        "http://localhost:3000/v1/client/createCheck",
        json={"status": "new", "_id": "0123456789abcdef01234567"},
        status=200,
    )

    api = _api()
    result = api.core_check(b"image-bytes", _check_params())

    assert result["status"] == "new"
    assert len(responses.calls) == 2

    # Phase 1 must NOT contain the file; phase 2 must.
    body1 = responses.calls[0].request.body
    body2 = responses.calls[1].request.body
    body1_bytes = body1 if isinstance(body1, bytes) else str(body1).encode()
    body2_bytes = body2 if isinstance(body2, bytes) else str(body2).encode()
    assert b'name="file"' not in body1_bytes
    assert b"image-bytes" not in body1_bytes
    assert b'name="file"' in body2_bytes
    assert b"image-bytes" in body2_bytes
    # hashcode present in both phases.
    assert b'name="hashcode"' in body1_bytes
    assert b'name="hashcode"' in body2_bytes


@responses.activate
def test_core_check_single_phase_when_no_required_file_data():
    responses.add(
        responses.POST,
        "http://localhost:3000/v1/client/createCheck",
        json={"status": "passed", "_id": "0123456789abcdef01234567"},
        status=200,
    )

    api = _api()
    result = api.core_check(b"image-bytes", _check_params())

    assert result["status"] == "passed"
    assert len(responses.calls) == 1


@responses.activate
def test_core_check_failed_adds_message():
    responses.add(
        responses.POST,
        "http://localhost:3000/v1/client/createCheck",
        json={"status": "failed", "_id": "0123456789abcdef01234567"},
        status=200,
    )

    api = _api()
    result = api.core_check(b"image-bytes", _check_params())

    assert result["status"] == "failed"
    expected_view = "'http://localhost:3000/?checkId=0123456789abcdef01234567&modalIsOpen=true'"
    assert result["vrsGroupLink"] == expected_view
    assert result["vrsDiffLink"] == expected_view
    assert expected_view in result["message"]


# ----- requestWithRetry -----------------------------------------------------

@responses.activate
def test_request_with_retry_401_then_200():
    responses.add(
        responses.GET,
        "http://localhost:3000/v1/client/getIdent",
        json={"error": "unauthorized"},
        status=401,
    )
    responses.add(
        responses.GET,
        "http://localhost:3000/v1/client/getIdent",
        json=["app1", "app2"],
        status=200,
    )

    api = _api()
    api.retry_delay_ms = 0  # speed up the test

    result = api.get_ident()
    assert result == ["app1", "app2"]
    assert len(responses.calls) == 2


@responses.activate
def test_request_with_retry_non_401_returns_error_object_without_retry():
    responses.add(
        responses.GET,
        "http://localhost:3000/v1/client/getIdent",
        json={"error": "server"},
        status=500,
    )

    api = _api()
    api.retry_delay_ms = 0

    result = api.get_ident()
    assert isinstance(result, dict)
    assert result["error"] is True
    assert result["statusCode"] == 500
    # No retry on non-401.
    assert len(responses.calls) == 1


@responses.activate
def test_request_with_retry_persistent_401_exhausts_and_returns_error():
    for _ in range(3):
        responses.add(
            responses.GET,
            "http://localhost:3000/v1/client/getIdent",
            json={"error": "unauthorized"},
            status=401,
        )

    api = _api()
    api.retry_delay_ms = 0

    result = api.get_ident()
    assert result["error"] is True
    assert result["statusCode"] == 401
    assert len(responses.calls) == 3


# ----- acceptCheck / updateBaseline guards ----------------------------------

@responses.activate
def test_accept_check_missing_check_id_returns_error_no_http():
    api = _api()
    result = api.accept_check("", "baseline-id")
    assert result["error"] is True
    assert "checkId is required" in result["errorMsg"]
    assert len(responses.calls) == 0


@responses.activate
def test_accept_check_missing_baseline_id_returns_error_no_http():
    api = _api()
    result = api.accept_check("check-id", "")
    assert result["error"] is True
    assert "baselineId is required" in result["errorMsg"]
    assert len(responses.calls) == 0


@responses.activate
def test_accept_check_success():
    responses.add(
        responses.PUT,
        "http://localhost:3000/v1/checks/check-id-123/accept",
        json={"status": "accepted"},
        status=200,
    )
    api = _api()
    result = api.accept_check("check-id-123", "baseline-id-456")
    assert result["status"] == "accepted"
    assert len(responses.calls) == 1


@responses.activate
def test_update_baseline_missing_id_returns_error_no_http():
    api = _api()
    result = api.update_baseline("", {"ignoreRegions": "[]"})
    assert result["error"] is True
    assert "baselineId is required" in result["errorMsg"]
    assert len(responses.calls) == 0


@responses.activate
def test_update_baseline_success():
    responses.add(
        responses.PUT,
        "http://localhost:3000/v1/baselines/baseline-id-123",
        json={"ok": True},
        status=200,
    )
    api = _api()
    result = api.update_baseline("baseline-id-123", {"ignoreRegions": "[]"})
    assert result["ok"] is True
    assert len(responses.calls) == 1
