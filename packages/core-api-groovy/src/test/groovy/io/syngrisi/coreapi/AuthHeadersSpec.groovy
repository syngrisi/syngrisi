package io.syngrisi.coreapi

import com.sun.net.httpserver.HttpExchange
import com.sun.net.httpserver.HttpHandler
import com.sun.net.httpserver.HttpServer
import spock.lang.Specification

import java.nio.charset.StandardCharsets

/**
 * Ports tests/SyngrisiApi.auth-headers.test.ts.
 *
 * Instead of mocking got, we stand up a real JDK HttpServer on an ephemeral port
 * that records the last request (method, path, query, headers) and returns staged
 * JSON ({"results":[]}). SYNGRISI_AUTH_TOKEN is injected via the overridable
 * authTokenProvider closure (reset between tests).
 */
class AuthHeadersSpec extends Specification {

    HttpServer server
    String baseUrl
    Map recorded

    def setup() {
        recorded = [:]
        server = HttpServer.create(new InetSocketAddress('127.0.0.1', 0), 0)
        server.createContext('/', new HttpHandler() {
            @Override
            void handle(HttpExchange exchange) throws IOException {
                recorded.method = exchange.requestMethod
                recorded.path = exchange.requestURI.path
                recorded.query = exchange.requestURI.query
                Map<String, String> headers = [:]
                exchange.requestHeaders.each { k, v -> headers[k] = v ? v[0] : null }
                recorded.headers = headers

                byte[] body = '{"results":[]}'.getBytes(StandardCharsets.UTF_8)
                exchange.sendResponseHeaders(200, body.length)
                exchange.responseBody.withCloseable { it.write(body) }
            }
        })
        server.start()
        baseUrl = "http://127.0.0.1:${server.address.port}/".toString()
    }

    def cleanup() {
        server?.stop(0)
    }

    private SyngrisiApi makeApi(Map cfg, String envToken = null) {
        def api = new SyngrisiApi(cfg)
        // Reset / inject the SYNGRISI_AUTH_TOKEN source per test.
        api.authTokenProvider = { -> envToken }
        return api
    }

    /** A request header is case-insensitive in HttpExchange; helper to look it up. */
    private String header(String name) {
        def entry = recorded.headers.find { k, v -> k.equalsIgnoreCase(name) }
        return entry?.value
    }

    def "passes custom headers to getBaselines"() {
        given:
        def api = makeApi([
                url    : baseUrl,
                apiKey : 'plain-api-key',
                headers: ['X-Kanopy-Authorization': 'Bearer token'],
        ])

        when:
        api.getBaselines([
                name       : 'baseline',
                viewport   : '1200x800',
                browserName: 'chrome',
                os         : 'linux',
                app        : 'app',
                branch     : 'main',
        ])

        then:
        header('X-Kanopy-Authorization') == 'Bearer token'
    }

    def "adds Authorization from SYNGRISI_AUTH_TOKEN fallback for getSnapshots"() {
        given:
        def api = makeApi([url: baseUrl, apiKey: 'plain-api-key'], 'env-token')

        when:
        api.getSnapshots([_id: '0123456789abcdef01234567'])

        then:
        header('Authorization') == 'Bearer env-token'
    }

    def "does not send apikey in URL or headers when apiKey is omitted"() {
        given:
        def api = makeApi([
                url    : baseUrl,
                headers: ['Authorization': 'Bearer token'],
        ])

        when:
        api.getBaselines([
                name       : 'baseline',
                viewport   : '1200x800',
                browserName: 'chrome',
                os         : 'linux',
                app        : 'app',
                branch     : 'main',
        ])

        then:
        recorded.path == '/v1/client/baselines'
        recorded.query?.startsWith('filter=')
        !recorded.query.contains('apikey=')
        header('apikey') == null
        header('Authorization') == 'Bearer token'
    }
}
