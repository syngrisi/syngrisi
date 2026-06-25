"""Schemas / validation rules ported from the JS zod schemas.

Validation is implemented manually (no heavy dependency). Each guard raises
``ValidationError`` (a subclass of ``ValueError``) with a clear message when a
rule fails, mirroring zod's "throw on invalid" behaviour.
"""

import re

# Compression threshold in bytes (50KB). DOM dumps larger than this are compressed.
DOM_DUMP_COMPRESSION_THRESHOLD = 50 * 1024

# CSS properties to capture for RCA analysis (camelCase, mirrors JS STYLES_TO_CAPTURE).
STYLES_TO_CAPTURE = [
    # Display & Visibility
    "display", "visibility", "opacity",
    # Position
    "position", "top", "right", "bottom", "left",
    # Dimensions
    "width", "height", "minWidth", "minHeight", "maxWidth", "maxHeight",
    # Box Model
    "margin", "marginTop", "marginRight", "marginBottom", "marginLeft",
    "padding", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft",
    "border", "borderWidth", "borderStyle", "borderColor",
    "borderRadius",
    # Colors
    "backgroundColor", "color",
    # Typography
    "fontFamily", "fontSize", "fontWeight", "lineHeight", "textAlign",
    "textDecoration", "textTransform", "letterSpacing",
    # Layout
    "overflow", "overflowX", "overflowY",
    "zIndex",
    "transform",
    # Flexbox
    "flex", "flexDirection", "flexWrap", "justifyContent", "alignItems", "alignContent", "gap",
    # Grid
    "gridTemplateColumns", "gridTemplateRows", "gridGap",
    # Box Shadow
    "boxShadow",
]

_VIEWPORT_RE = re.compile(r"^\d+x\d+$")


class ValidationError(ValueError):
    """Raised when parameter validation fails (mirrors zod throwing on invalid)."""


def _fail(function_name, errors, params):
    raise ValidationError(
        "Invalid '{fn}' parameters:\n{errs}\n params: {params}".format(
            fn=function_name,
            errs="\n".join(errors),
            params=params,
        )
    )


def _is_str(value):
    return isinstance(value, str)


def _is_number(value):
    # bool is a subclass of int in Python; exclude it to match JS number semantics.
    return isinstance(value, (int, float)) and not isinstance(value, bool)


def _check_viewport(value, field, errors):
    if not _is_str(value):
        errors.append(f"{field}: expected string")
        return
    if len(value) < 3 or not _VIEWPORT_RE.match(value):
        errors.append(f"{field}: invalid viewport format (expected '<width>x<height>')")


def _check_non_empty_str(value, field, errors):
    if not _is_str(value):
        errors.append(f"{field}: expected string")
    elif len(value) < 1:
        errors.append(f"{field}: must be a non-empty string")


def _check_str(value, field, errors):
    if not _is_str(value):
        errors.append(f"{field}: expected string")


def _check_id_string(value, field, errors):
    if not _is_str(value):
        errors.append(f"{field}: expected string")
    elif len(value) != 24:
        errors.append(f"{field}: expected string of length 24")


def _check_str_or_number_nonempty(value, field, errors):
    if _is_number(value):
        return
    if _is_str(value):
        if len(value) < 1:
            errors.append(f"{field}: must be a non-empty string")
        return
    errors.append(f"{field}: expected non-empty string or number")


def validate_config(params, function_name="SyngrisiApi, constructor, cfg"):
    """ConfigSchema: url non-empty str; apiKey optional str; headers optional map<str,str>."""
    errors = []
    if not isinstance(params, dict):
        _fail(function_name, ["expected an object"], params)

    _check_non_empty_str(params.get("url"), "url", errors)

    if "apiKey" in params and params.get("apiKey") is not None:
        _check_str(params.get("apiKey"), "apiKey", errors)

    headers = params.get("headers")
    if "headers" in params and headers is not None:
        if not isinstance(headers, dict):
            errors.append("headers: expected a map")
        else:
            for k, v in headers.items():
                if not _is_str(k) or not _is_str(v):
                    errors.append("headers: expected map<string, string>")
                    break

    if errors:
        _fail(function_name, errors, params)
    return True


