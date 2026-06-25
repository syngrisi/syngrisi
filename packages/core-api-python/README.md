# syngrisi-core-api (Python)

Python port of the Syngrisi `@syngrisi/core-api` JS package, with full
functional parity. SDK version: **3.6.0**.

## Install

```bash
python3 -m venv .venv
.venv/bin/pip install -e .            # runtime (requests)
.venv/bin/pip install -e ".[dev]"     # + test deps (responses, pytest)
```

## Usage

```python
from syngrisi_core_api import SyngrisiApi, transform_os

api = SyngrisiApi({"url": "http://localhost:3000/", "apiKey": "your-api-key"})

session = api.start_session({
    "run": "run-id",
    "suite": "suite-name",
    "runident": "run-identifier",
    "name": "test-name",
    "viewport": "1200x800",
    "browser": "chrome",
    "browserVersion": "113",
    "browserFullVersion": "113.0.0.0",
    "os": "macOS",
    "app": "MyProject",
    "branch": "main",
})

result = api.core_check(image_bytes, {
    "name": "homepage",
    "viewport": "1200x800",
    "browserName": "chrome",
    "os": "macOS",
    "app": "MyProject",
    "branch": "main",
    "testId": session["testId"],
    "suite": "suite-name",
    "browserVersion": "113",
    "browserFullVersion": "113.0.0.0",
    "hashCode": "<64+ char hash>",
})

api.stop_session(session["testId"])
```

Method names are Pythonic (`start_session`, `core_check`, `get_baselines`,
`transform_os`, ...) but the JS-style camelCase names are also exposed as
aliases (`startSession`, `coreCheck`, `getBaselines`, `transformOs`, ...).
Wire behaviour (field names, URL shapes, header names) is identical to the JS
package.

## Public surface

- `SyngrisiApi` — constructor, `start_session`, `stop_session`, `core_check`,
  `get_ident`, `get_baselines`, `get_snapshots`, `accept_check`,
  `update_baseline`.
- `transform_os`, `error_object`.
- Compression: `is_compressed_dom_dump`, `compress_dom_dump`,
  `decompress_dom_dump`, `prepare_dom_dump_for_transfer`.
- `COLLECT_DOM_TREE_SCRIPT`, `get_collect_dom_tree_script`.
- `STYLES_TO_CAPTURE`, `DOM_DUMP_COMPRESSION_THRESHOLD`.

Validation throws (`ValidationError`) on invalid params; HTTP methods return an
error dict (`{"error": True, ...}`) instead of raising.

## Tests

```bash
.venv/bin/pytest -q
```
