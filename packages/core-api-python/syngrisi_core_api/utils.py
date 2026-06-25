"""Utility functions ported from JS `src/utils.ts`."""

import json

# Mapping of normalized OS names (keys are lowercase platform identifiers).
_OS_TRANSFORM = {
    "win32": "WINDOWS",
    "windows": "WINDOWS",
    "macintel": "macOS",
    "mac os": "macOS",
}


def transform_os(platform):
    """Transform a platform string to a standardized OS name.

    Lowercases the input and looks it up in the transform map; returns the
    original input when no match is found.
    """
    return _OS_TRANSFORM.get(platform.lower(), platform)


# JS-style alias.
transformOs = transform_os


def error_object(e):
    """Build the ErrorObject dict from an exception.

    Mirrors JS `errorObject`: includes statusCode/statusMessage when the error
    carries an HTTP `response`, and a `stack`-equivalent string.
    """
    response = getattr(e, "response", None)
    result = {
        "error": True,
        "errorMsg": str(e),
        "statusCode": getattr(response, "status_code", None) if response is not None else None,
        "statusMessage": getattr(response, "reason", None) if response is not None else None,
        "stack": getattr(e, "stack", None) or repr(e),
    }
    return result


# JS-style alias.
errorObject = error_object


def pretty_check_result(result):
    """Return a compact string representation of a check result (for logging)."""
    if not isinstance(result, dict) or not result.get("domDump"):
        return json.dumps(result)
    dump = json.loads(result["domDump"])
    res_obs = dict(result)
    del res_obs["domDump"]
    length = len(dump) if isinstance(dump, (list, str, dict)) else 0
    res_obs["domDump"] = f"{json.dumps(dump)[:20]}... and about {length} items]"
    return json.dumps(res_obs)


prettyCheckResult = pretty_check_result
