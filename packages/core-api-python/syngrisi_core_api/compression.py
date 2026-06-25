"""DOM dump compression utilities ported from JS `src/compression.ts`.

Uses gzip + base64. The compression threshold is 50KB (DOM_DUMP_COMPRESSION_THRESHOLD).
"""

import base64
import gzip
import json

from .schemas import DOM_DUMP_COMPRESSION_THRESHOLD


def _json_stringify(value):
    """Equivalent of JS JSON.stringify (compact, no extra whitespace)."""
    return json.dumps(value, separators=(",", ":"), ensure_ascii=False)


def is_compressed_dom_dump(data):
    """True iff ``data`` is a dict with ``compressed == True`` and a string ``data``."""
    return (
        isinstance(data, dict)
        and data.get("compressed") is True
        and isinstance(data.get("data"), str)
    )


def compress_dom_dump(dom_dump):
    """Compress a DOM dump if it exceeds the threshold.

    Returns the original JSON string when below the threshold, otherwise a
    ``{data, compressed: True, originalSize}`` dict.
    """
    json_string = dom_dump if isinstance(dom_dump, str) else _json_stringify(dom_dump)

    original_size = len(json_string.encode("utf-8"))

    # Skip compression for small payloads.
    if original_size <= DOM_DUMP_COMPRESSION_THRESHOLD:
        return json_string

    compressed = gzip.compress(json_string.encode("utf-8"))

    return {
        "data": base64.b64encode(compressed).decode("ascii"),
        "compressed": True,
        "originalSize": original_size,
    }


def decompress_dom_dump(data):
    """Decompress a DOM dump, handling compressed/uncompressed/string formats.

    Returns the parsed DomNode object or ``None`` if invalid.
    """
    try:
        # Already a DomNode object (dict, not compressed).
        if isinstance(data, dict) and not is_compressed_dom_dump(data):
            return data

        # Compressed format.
        if is_compressed_dom_dump(data):
            buffer = base64.b64decode(data["data"])
            decompressed = gzip.decompress(buffer).decode("utf-8")
            return json.loads(decompressed)

        # JSON string.
        if isinstance(data, str):
            parsed = json.loads(data)
            if is_compressed_dom_dump(parsed):
                return decompress_dom_dump(parsed)
            return parsed

        return None
    except Exception as e:  # noqa: BLE001 - mirror JS catch-all
        print(f"Failed to decompress domDump: {e}")
        return None


def prepare_dom_dump_for_transfer(dom_dump):
    """Prepare a DOM dump for transfer.

    Returns ``{"data": str, "isCompressed": bool}``.
    """
    # If already compressed, just stringify it.
    if is_compressed_dom_dump(dom_dump):
        return {"data": _json_stringify(dom_dump), "isCompressed": True}

    result = compress_dom_dump(dom_dump)

    if is_compressed_dom_dump(result):
        return {"data": _json_stringify(result), "isCompressed": True}

    return {"data": result, "isCompressed": False}


# JS-style aliases.
isCompressedDomDump = is_compressed_dom_dump
compressDomDump = compress_dom_dump
decompressDomDump = decompress_dom_dump
prepareDomDumpForTransfer = prepare_dom_dump_for_transfer
