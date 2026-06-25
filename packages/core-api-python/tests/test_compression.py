from syngrisi_core_api import (
    DOM_DUMP_COMPRESSION_THRESHOLD,
    compress_dom_dump,
    decompress_dom_dump,
    is_compressed_dom_dump,
    prepare_dom_dump_for_transfer,
)


def _small_dump():
    return {
        "tagName": "body",
        "attributes": {},
        "rect": {"x": 0, "y": 0, "width": 100, "height": 100},
        "computedStyles": {"display": "block"},
        "children": [],
    }


def _large_dump():
    # Build a dump that exceeds the 50KB threshold.
    children = []
    for i in range(2000):
        children.append({
            "tagName": "div",
            "attributes": {"id": f"node-{i}", "class": "some-long-class-name-here"},
            "rect": {"x": i, "y": i, "width": 50, "height": 50},
            "computedStyles": {"display": "block", "color": "rgb(10, 20, 30)"},
            "children": [],
            "text": f"text content for node number {i}",
        })
    return {
        "tagName": "body",
        "attributes": {},
        "rect": {"x": 0, "y": 0, "width": 1000, "height": 1000},
        "computedStyles": {},
        "children": children,
    }


def test_small_dump_not_compressed():
    dump = _small_dump()
    result = compress_dom_dump(dump)
    assert isinstance(result, str)
    assert not is_compressed_dom_dump(result)


def test_large_dump_is_compressed():
    dump = _large_dump()
    result = compress_dom_dump(dump)
    assert is_compressed_dom_dump(result)
    assert result["compressed"] is True
    assert isinstance(result["data"], str)
    assert result["originalSize"] > DOM_DUMP_COMPRESSION_THRESHOLD


def test_round_trip_large():
    dump = _large_dump()
    compressed = compress_dom_dump(dump)
    assert is_compressed_dom_dump(compressed)
    restored = decompress_dom_dump(compressed)
    assert restored == dump


def test_round_trip_small_string():
    dump = _small_dump()
    compressed = compress_dom_dump(dump)  # returns JSON string for small dumps
    restored = decompress_dom_dump(compressed)
    assert restored == dump


def test_is_compressed_dom_dump_true_false():
    assert is_compressed_dom_dump({"compressed": True, "data": "abc"}) is True
    assert is_compressed_dom_dump({"compressed": False, "data": "abc"}) is False
    assert is_compressed_dom_dump({"data": "abc"}) is False
    assert is_compressed_dom_dump("just a string") is False
    assert is_compressed_dom_dump(None) is False


def test_prepare_dom_dump_for_transfer_small():
    prepared = prepare_dom_dump_for_transfer(_small_dump())
    assert prepared["isCompressed"] is False
    assert isinstance(prepared["data"], str)


def test_prepare_dom_dump_for_transfer_large():
    prepared = prepare_dom_dump_for_transfer(_large_dump())
    assert prepared["isCompressed"] is True
    # data is a JSON-stringified CompressedDomDump
    assert '"compressed":true' in prepared["data"]


def test_prepare_already_compressed():
    already = {"compressed": True, "data": "abc", "originalSize": 123}
    prepared = prepare_dom_dump_for_transfer(already)
    assert prepared["isCompressed"] is True


def test_decompress_invalid_returns_none():
    assert decompress_dom_dump("{ not valid json") is None
