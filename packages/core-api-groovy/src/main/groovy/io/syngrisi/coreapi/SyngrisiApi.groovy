package io.syngrisi.coreapi

import groovy.json.JsonOutput
import groovy.json.JsonSlurper

import java.net.URLEncoder
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse
import java.nio.charset.StandardCharsets
import java.security.MessageDigest

/**
 * Groovy port of src/SyngrisiApi.ts — the Syngrisi visual regression API client.
 *
 * Parity notes:
 *  - Validation throws IllegalArgumentException (mirrors zod paramsGuard "throw on invalid").
 *  - HTTP methods return an error map ([error:true, ...]) instead of throwing.
 *  - Header names, multipart field names and URL shapes match the JS package exactly.
 */
class SyngrisiApi {

    /** SDK version — pinned to the JS package.json version. */
    static final String SDK_VERSION = '3.6.0'

    private final Map config

    /**
     * Source of the SYNGRISI_AUTH_TOKEN fallback. Defaults to the real env var but
     * is overridable so tests can inject a value without mutating the process env.
     */
    Closure<String> authTokenProvider = { -> System.getenv('SYNGRISI_AUTH_TOKEN') }

    /** Retry delay in ms (default 2000, overridable so tests run fast). */
    int retryDelayMs = 2000

    private final int maxRetries = 3

    /**
     * HTTP executor. Receives a request descriptor map and must return the parsed
     * JSON response, or throw HttpError on a non-2xx response. Overridable in tests.
     *
     * Descriptor keys:
     *   method  : 'GET' | 'POST' | 'PUT'
     *   url     : String
     *   headers : Map<String,String>
     *   multipart : List of field maps (optional) — [name, value, filename?, bytes?]
     *   json    : Object to send as application/json body (optional)
     */
    Closure requestExecutor

    SyngrisiApi(Map cfg) {
        Schemas.validateConfig(cfg, 'SyngrisiApi, constructor, cfg')
        // Copy so we can attach apiHash without mutating caller's map.
        this.config = new LinkedHashMap(cfg)
        this.config.apiHash = hasha((cfg.apiKey ?: '').toString())
        this.requestExecutor = this.&defaultExecute
    }

    /** SHA-512 hex of input (matches the JS hasha() helper). */
    private static String hasha(String input) {
        MessageDigest md = MessageDigest.getInstance('SHA-512')
        byte[] digest = md.digest(input.getBytes(StandardCharsets.UTF_8))
        StringBuilder sb = new StringBuilder()
        for (byte b : digest) {
            sb.append(String.format('%02x', b))
        }
        return sb.toString()
    }

    /** Common request headers (apikey, sdk version, hybrid auth fallback). */
    private Map<String, String> getHeaders() {
        Map<String, String> headers = [:]
        headers['x-syngrisi-sdk-version'] = SDK_VERSION
        if (config.headers) {
            (config.headers as Map).each { k, v -> headers[k.toString()] = v.toString() }
        }
        if (config.apiKey) {
            headers['apikey'] = config.apiHash.toString()
        }
        // Hybrid Auth: fall back to env token if no Authorization header set.
        if (!headers.containsKey('Authorization') && !headers.containsKey('authorization')) {
            String token = authTokenProvider.call()
            if (token) {
                headers['Authorization'] = "Bearer ${token}".toString()
            }
        }
        return headers
    }

    /** Builds the client URL: `${config.url}v1/client/${itemName}`. */
    private String url(String itemName) {
        return "${config.url}v1/client/${itemName}".toString()
    }

