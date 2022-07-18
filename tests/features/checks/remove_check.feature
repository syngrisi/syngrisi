@integration
Feature: Baseline - Remove checks

    Background:
        Given I clear Database and stop Server
        When I set env variables:
        """
          TEST: 1
          SYNGRISI_AUTH: 0
        """
        Given I start Server
        When I create via http test user

        Given I stop the Syngrisi server
        When I set env variables:
        """
          TEST: 0
          SYNGRISI_AUTH: 1
        """
        Given I start Server and start Driver

        # create user
        When I login via http with user:"Test" password "123"
        When I create via http user as:"Test" with params:
        """
        {
            "username": "j_doe@gmail.com",
            "firstName": "John",
            "lastName": "Doe",
            "role": "user",
            "password": "Password-123"
        }
        """
        When I login via http with user:"j_doe@gmail.com" password "Password-123"
        When I generate via http API key for the User
        When I set the API key in config

    @e2e
    Scenario: Remove Checks, [unaccepted]
        # create check
        When I create "1" tests with params:
        """
          testName: Baseline Base Flow
          checkName: Check - 1
        """
        # check baseline without acceptance
        When I parse via http "actual" snapshot for 1st check with name "Check - 1"
        Then I expect exact "1" snapshot files

        # delete single check
        When I login with user:"j_doe@gmail.com" password "Password-123"
        When I wait for "2" seconds

        When I click on "Baseline Base Flow - 1" VRS test
        When I wait for "2" seconds
        Then I expect that VRS test "Baseline Base Flow - 1" is unfolded
        When I click on the element "a.remove-button"
        When I click on the element "a.remove-option"
        When I wait for "3" seconds

        Then I expect that element "span=Check - 1" does not exist
        Then I expect that element "span=Baseline Base Flow - 1" does not exist

        Then I expect via http that "Check - 1" check exist exactly "0" times
        Then I expect via http that "Baseline Base Flow - 1" test exist exactly "1" times
        Then I expect exact "0" snapshot files
        Then I expect via http 0 baselines

    Scenario: Remove Checks, [accepted]
        # create check
        When I create "1" tests with params:
        """
          testName: Baseline Base Flow
          checkName: Check - 1
        """
        When I login via http with user:"Test" password "123"
        When I accept via http the 1st check with name "Check - 1"

        When I wait for "2" seconds

        # delete 1 check
        When I remove via http 1st check with name "Check - 1"
        Then I expect via http 1 baselines
        Then I expect exact "1" snapshot files

    Scenario: Remove Checks, [unaccepted, unaccepted]
        # create check
        When I create "1" tests with params:
        """
          testName: Baseline Base Flow
          checkName: Check - 1
        """

        When I create "1" tests with params:
        """
          testName: Baseline Base Flow
          checkName: Check - 1
        """
        When I wait for "2" seconds

        # delete 1 check
        When I remove via http 1st check with name "Check - 1"
        Then I expect via http 0 baselines
        Then I expect exact "1" snapshot files

        # delete 2 check
        When I remove via http 1st check with name "Check - 1"
        Then I expect via http 0 baselines
        Then I expect exact "0" snapshot files

    Scenario: Remove Checks, [unaccepted, accepted]
        # create check
        When I create "1" tests with params:
        """
          testName: Baseline Base Flow
          checkName: Check - 1
        """

        When I create "1" tests with params:
        """
          testName: Baseline Base Flow
          checkName: Check - 1
        """
        # accept 2nd check, check baselines
        When I accept via http the 1st check with name "Check - 1"
        When I expect via http 1st check filtered as "name=Check - 1" matched:
        """
          markedAs: accepted
        """
        # delete 1 check
        When I remove via http 1st check with name "Check - 1"
        Then I expect via http 1 baselines
        Then I expect exact "1" snapshot files

        # delete 2 check
        When I remove via http 1st check with name "Check - 1"
        Then I expect via http 1 baselines
        Then I expect exact "1" snapshot files

    Scenario: Remove Checks, [accepted, accepted]
        # create check
        When I create "1" tests with params:
        """
          testName: Baseline Base Flow
          checkName: Check - 1
        """
        When I accept via http the 1st check with name "Check - 1"
        Then I expect via http 1 baselines

        When I create "1" tests with params:
        """
          testName: Baseline Base Flow
          checkName: Check - 1
        """
        When I accept via http the 2st check with name "Check - 1"
        Then I expect via http 2 baselines

        Then I expect via http 1st check filtered as "name=Check - 1" matched:
        """
          markedAs: accepted
        """
        Then I expect via http 2st check filtered as "name=Check - 1" matched:
        """
          markedAs: accepted
        """

        # delete 1 check
        When I remove via http 1st check with name "Check - 1"
        Then I expect via http 2 baselines
        Then I expect exact "1" snapshot files

        # delete 2 check
        When I remove via http 1st check with name "Check - 1"
        Then I expect via http 2 baselines
        Then I expect exact "1" snapshot files

    Scenario: Remove Checks, [accepted, failed]
        # create check
        When I create "1" tests with params:
        """
          testName: Baseline Base Flow
          checkName: Check - 1
          filePath: files/A.png
        """
        When I accept via http the 1st check with name "Check - 1"
        Then I expect via http 1 baselines

        When I create "1" tests with params:
        """
          testName: Baseline Base Flow
          checkName: Check - 1
          filePath: files/B.png
        """
        Then I expect via http 1 baselines

        Then I expect via http 1st check filtered as "name=Check - 1" matched:
        """
          status: [new]
          markedAs: accepted
        """

        Then I expect via http 2st check filtered as "name=Check - 1" matched:
        """
          status: [failed]
          markedAs: accepted
        """

        # delete failed
        When I remove via http 2st check with name "Check - 1"
        Then I expect via http 1 baselines
        Then I expect exact "1" snapshot files

        # delete new
        When I remove via http 1st check with name "Check - 1"
        Then I expect via http 1 baselines
        Then I expect exact "1" snapshot files
