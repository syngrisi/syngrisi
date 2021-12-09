Feature: Remove old tests

    Background:
        Given I stop the Syngrisi server
        Given I clear test VRS database
        When I set env variables:
        """
          TEST: 1
          SYNGRISI_AUTH: 0
        """
        Given I start VRS server
        When I create via http test user

        Given I stop the Syngrisi server
        When I set env variables:
        """
        TEST: 1
        SYNGRISI_AUTH: 1
        """
        Given I start VRS server

        Given I setup VRS driver

        # create user
        When I login via http with user:"Test" password "123"
        When I generate via http API key for the User
        When I set the API key in config

    Scenario: Remove old test [unaccepted]
        When I create "1" tests with params:
        """
          testName: Remove old tests
          checkName: Check - 1
        """
        When I update via http test with params:
        """
          startDate: <currentDate-10>
        """
        When I wait for "2" seconds
        Then I expect via http that "Remove old tests - 1" test exist exactly "1" times
        Then I expect via http that "Check - 1" check exist exactly "1" times
        Then I expect via http 1 baselines
        Then I expect exact "1" snapshoot files

        When I remove via http tests that older than "9" days
        When I wait for "3" seconds
        Then I expect via http that "Remove old tests - 1" test exist exactly "0" times
        Then I expect via http that "Check - 1" check exist exactly "0" times
        Then I expect via http 0 baselines
        Then I expect exact "0" snapshoot files

    Scenario: Remove old tests [unaccepted_old, accepted_fresh]
        When I create "1" tests with params:
        """
          testName: Remove old tests, old
          checkName: Check - 1
        """
        When I update via http test with params:
        """
          startDate: <currentDate-10>
        """
        When I create "1" tests with params:
        """
          testName: Remove old tests, fresh
          checkName: Check - 1
        """

        When I accept via http the 2st check with name "Check - 1"
        When I wait for "2" seconds
        Then I expect via http that "Remove old tests, old - 1" test exist exactly "1" times
        Then I expect via http that "Remove old tests, fresh - 1" test exist exactly "1" times
        Then I expect via http that "Check - 1" check exist exactly "2" times
        Then I expect via http 2 baselines
        Then I expect exact "1" snapshoot files

        When I remove via http tests that older than "9" days
        When I wait for "2" seconds
        Then I expect via http that "Remove old tests, old - 1" test exist exactly "0" times
        Then I expect via http that "Remove old tests, fresh - 1" test exist exactly "1" times
        Then I expect via http that "Check - 1" check exist exactly "1" times
        Then I expect via http 2 baselines
        Then I expect exact "1" snapshoot files

    Scenario: Try to remove too old tests
        When I create "1" tests with params:
        """
          testName: Remove old tests
          checkName: Check - 1
        """
        When I update via http test with params:
        """
          startDate: <currentDate-10>
        """
        When I wait for "2" seconds
        Then I expect via http that "Remove old tests - 1" test exist exactly "1" times
        Then I expect via http that "Check - 1" check exist exactly "1" times
        Then I expect via http 1 baselines
        Then I expect exact "1" snapshoot files

        When I remove via http tests that older than "11" days
        When I wait for "3" seconds
        Then I expect via http that "Remove old tests - 1" test exist exactly "1" times
        Then I expect via http that "Check - 1" check exist exactly "1" times
        Then I expect via http 1 baselines
        Then I expect exact "1" snapshoot files

    Scenario: Remove old test [accepted]
        When I create "1" tests with params:
        """
          testName: Remove old tests
          checkName: Check - 1
        """
        When I update via http test with params:
        """
          startDate: <currentDate-10>
        """
        When I accept via http the 1st check with name "Check - 1"
        When I wait for "2" seconds
        Then I expect via http that "Remove old tests - 1" test exist exactly "1" times
        Then I expect via http that "Check - 1" check exist exactly "1" times
        Then I expect via http 2 baselines
        Then I expect exact "1" snapshoot files

        When I remove via http tests that older than "9" days
        When I wait for "3" seconds
        Then I expect via http that "Remove old tests - 1" test exist exactly "0" times
        Then I expect via http that "Check - 1" check exist exactly "0" times
        Then I expect via http 2 baselines
        Then I expect exact "1" snapshoot files
