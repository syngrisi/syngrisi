@smoke
Feature: Remove old checks

    Background:
        Given I clear Database and stop Server
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
        Given I start Server and start Driver

        # create user
        When I login via http with user:"Test" password "123"
        When I generate via http API key for the User
        When I set the API key in config

    Scenario: Remove old checks [unaccepted]
        When I create "1" tests with:
        """
          testName: TestName
          checks:
            - checkName: CheckName
        """
        When I update via http check with params:
        """
          createdDate: <currentDate-10>
        """
        Then I expect via http that "CheckName" check exist exactly "1" times
        Then I expect exact "1" snapshot files

        When I remove via http checks that older than "9" days
        Then I expect via http that "CheckName" check exist exactly "0" times
        Then I expect via http 0 baselines
        Then I expect exact "0" snapshot files

    Scenario: Remove old check [unaccepted, unaccepted]
        When I create "1" tests with:
        """
          testName: TestName
          checks:
            - checkName: CheckName
        """
        When I update via http check with params:
        """
          createdDate: <currentDate-10>
        """

        When I create "1" tests with:
        """
          testName: TestName
          checks:
            - checkName: CheckName
        """
        When I update via http check with params:
        """
          createdDate: <currentDate-10>
        """

        Then I expect via http that "CheckName" check exist exactly "2" times
        Then I expect exact "1" snapshot files

        When I remove via http checks that older than "9" days
        Then I expect via http that "CheckName" check exist exactly "0" times
        Then I expect via http 0 baselines
        Then I expect exact "0" snapshot files

    Scenario: Remove old check [accepted_old, prev_accepted_old_passed]
        When I create "1" tests with:
        """
          testName: TestName
          checks:
            - checkName: CheckName
        """
        When I accept via http the 1st check with name "CheckName"
        When I update via http check with params:
        """
          createdDate: <currentDate-10>
        """
        Then I expect via http that "CheckName" snapshot exist exactly "1" times

        When I create "1" tests with:
        """
          testName: TestName
          checks:
            - checkName: CheckName
        """
        When I update via http check with params:
        """
          createdDate: <currentDate-10>
        """
        Then I expect via http that "CheckName" snapshot exist exactly "2" times

        Then I expect via http that "CheckName" check exist exactly "2" times
        Then I expect exact "1" snapshot files

        When I remove via http checks that older than "9" days
        Then I expect via http that "CheckName" check exist exactly "0" times
        Then I expect via http 1 baselines
        Then I expect exact "1" snapshot files

    Scenario: Remove old check [accepted_old, prev_accepted_new_passed]
        When I open the app
        When I create "1" tests with:
        """
          testName: TestName
          checks:
            - checkName: CheckName
        """
        When I accept via http the 1st check with name "CheckName"
        When I update via http check with params:
        """
          createdDate: <currentDate-10>
        """
        Then I expect via http that "CheckName" snapshot exist exactly "1" times

        When I create "1" tests with:
        """
          testName: TestName
          checks:
            - checkName: CheckName
        """

        Then I expect via http that "CheckName" check exist exactly "2" times
        Then I expect via http that "CheckName" snapshot exist exactly "2" times
        Then I expect exact "1" snapshot files

        When I remove via http checks that older than "9" days
        Then I expect via http that "CheckName" check exist exactly "1" times
        Then I expect via http that "CheckName" snapshot exist exactly "2" times
        Then I expect via http 1 baselines
        Then I expect exact "1" snapshot files

    Scenario: Remove old check [accepted_old, prev_accepted_old_failed]
        When I create "1" tests with:
        """
          testName: TestName
          checks:
            - checkName: CheckName
              filePath: files/A.png
        """
        When I accept via http the 1st check with name "CheckName"
        When I update via http check with params:
        """
          createdDate: <currentDate-10>
        """
        Then I expect via http that "CheckName" snapshot exist exactly "1" times

        When I create "1" tests with:
        """
          testName: TestName
          checks:
            - checkName: CheckName
              filePath: files/B.png
        """

        When I update via http check with params:
        """
          createdDate: <currentDate-10>
        """
        Then I expect via http that "CheckName" check exist exactly "2" times
        # baseline, actual, diff
        Then I expect via http that "CheckName" snapshot exist exactly "3" times
        Then I expect exact "3" snapshot files

        When I remove via http checks that older than "9" days

        Then I expect via http that "CheckName" check exist exactly "0" times
        Then I expect via http that "CheckName" snapshot exist exactly "1" times
        Then I expect via http 1 baselines
        Then I expect exact "1" snapshot files

    Scenario: Remove old check [accepted_old, 1_prev_accepted_old_failed, accepted_old, 10_prev_accepted_old]
        When I create "1" tests with:
        """
          testName: TestName
          checks:
            - checkName: CheckName
              filePath: files/A.png
        """
        When I accept via http the 1st check with name "CheckName"
        When I update via http check with params:
        """
          createdDate: <currentDate-10>
        """
        Then I expect via http that "CheckName" snapshot exist exactly "1" times

        When I create "1" tests with:
        """
          testName: TestName
          checks:
            - checkName: CheckName
              filePath: files/B.png
        """

        When I update via http check with params:
        """
          createdDate: <currentDate-10>
        """
        When I accept via http the 2st check with name "CheckName"

        Then I expect via http that "CheckName" check exist exactly "2" times
        # baseline, actual, diff
        Then I expect via http that "CheckName" snapshot exist exactly "3" times
        Then I expect exact "3" snapshot files


        When I create "10" tests with:
        """
          testName: TestName
          checks:
            - checkName: CheckName
              filePath: files/B.png
        """
        When I update via http last "10" checks with params:
        """
           name: CheckName
           createdDate: <currentDate-10>
        """

        When I wait for "5" seconds
        Then I expect via http that "CheckName" check exist exactly "12" times
        # 1 baseline 10 actual and 2 diff
        Then I expect via http that "CheckName" snapshot exist exactly "13" times
        Then I expect exact "3" snapshot files

        When I remove via http checks that older than "9" days

        Then I expect via http that "CheckName" check exist exactly "0" times
        Then I expect via http that "CheckName" snapshot exist exactly "2" times
        Then I expect via http 2 baselines
        Then I expect exact "2" snapshot files

    Scenario: Remove old check [accepted_old, 1_prev_accepted_old_failed, accepted_old, 10_accepted_new]
        When I create "1" tests with:
        """
          testName: TestName
          checks:
            - checkName: CheckName
              filePath: files/A.png
        """
        When I accept via http the 1st check with name "CheckName"
        When I update via http check with params:
        """
          createdDate: <currentDate-10>
        """
        Then I expect via http that "CheckName" snapshot exist exactly "1" times

        When I create "1" tests with:
        """
          testName: TestName
          checks:
            - checkName: CheckName
              filePath: files/B.png
        """

        When I update via http check with params:
        """
          createdDate: <currentDate-10>
        """
        When I accept via http the 2st check with name "CheckName"

        Then I expect via http that "CheckName" check exist exactly "2" times
        # baseline, actual, diff
        Then I expect via http that "CheckName" snapshot exist exactly "3" times
        Then I expect exact "3" snapshot files


        When I create "1" tests with:
        """
          testName: TestName
          checks:
            - checkName: CheckName
              filePath: files/A.png
        """

        When I update via http check with params:
        """
          createdDate: <currentDate-10>
        """

        Then I expect via http that "CheckName" check exist exactly "3" times
        # baseline, actual, diff
        Then I expect via http that "CheckName" snapshot exist exactly "5" times
        Then I expect exact "4" snapshot files

        When I accept via http the 3st check with name "CheckName"

        When I create "9" tests with:
        """
          testName: TestName
          checks:
            - checkName: CheckName
              filePath: files/A.png
        """

        When I wait for "5" seconds
        Then I expect via http that "CheckName" check exist exactly "12" times
        # 1 baseline 10 actual and 2 diff
        Then I expect via http that "CheckName" snapshot exist exactly "14" times
        Then I expect exact "4" snapshot files

        When I remove via http checks that older than "9" days

        Then I expect via http that "CheckName" check exist exactly "9" times
        Then I expect via http that "CheckName" snapshot exist exactly "12" times
        Then I expect via http 3 baselines
        Then I expect exact "2" snapshot files