    private Object requestWithRetry(Closure requestFn, String methodName, String errorMessage) {
        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return requestFn.call()
            } catch (Exception e) {
                boolean is401 = (e instanceof HttpError) && ((HttpError) e).statusCode == 401
                boolean isLastAttempt = attempt == maxRetries
                if (is401 && !isLastAttempt) {
                    if (retryDelayMs > 0) {
                        Thread.sleep(retryDelayMs)
                    }
                    continue
                }
                return Utils.errorObject(e)
            }
        }
        return Utils.errorObject(new RuntimeException('Max retries exceeded'))
    }

    Object startSession(Map params) {
        Schemas.validateApiSessionParams(params, 'startSession, params')
        return requestWithRetry({
            List<Map> multipart = []
            ['run', 'suite', 'runident', 'name', 'viewport', 'browser', 'browserVersion', 'os', 'app'].each { p ->
                multipart << [name: p, value: params[p]?.toString()]
            }
            if (params.tags) {
                multipart << [name: 'tags', value: JsonOutput.toJson(params.tags)]
            }
            if (params.branch) {
                multipart << [name: 'branch', value: params.branch.toString()]
            }
            if (params.commit) {
                multipart << [name: 'commit', value: params.commit.toString()]
            }
            return requestExecutor([
                    method   : 'POST',
                    url      : url('startSession'),
                    headers  : getHeaders(),
                    multipart: multipart,
            ])
        }, 'startSession', '❌ Error posting start session data')
    }

    Object stopSession(String testId) {
        return requestWithRetry({
            return requestExecutor([
                    method   : 'POST',
                    url      : "${url('stopSession')}/${testId}".toString(),
                    headers  : getHeaders(),
                    multipart: [],
            ])
        }, 'stopSession', "❌ Error posting stop session data for test: '${testId}'".toString())
    }

    private Map addMessageIfCheckFailed(Object result) {
        if (!(result instanceof Map)) {
            return result
        }
        Map patchedResult = result as Map
        if (patchedResult.error || !(patchedResult.status instanceof CharSequence)) {
            return patchedResult
        }
        if (patchedResult.status.toString().contains('failed')) {
            String checkView = "'${config.url}?checkId=${patchedResult._id}&modalIsOpen=true'".toString()
            patchedResult.message = "To evaluate the results of the check, follow the link: '${checkView}'".toString()
            patchedResult.vrsGroupLink = checkView
            patchedResult.vrsDiffLink = checkView
        }
        return patchedResult
    }

    Object coreCheck(byte[] imageBuffer, Map params) {
        Object resultWithHash = performCheck(params, null, params.hashCode?.toString())
        resultWithHash = addMessageIfCheckFailed(resultWithHash)

        if ((resultWithHash instanceof Map) && resultWithHash.status == 'requiredFileData') {
            Object resultWithFile = performCheck(params, imageBuffer, params.hashCode?.toString())
            resultWithFile = addMessageIfCheckFailed(resultWithFile)
            return resultWithFile
        }
        return resultWithHash
    }

    private Object performCheck(Map params, byte[] imageBuffer, String hashCode) {
        Schemas.validateCheckParams(params, 'createCheck, params')

        String checkUrl = url('createCheck')
        // params field -> multipart field name
        Map<String, String> fieldsMapping = [
                branch            : 'branch',
                app               : 'appName',
                suite             : 'suitename',
                vShifting         : 'vShifting',
                testId            : 'testid',
                name              : 'name',
                viewport          : 'viewport',
                browserName       : 'browserName',
                browserVersion    : 'browserVersion',
                browserFullVersion: 'browserFullVersion',
                os                : 'os',
                toleranceThreshold: 'toleranceThreshold',
        ]

        return requestWithRetry({
            List<Map> multipart = []
            Map<String, String> requestHeaders = getHeaders()

            fieldsMapping.each { key, fieldName ->
                if (params[key] != null) {
                    multipart << [name: fieldName, value: params[key].toString()]
                }
            }

            boolean shouldSkipDom = isDomDataDisabled() || params.skipDomData == true
            if (params.domDump && !shouldSkipDom) {
                Map prepared = Compression.prepareDomDumpForTransfer(params.domDump)
                multipart << [name: 'domdump', value: prepared.data]
                if (prepared.isCompressed) {
                    requestHeaders['x-domdump-compressed'] = 'gzip'
                }
            }

            if (hashCode) {
                multipart << [name: 'hashcode', value: hashCode]
            }
            if (imageBuffer != null) {
                multipart << [name: 'file', filename: 'file', bytes: imageBuffer]
            }

            return requestExecutor([
                    method   : 'POST',
                    url      : checkUrl,
                    headers  : requestHeaders,
                    multipart: multipart,
            ])
        }, 'createCheck', "❌ Error posting create check data params: '${JsonOutput.toJson(params)}'".toString())
    }

    Object getIdent() {
        String reqUrl = config.apiKey
                ? "${url('getIdent')}?apikey=${config.apiHash}".toString()
                : url('getIdent')
        return requestWithRetry({
            return requestExecutor([method: 'GET', url: reqUrl, headers: getHeaders()])
        }, 'getIdent', '❌ Error getting ident data')
    }

    Object getBaselines(Map params) {
        Schemas.validateBaselineParams(params, 'getBaselines, params')
        String filter = URLEncoder.encode(JsonOutput.toJson(params), 'UTF-8')
        String reqUrl = config.apiKey
                ? "${url('baselines')}?filter=${filter}&apikey=${config.apiHash}".toString()
                : "${url('baselines')}?filter=${filter}".toString()
        return requestWithRetry({
            return requestExecutor([method: 'GET', url: reqUrl, headers: getHeaders()])
        }, 'getBaselines', "❌ Error getting baselines, params: '${JsonOutput.toJson(params)}' data".toString())
    }

    Object getSnapshots(Map params) {
        Schemas.validateSnapshot(params, 'getSnapshots, params')
        String filter = URLEncoder.encode(JsonOutput.toJson(params), 'UTF-8')
        String reqUrl = config.apiKey
                ? "${url('snapshots')}?filter=${filter}&apikey=${config.apiHash}".toString()
                : "${url('snapshots')}?filter=${filter}".toString()
        return requestWithRetry({
            return requestExecutor([method: 'GET', url: reqUrl, headers: getHeaders()])
        }, 'getSnapshots', "❌ Error getting snapshots, params: '${JsonOutput.toJson(params)}' data".toString())
    }

    Object acceptCheck(String checkId, String baselineId) {
        if (!checkId) {
            return Utils.errorObject(new RuntimeException('checkId is required'))
        }
        if (!baselineId) {
            return Utils.errorObject(new RuntimeException('baselineId is required'))
        }
        return requestWithRetry({
            String reqUrl = "${config.url}v1/checks/${checkId}/accept".toString()
            return requestExecutor([
                    method : 'PUT',
                    url    : reqUrl,
                    headers: getHeaders(),
                    json   : [baselineId: baselineId],
            ])
        }, 'acceptCheck', "❌ Error accepting check, checkId: '${checkId}', baselineId: '${baselineId}'".toString())
    }

    Object updateBaseline(String baselineId, Map updates) {
        if (!baselineId) {
            return Utils.errorObject(new RuntimeException('baselineId is required'))
        }
        String reqUrl = "${config.url}v1/baselines/${baselineId}".toString()
        return requestWithRetry({
            return requestExecutor([
                    method : 'PUT',
                    url    : reqUrl,
                    headers: getHeaders(),
                    json   : updates,
            ])
        }, 'updateBaseline', "❌ Error updating baseline, baselineId: '${baselineId}', updates: '${JsonOutput.toJson(updates)}'".toString())
    }

    private static boolean isDomDataDisabled() {
        return System.getenv('SYNGRISI_DISABLE_DOM_DATA') == 'true'
    }

    // ---- Default HTTP executor backed by JDK HttpClient ----

    private Object defaultExecute(Map req) {
        HttpClient client = HttpClient.newHttpClient()
        HttpRequest.Builder builder = HttpRequest.newBuilder(URI.create(req.url.toString()))

        Map<String, String> headers = (req.headers ?: [:]) as Map

        HttpRequest.BodyPublisher body
        if (req.json != null) {
            body = HttpRequest.BodyPublishers.ofString(JsonOutput.toJson(req.json))
            headers = new LinkedHashMap(headers)
            headers['Content-Type'] = 'application/json'
        } else if (req.containsKey('multipart')) {
            String boundary = "----SyngrisiBoundary${System.nanoTime()}".toString()
            byte[] multipartBody = buildMultipart((List<Map>) (req.multipart ?: []), boundary)
            body = HttpRequest.BodyPublishers.ofByteArray(multipartBody)
            headers = new LinkedHashMap(headers)
            headers['Content-Type'] = "multipart/form-data; boundary=${boundary}".toString()
        } else {
            body = HttpRequest.BodyPublishers.noBody()
        }

        headers.each { k, v -> builder.header(k, v) }

        switch (req.method) {
            case 'GET':
                builder.GET()
                break
            case 'POST':
                builder.POST(body)
                break
            case 'PUT':
                builder.PUT(body)
                break
            default:
                throw new IllegalArgumentException("Unsupported method: ${req.method}")
        }

        HttpResponse<String> response = client.send(builder.build(), HttpResponse.BodyHandlers.ofString())
        int status = response.statusCode()
        if (status < 200 || status >= 300) {
            throw new HttpError(status, statusMessageFor(status), response.body())
        }
        return new JsonSlurper().parseText(response.body())
    }

    private static byte[] buildMultipart(List<Map> fields, String boundary) {
        ByteArrayOutputStream out = new ByteArrayOutputStream()
        String dashBoundary = "--${boundary}\r\n"
        fields.each { field ->
            out.write(dashBoundary.getBytes(StandardCharsets.UTF_8))
            if (field.bytes != null) {
                String header = "Content-Disposition: form-data; name=\"${field.name}\"; filename=\"${field.filename ?: field.name}\"\r\n" +
                        "Content-Type: application/octet-stream\r\n\r\n"
                out.write(header.getBytes(StandardCharsets.UTF_8))
                out.write((byte[]) field.bytes)
            } else {
                String header = "Content-Disposition: form-data; name=\"${field.name}\"\r\n\r\n"
                out.write(header.getBytes(StandardCharsets.UTF_8))
                out.write((field.value ?: '').toString().getBytes(StandardCharsets.UTF_8))
            }
            out.write("\r\n".getBytes(StandardCharsets.UTF_8))
        }
        out.write("--${boundary}--\r\n".toString().getBytes(StandardCharsets.UTF_8))
        return out.toByteArray()
    }

    private static String statusMessageFor(int status) {
        switch (status) {
            case 400: return 'Bad Request'
            case 401: return 'Unauthorized'
            case 403: return 'Forbidden'
            case 404: return 'Not Found'
            case 500: return 'Internal Server Error'
            default: return ''
        }
    }
}
