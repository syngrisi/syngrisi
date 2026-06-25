import pytest

from syngrisi_core_api import SyngrisiApi, transform_os
from syngrisi_core_api.schemas import ValidationError


class TestConstructor:
    def test_create_instance_with_valid_config(self):
        api = SyngrisiApi({"url": "http://localhost:3000/", "apiKey": "test-api-key"})
        assert isinstance(api, SyngrisiApi)

    def test_throws_with_missing_url(self):
        with pytest.raises(ValidationError):
            SyngrisiApi({"apiKey": "test"})

    def test_create_instance_without_apikey(self):
        api = SyngrisiApi({"url": "http://localhost:3000/"})
        assert isinstance(api, SyngrisiApi)


class TestTransformOs:
    def test_unknown_returned_unchanged(self):
        assert transform_os("UnknownOS") == "UnknownOS"

    def test_macintel_to_macos(self):
        assert transform_os("macintel") == "macOS"

    def test_win32_to_windows(self):
        assert transform_os("win32") == "WINDOWS"

    def test_linux_unchanged(self):
        assert transform_os("linux") == "linux"

    def test_darwin_unchanged(self):
        assert transform_os("darwin") == "darwin"
