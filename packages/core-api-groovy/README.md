# @syngrisi/core-api — Groovy port

A JVM (Groovy) port of the JS package `@syngrisi/core-api`, the client for the
Syngrisi Visual Testing Platform. Full functional parity with the JS source of
truth in `packages/core-api/` (SDK version pinned to **3.6.0**).

## Layout

```
src/main/groovy/io/syngrisi/coreapi/
  SyngrisiApi.groovy   # API client (constructor, headers, url, requestWithRetry,
                       # startSession, stopSession, coreCheck/performCheck two-phase,
                       # getIdent, getBaselines, getSnapshots, acceptCheck, updateBaseline)
  Utils.groovy         # transformOs, errorObject
  Compression.groovy   # isCompressedDomDump / compressDomDump / decompressDomDump /
                       # prepareDomDumpForTransfer (gzip + base64, threshold 50*1024)
  DomCollector.groovy  # COLLECT_DOM_TREE_SCRIPT constant + getCollectDomTreeScript()
  Schemas.groovy       # manual validation (throws), STYLES_TO_CAPTURE,
                       # DOM_DUMP_COMPRESSION_THRESHOLD
  HttpError.groovy     # carries statusCode/statusMessage (analogous to got HTTPError)
src/test/groovy/io/syngrisi/coreapi/
  SyngrisiApiSpec.groovy   # constructor + transformOs (ports SyngrisiApi.test.ts)
  AuthHeadersSpec.groovy   # auth headers (ports SyngrisiApi.auth-headers.test.ts)
  FunctionalitySpec.groovy # compression, two-phase coreCheck, retry, guards
```

## Design

- **Validation throws** `IllegalArgumentException` on invalid input (missing url, bad
  viewport `^\d+x\d+$`, id length 24, etc.), mirroring zod's `paramsGuard`.
- **HTTP methods return an error map** (`[error:true, errorMsg:..., statusCode:..., ...]`)
  instead of throwing, matching the JS ErrorObject contract.
- HTTP via JDK `java.net.http.HttpClient`; multipart/form-data bodies are built manually.
  Header names, multipart field names and URL shapes match the JS package exactly.
- gzip via `java.util.zip`, base64 via `java.util.Base64`, sha512 via `MessageDigest`,
  JSON via `groovy.json`, urlencode via `URLEncoder`.
- The HTTP layer is an overridable `requestExecutor` closure (so tests stub it), the
  retry delay is an overridable `retryDelayMs` (default 2000ms), and the
  `SYNGRISI_AUTH_TOKEN` source is an overridable `authTokenProvider` closure
  (defaults to `System.getenv('SYNGRISI_AUTH_TOKEN')`), making auth testable without
  mutating the process env.
- The auth-header tests stub a real server with the JDK built-in
  `com.sun.net.httpserver.HttpServer` on an ephemeral port and assert on the recorded
  request.

## Running tests

```bash
source "$HOME/.sdkman/bin/sdkman-init.sh"
cd packages/core-api-groovy
gradle test --no-daemon
```

Versions used: **Groovy 4.0.22**, **Spock 2.3-groovy-4.0**, **JDK 21** (21.0.4-tem).

> Note: Gradle 8.10.2 does not run on JDK 24, and Groovy 4.0.x / Spock target JDK 21.
> `gradle.properties` pins `org.gradle.java.home` to the sdkman JDK 21 install so the
> build works regardless of the machine default JDK; `build.gradle` also sets a Java
> toolchain of 21.

## Behavioral deviations from JS

None. All public surface, field/header names, URL shapes and the two-phase check
flow match the JS package.
