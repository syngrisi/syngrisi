package io.syngrisi.coreapi

import spock.lang.Specification

/** Ports tests/SyngrisiApi.test.ts — constructor + transformOs. */
class SyngrisiApiSpec extends Specification {

    def "should create instance with valid config"() {
        when:
        def api = new SyngrisiApi([url: 'http://localhost:3000/', apiKey: 'test-api-key'])

        then:
        api instanceof SyngrisiApi
    }

    def "should throw error with invalid config (missing url)"() {
        when:
        new SyngrisiApi([apiKey: 'test'])

        then:
        thrown(IllegalArgumentException)
    }

    def "should create instance without apiKey (optional)"() {
        when:
        def api = new SyngrisiApi([url: 'http://localhost:3000/'])

        then:
        api instanceof SyngrisiApi
    }

    def "transformOs maps platforms correctly"() {
        expect:
        Utils.transformOs(input) == expected

        where:
        input        | expected
        'UnknownOS'  | 'UnknownOS'
        'macintel'   | 'macOS'
        'win32'      | 'WINDOWS'
        'linux'      | 'linux'
        'darwin'     | 'darwin'
    }
}
