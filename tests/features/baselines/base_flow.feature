@integration
Feature: Base baseline flow

    Background:
        Given I clear Database and stop Server
        When I set env variables:
        """
        SYNGRISI_TEST_MODE: 1
        SYNGRISI_AUTH: 0
        """
        Given I start Server
        When I create via http test user

        When I stop the Syngrisi server

        When I set env variables:
        """
        SYNGRISI_TEST_MODE: 0
        SYNGRISI_AUTH: 1
        """
        Given I start Server
        Given I setup driver

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
        # login by user
        When I login via http with user:"j_doe@gmail.com" password "Password-123"
        When I generate via http API key for the User
        When I set the API key in config

    @e2e
    Scenario: Baseline, base flow: 2 accepted checks with same image
        When I create "1" tests with params:
        """
          testName: Baseline Base Flow
          checkName: Check - 1
          filePath: files/A.png
        """

        # check baseline without acceptance
        Then I expect via http 0 baselines

        When I login with user:"j_doe@gmail.com" password "Password-123"

        When I accept via http the 1st check with name "Check - 1"

        Then I expect via http 1 baselines
        Then I expect via http 1st baseline with:
        """
        name: 'Check - 1'
        markedByUsername: 'j_doe@gmail.com'
        markedAs: 'accepted'
        """

        # create check - 2
        When I create "1" tests with params:
        """
          testName: Baseline Base Flow
          checkName: Check - 1
          filePath: files/A.png
        """

        Then I expect via http 1 baselines
        When I accept via http the 1st check with name "Check - 1"

        Then I expect via http 1st baseline with:
       """
        name: 'Check - 1'
        markedByUsername: 'j_doe@gmail.com'
        markedAs: 'accepted'
        """

    Scenario: Baseline, base flow: 2 unaccepted checks
        When I create "1" tests with params:
        """
          testName: Baseline Base Flow
          checkName: Check - 1
        """
        Then I expect via http 0 baselines

        When I create "1" tests with params:
        """
          testName: Baseline Base Flow
          checkName: Check - 1
        """
        Then I expect via http 0 baselines