def validate_api_session_params(params, function_name="startSession, params"):
    errors = []
    if not isinstance(params, dict):
        _fail(function_name, ["expected an object"], params)

    for field in ("run", "suite", "runident", "name"):
        _check_non_empty_str(params.get(field), field, errors)
    _check_viewport(params.get("viewport"), "viewport", errors)
    _check_non_empty_str(params.get("browser"), "browser", errors)
    _check_str_or_number_nonempty(params.get("browserVersion"), "browserVersion", errors)
    _check_non_empty_str(params.get("browserFullVersion"), "browserFullVersion", errors)
    _check_str(params.get("os"), "os", errors)
    _check_str(params.get("app"), "app", errors)

    tags = params.get("tags")
    if "tags" in params and tags is not None:
        if not isinstance(tags, list) or not all(_is_str(t) for t in tags):
            errors.append("tags: expected array of strings")

    _check_str(params.get("branch"), "branch", errors)

    if errors:
        _fail(function_name, errors, params)
    return True


def validate_check_params(params, function_name="createCheck, params"):
    errors = []
    if not isinstance(params, dict):
        _fail(function_name, ["expected an object"], params)

    for field in ("name", "browserName", "os", "app", "branch"):
        _check_non_empty_str(params.get(field), field, errors)
    _check_viewport(params.get("viewport"), "viewport", errors)
    _check_id_string(params.get("testId"), "testId", errors)
    _check_non_empty_str(params.get("suite"), "suite", errors)
    _check_str_or_number_nonempty(params.get("browserVersion"), "browserVersion", errors)
    _check_non_empty_str(params.get("browserFullVersion"), "browserFullVersion", errors)

    hash_code = params.get("hashCode")
    if not _is_str(hash_code):
        errors.append("hashCode: expected string")
    elif len(hash_code) < 64:
        errors.append("hashCode: must be at least 64 characters")

    skip_dom = params.get("skipDomData")
    if "skipDomData" in params and skip_dom is not None and not isinstance(skip_dom, bool):
        errors.append("skipDomData: expected boolean")

    tol = params.get("toleranceThreshold")
    if "toleranceThreshold" in params and tol is not None:
        if not _is_number(tol):
            errors.append("toleranceThreshold: expected number")
        elif tol < 0 or tol > 100:
            errors.append("toleranceThreshold: must be between 0 and 100")

    if errors:
        _fail(function_name, errors, params)
    return True


def validate_baseline_params(params, function_name="getBaselines, params"):
    errors = []
    if not isinstance(params, dict):
        _fail(function_name, ["expected an object"], params)

    for field in ("name", "browserName", "os", "app", "branch"):
        _check_non_empty_str(params.get(field), field, errors)
    _check_viewport(params.get("viewport"), "viewport", errors)

    if errors:
        _fail(function_name, errors, params)
    return True


def validate_snapshot(params, function_name="getSnapshots, params"):
    """Snapshot: all fields optional. _id len24, name/filename non-empty, imghash len128."""
    errors = []
    if not isinstance(params, dict):
        _fail(function_name, ["expected an object"], params)

    if params.get("_id") is not None:
        _check_id_string(params.get("_id"), "_id", errors)
    if params.get("name") is not None:
        _check_non_empty_str(params.get("name"), "name", errors)
    if params.get("filename") is not None:
        _check_non_empty_str(params.get("filename"), "filename", errors)
    if params.get("imghash") is not None:
        v = params.get("imghash")
        if not _is_str(v):
            errors.append("imghash: expected string")
        elif len(v) != 128:
            errors.append("imghash: expected string of length 128")
    # createdDate is optional; no strict type check needed for transfer.

    if errors:
        _fail(function_name, errors, params)
    return True
