@integration
Feature: Base baseline flow

    Background:
        Given I clear test VRS database
        When I stop the Syngrisi server
        When I set env variables:
        """
        TEST: 1
        SYNGRISI_AUTH: 0
        """
        Given I start VRS server
        When I create via http test user

        When I stop the Syngrisi server

        When I set env variables:
        """
        TEST: 0
        SYNGRISI_AUTH: 1
        """
        Given I start VRS server
        Given I setup VRS driver

        When I login via http with user:"Test" password "123"
        When I create via http user as:"Test" with params:
        """
        {
            "username": "i_ivanov@gmail.com",
            "firstName": "Ivan",
            "lastName": "Ivanov",
            "role": "user",
            "password": "Password-123"
        }
        """
         # login by user
        When I login via http with user:"i_ivanov@gmail.com" password "Password-123"
        When I generate API key for the User
        When I set the API key in config

    @e2e
    Scenario: Baseline, base flow: 2 accepted checks
        When I create "1" tests with params:
        """
          testName: Baseline Base Flow
          checkName: Check - 1
        """

        # check baseline without acceptance
        Then I expect via http 1 baselines
        Then I expect via http 1st baseline with:
        """
          name: 'Check - 1'
          markedByUsername: ''
          markedAs: ''
        """

        When I login with user:"i_ivanov@gmail.com" password "Password-123"

        # accept check, check baselines
        When I go to "main" page
        When I wait for "2" seconds
        Then I expect that VRS test "Baseline Base Flow - 1" has "New" status
        Then I expect that VRS test "Baseline Base Flow - 1" has "Unaccepted" accepted status

        When I click on "Baseline Base Flow - 1" VRS test
        When I wait for "2" seconds
        Then I expect that VRS test "Baseline Base Flow - 1" is unfolded
        When I click on the element "a.accept-button"
        When I click on the element "a.accept-option"
        When I wait for "3" seconds

        Then I expect via http 2 baselines
        Then I expect via http 1st baseline with:
        """
        name: 'Check - 1'
        markedByUsername: ''
        markedAs: ''
        """

        Then I expect via http 2st baseline with:
        """
        name: 'Check - 1'
        markedByUsername: 'i_ivanov@gmail.com'
        markedAs: 'accepted'
        """

        # create check - 2
        When I create "1" tests with params:
        """
          filePath: files/A.png
          testName: Baseline Base Flow
          checkName: Check - 1
        """

        Then I expect via http 2 baselines

        # accept check, check baselines - 2
        When I go to "main" page
        When I wait for "2" seconds
        Then I expect that VRS test "Baseline Base Flow - 1" has "Passed" status
        Then I expect that VRS test "Baseline Base Flow - 1" has "Accepted" accepted status

        Then I expect via http 2 baselines
        Then I expect via http 1st baseline with:
        """
        name: 'Check - 1'
        markedByUsername: ''
        markedAs: ''
        """

        Then I expect via http 2st baseline with:
        """
        name: 'Check - 1'
        markedByUsername: 'i_ivanov@gmail.com'
        markedAs: 'accepted'
        """
        When I stop the Syngrisi server

    Scenario: Baseline, base flow: 2 unaccepted checks
        When I create "1" tests with params:
        """
          testName: Baseline Base Flow
          checkName: Check - 1
        """

        # check baseline without acceptance
        Then I expect via http 1 baselines
        Then I expect via http 1st baseline with:
        """
        name: 'Check - 1'
        markedByUsername: ''
        markedAs: ''
        """

        # create check - 2
        When I create "1" tests with params:
        """
          testName: Baseline Base Flow
          checkName: Check - 1
        """

        Then I expect via http 1 baselines
        Then I expect via http 1st baseline with:
        """
        name: 'Check - 1'
        markedByUsername: ''
        markedAs: ''
        """

