@fast-server
Feature: Accept check via SDK

    Background:
        When I set env variables:
            """
      SYNGRISI_TEST_MODE: true
      SYNGRISI_AUTH: false
            """
        When I create via http test user

        When I set env variables:
            """
      SYNGRISI_TEST_MODE: false
      SYNGRISI_AUTH: true
            """

        # set API key
        When I login via http with user:"Test" password "123456aA-"
        When I generate via http API key for the User
        When I set the API key in config
        When I start Driver

    Scenario: Accept new check via SDK acceptCheck method
        Given I create "1" tests with:
            """
            testName: TestName
            checks:
              - checkName: SDKAcceptCheckNew
                filePath: files/B.png
            """
        When I accept via SDK the 1st check with name "SDKAcceptCheckNew"

        Then I expect via http 1st check filtered as "name=SDKAcceptCheckNew" matched:
            """
      name: SDKAcceptCheckNew
      status: [new]
      markedAs: accepted
      markedByUsername: Test
            """

    Scenario: Accept failed check via SDK acceptCheck method
        # Create baseline first
        Given I create "1" tests with:
            """
            testName: TestNameFailed
            checks:
              - checkName: SDKAcceptCheckFailed
                filePath: files/A.png
            """
        # Accept baseline to set it
        When I accept via http the 1st check with name "SDKAcceptCheckFailed"

        # Create second check with different image (this will fail comparison)
        Given I create "1" tests with:
            """
            testName: TestNameFailed
            checks:
              - checkName: SDKAcceptCheckFailed
                filePath: files/B.png
            """

        # Accept the failed check via SDK
        When I accept via SDK the 1st check with name "SDKAcceptCheckFailed"

        Then I expect via http 1st check filtered as "name=SDKAcceptCheckFailed" matched:
            """
      name: SDKAcceptCheckFailed
      markedAs: accepted
      markedByUsername: Test
            """
