package io.syngrisi.coreapi

import spock.lang.Specification

/**
 * Coverage beyond the JS tests, verifying parity of the remaining functionality:
 * compression round-trip, two-phase coreCheck, requestWithRetry, accept/update guards.
 */
class FunctionalitySpec extends Specification {

    private static Map domNode(String tag, int n = 0) {
        // builds a DomNode-ish tree; n children to control size
        return [
                tagName       : tag,
                attributes    : [id: 'x'],
                rect          : [x: 0, y: 0, width: 10, height: 10],
                computedStyles: [display: 'block'],
                children      : (0..<n).collect { domNode('span', 0) },
                text          : 'hello',
        ]
    }

    private SyngrisiApi fastApi(Map cfg = [url: 'http://localhost:3000/', apiKey: 'k']) {
        def api = new SyngrisiApi(cfg)
        api.retryDelayMs = 0
        return api
    }

    def "compression: small dump returned unchanged, not compressed"() {
        given:
        def small = domNode('div', 1)

        when:
        def result = Compression.compressDomDump(small)

        then:
        result instanceof String
        !Compression.isCompressedDomDump(result)
    }

    def "compression: large dump is compressed and round-trips"() {
        given:
        // Build a tree well over the 50KB threshold.
        def big = domNode('div', 4000)

        when:
        def compressed = Compression.compressDomDump(big)

        then:
        Compression.isCompressedDomDump(compressed)
        compressed.compressed == true
        compressed.originalSize > Compression.DOM_DUMP_COMPRESSION_THRESHOLD

        when:
        def restored = Compression.decompressDomDump(compressed)

        then:
        restored == big
    }

    def "compression: prepareDomDumpForTransfer flags"() {
        expect:
        Compression.prepareDomDumpForTransfer(domNode('div', 1)).isCompressed == false
        Compression.prepareDomDumpForTransfer(domNode('div', 4000)).isCompressed == true
    }

    def "compression: isCompressedDomDump true/false"() {
        expect:
        Compression.isCompressedDomDump([data: 'abc', compressed: true, originalSize: 10])
        !Compression.isCompressedDomDump([data: 'abc', compressed: false])
        !Compression.isCompressedDomDump('plain')
        !Compression.isCompressedDomDump(null)
    }

    private Map validCheckParams() {
        return [
                name              : 'homepage',
                viewport          : '1200x800',
                browserName       : 'chrome',
                os                : 'macOS',
                app               : 'MyProject',
                branch            : 'master',
                testId            : '0123456789abcdef01234567',
                suite             : 'suite',
                browserVersion    : '89',
                browserFullVersion: '89.0.4389.82',
                hashCode          : 'a' * 64,
        ]
    }

    def "two-phase coreCheck: file sent only on phase 2"() {
        given:
        def api = fastApi()
        def calls = []
        def responses = [[status: 'requiredFileData'], [status: 'new', _id: 'abc']]
        api.requestExecutor = { Map req ->
            calls << req
            return responses[calls.size() - 1]
        }

        when:
        def result = api.coreCheck('IMAGE'.bytes, validCheckParams())

        then:
        calls.size() == 2
        // phase 1: no file field
        !calls[0].multipart.any { it.name == 'file' }
        calls[0].multipart.any { it.name == 'hashcode' }
        // phase 2: file present
        calls[1].multipart.any { it.name == 'file' && it.bytes != null }
        result.status == 'new'
    }

    def "coreCheck returns phase 1 result when not requiredFileData"() {
        given:
        def api = fastApi()
        def calls = []
        api.requestExecutor = { Map req ->
            calls << req
            return [status: 'passed', _id: 'id1']
        }

        when:
        def result = api.coreCheck('IMG'.bytes, validCheckParams())

        then:
        calls.size() == 1
        result.status == 'passed'
    }

    def "addMessageIfCheckFailed wires links on failed status"() {
        given:
        def api = fastApi()
        api.requestExecutor = { Map req -> [status: 'failed', _id: 'CID'] }

        when:
        def result = api.coreCheck('IMG'.bytes, validCheckParams())

        then:
        result.status == 'failed'
        result.vrsGroupLink == "'http://localhost:3000/?checkId=CID&modalIsOpen=true'"
        result.vrsDiffLink == result.vrsGroupLink
        result.message.contains('follow the link')
    }

    def "requestWithRetry: 401 then 200 eventually succeeds"() {
        given:
        def api = fastApi([url: 'http://localhost:3000/'])
        int attempts = 0
        api.requestExecutor = { Map req ->
            attempts++
            if (attempts == 1) {
                throw new HttpError(401, 'Unauthorized', 'nope')
            }
            return ['ident-a', 'ident-b']
        }

        when:
        def result = api.getIdent()

        then:
        attempts == 2
        result == ['ident-a', 'ident-b']
    }

    def "requestWithRetry: non-401 error returns errorObject without retry"() {
        given:
        def api = fastApi([url: 'http://localhost:3000/'])
        int attempts = 0
        api.requestExecutor = { Map req ->
            attempts++
            throw new HttpError(500, 'Internal Server Error', 'boom')
        }

        when:
        def result = api.getIdent()

        then:
        attempts == 1
        result.error == true
        result.statusCode == 500
    }

    def "requestWithRetry: 401 on all attempts returns errorObject after maxRetries"() {
        given:
        def api = fastApi([url: 'http://localhost:3000/'])
        int attempts = 0
        api.requestExecutor = { Map req ->
            attempts++
            throw new HttpError(401, 'Unauthorized', 'nope')
        }

        when:
        def result = api.getIdent()

        then:
        attempts == 3
        result.error == true
        result.statusCode == 401
    }

    def "acceptCheck guards: missing ids return errorObject without HTTP call"() {
        given:
        def api = fastApi()
        boolean called = false
        api.requestExecutor = { Map req -> called = true; [:] }

        expect:
        api.acceptCheck(null, 'b').error == true
        api.acceptCheck('c', null).error == true
        !called
    }

    def "updateBaseline guard: missing baselineId returns errorObject without HTTP call"() {
        given:
        def api = fastApi()
        boolean called = false
        api.requestExecutor = { Map req -> called = true; [:] }

        expect:
        api.updateBaseline(null, [ignoreRegions: '[]']).error == true
        !called
    }

    def "acceptCheck happy path sends PUT json"() {
        given:
        def api = fastApi()
        Map captured = null
        api.requestExecutor = { Map req -> captured = req; [ok: true] }

        when:
        def result = api.acceptCheck('CHK', 'BASE')

        then:
        captured.method == 'PUT'
        captured.url == 'http://localhost:3000/v1/checks/CHK/accept'
        captured.json == [baselineId: 'BASE']
        result.ok == true
    }

    def "DOM collector script constant + accessor"() {
        expect:
        DomCollector.COLLECT_DOM_TREE_SCRIPT.contains('function collectDomTree()')
        DomCollector.COLLECT_DOM_TREE_SCRIPT.contains('return collectDomTree();')
        DomCollector.getCollectDomTreeScript() == DomCollector.COLLECT_DOM_TREE_SCRIPT
        Schemas.STYLES_TO_CAPTURE.contains('boxShadow')
        Schemas.DOM_DUMP_COMPRESSION_THRESHOLD == 50 * 1024
    }
}
