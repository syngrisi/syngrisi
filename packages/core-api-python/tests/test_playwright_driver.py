import responses

from syngrisi_core_api.playwright_driver import PlaywrightDriver


class FakePage:
    """Duck-typed stand-in for a Playwright `Page` object."""

    def __init__(self, screenshot_bytes=b"fake-png-bytes"):
        self._screenshot_bytes = screenshot_bytes
        self.screenshot_calls = 0
        self.viewport_size = {"width": 1200, "height": 800}

    def screenshot(self):
        self.screenshot_calls += 1
        return self._screenshot_bytes


def _session_params():
    return {
        "run": "run-id",
        "suite": "suite-name",
        "runident": "run-identifier",
        "name": "test-name",
        "app": "MyProject",
        "branch": "main",
        "os": "macOS",
        "viewport": "1200x800",
        "browser": "chrome",
        "browserVersion": "113",
        "browserFullVersion": "113.0.0.0",
    }


def _start_session(driver):
    responses.add(
        responses.POST,
        "http://localhost:3000/v1/client/startSession",
        json={"_id": "0123456789abcdef01234567"},
        status=200,
    )
    return driver.start_test_session(_session_params())


@responses.activate
def test_check_merges_session_params():
    page = FakePage()
    driver = PlaywrightDriver(page, "http://localhost:3000/", "api-key")
    _start_session(driver)

    responses.add(
        responses.POST,
        "http://localhost:3000/v1/client/createCheck",
        json={"status": "passed", "_id": "abc"},
        status=200,
    )

    driver.check("homepage", image_buffer=b"image-bytes")

    check_request = responses.calls[-1].request
    body = check_request.body
    body_bytes = body if isinstance(body, bytes) else str(body).encode()

    assert b'name="testid"\r\n\r\n0123456789abcdef01234567' in body_bytes
    assert b'name="appName"\r\n\r\nMyProject' in body_bytes
    assert b'name="branch"\r\n\r\nmain' in body_bytes
    assert b'name="viewport"\r\n\r\n1200x800' in body_bytes
    assert b'name="browserName"\r\n\r\nchrome' in body_bytes
    assert b'name="os"\r\n\r\nmacOS' in body_bytes
    assert b'name="suitename"\r\n\r\nsuite-name' in body_bytes


@responses.activate
def test_check_auto_captures_screenshot_when_image_buffer_none():
    page = FakePage(screenshot_bytes=b"auto-screenshot-bytes")
    driver = PlaywrightDriver(page, "http://localhost:3000/", "api-key")
    _start_session(driver)

    # Phase 1 (hash-only) asks for the file; phase 2 receives it.
    responses.add(
        responses.POST,
        "http://localhost:3000/v1/client/createCheck",
        json={"status": "requiredFileData"},
        status=200,
    )
    responses.add(
        responses.POST,
        "http://localhost:3000/v1/client/createCheck",
        json={"status": "new", "_id": "abc"},
        status=200,
    )

    driver.check("homepage")

    # The driver must call page.screenshot() exactly once even though the
    # API needs two round-trips internally.
    assert page.screenshot_calls == 1
    body = responses.calls[-1].request.body
    body_bytes = body if isinstance(body, bytes) else str(body).encode()
    assert b"auto-screenshot-bytes" in body_bytes


@responses.activate
def test_stop_test_session_uses_stored_test_id():
    page = FakePage()
    driver = PlaywrightDriver(page, "http://localhost:3000/", "api-key")
    _start_session(driver)

    responses.add(
        responses.POST,
        "http://localhost:3000/v1/client/stopSession/0123456789abcdef01234567",
        json={"_id": "0123456789abcdef01234567", "status": "stopped"},
        status=200,
    )

    result = driver.stop_test_session()

    assert result["status"] == "stopped"
    assert driver._test["testId"] is None
    stop_call_urls = [c.request.url for c in responses.calls]
    assert any("stopSession/0123456789abcdef01234567" in u for u in stop_call_urls)


@responses.activate
def test_check_raises_when_session_not_started():
    page = FakePage()
    driver = PlaywrightDriver(page, "http://localhost:3000/", "api-key")

    try:
        driver.check("homepage", image_buffer=b"image-bytes")
        assert False, "expected RuntimeError"
    except RuntimeError as e:
        assert "test id is empty" in str(e)
