"""Python port of the Syngrisi `@syngrisi/core-api` package."""

from .api import SDK_VERSION, SyngrisiApi
from .compression import (
    compress_dom_dump,
    compressDomDump,
    decompress_dom_dump,
    decompressDomDump,
    is_compressed_dom_dump,
    isCompressedDomDump,
    prepare_dom_dump_for_transfer,
    prepareDomDumpForTransfer,
)
from .dom_collector import (
    COLLECT_DOM_TREE_SCRIPT,
    collect_dom_tree,
    collectDomTree,
    get_collect_dom_tree_script,
    getCollectDomTreeScript,
)
from .schemas import (
    DOM_DUMP_COMPRESSION_THRESHOLD,
    STYLES_TO_CAPTURE,
    ValidationError,
)
from .utils import error_object, errorObject, transform_os, transformOs

__all__ = [
    "SyngrisiApi",
    "SDK_VERSION",
    "transform_os",
    "transformOs",
    "error_object",
    "errorObject",
    "is_compressed_dom_dump",
    "isCompressedDomDump",
    "compress_dom_dump",
    "compressDomDump",
    "decompress_dom_dump",
    "decompressDomDump",
    "prepare_dom_dump_for_transfer",
    "prepareDomDumpForTransfer",
    "COLLECT_DOM_TREE_SCRIPT",
    "get_collect_dom_tree_script",
    "getCollectDomTreeScript",
    "collect_dom_tree",
    "collectDomTree",
    "STYLES_TO_CAPTURE",
    "DOM_DUMP_COMPRESSION_THRESHOLD",
    "ValidationError",
]
