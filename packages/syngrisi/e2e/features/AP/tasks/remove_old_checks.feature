Feature: Task - Remove old checks

    Background:
        Given I clear Database and stop Server
        When I set env variables:
        """
          SYNGRISI_TEST_MODE: true
          SYNGRISI_AUTH: false
          SYNGRISI_AUTO_REMOVE_CHECKS_POLL_INTERVAL_MS: 1000
        """
        Given I start Server
        When I create via http test user

        Given I stop the Syngrisi server
        When I set env variables:
        """
        SYNGRISI_TEST_MODE: true
        SYNGRISI_AUTH: true
        SYNGRISI_AUTO_REMOVE_CHECKS_POLL_INTERVAL_MS: 1000
        """
        Given I start Server and start Driver

        # create user
        When I login via http with user:"Test" password "123456aA-"
        When I generate via http API key for the User
        When I set the API key in config
        When I start Driver

    @smoke
    Scenario: Remove old checks [unaccepted]
        When I create "1" tests with:
        """
          testName: TestName
          checks:
            - checkName: unaccepted
        """
        When I update via http check with params:
        """
          createdDate: <currentDate-10>
        """
        Then I expect via http that "unaccepted" check exist exactly "1" times
        Then I expect via http that "unaccepted" snapshot exist exactly "1" times
        Then I expect via http 0 baselines
        Then I expect exact "1" snapshot files

        When I remove via http checks that older than "9" days

        Then I expect via http that "unaccepted" check exist exactly "0" times
        Then I expect via http that "unaccepted" snapshot exist exactly "0" times
        Then I expect via http 0 baselines
        Then I expect exact "0" snapshot files

    Scenario: Remove old check [unaccepted, unaccepted_fail]
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
        Then I expect via http that "CheckName" snapshot exist exactly "2" times
        Then I expect via http 0 baselines
        Then I expect exact "1" snapshot files


        When I remove via http checks that older than "9" days

        Then I expect via http that "CheckName" check exist exactly "0" times
        Then I expect via http that "CheckName" snapshot exist exactly "0" times
        Then I expect via http 0 baselines
        Then I expect exact "0" snapshot files

    @smoke
    Scenario: Remove old checks [unaccepted_old_A, accepted_new_B]
    The old unaccepted check(and related items) should be removed since it have another ident (name),
    not have any baseline and related to new checks snapshots

        When I create "1" tests with:
        """
          testName: TestName
          checks:
            - checkName: unaccepted_old
              filePath: files/A.png
        """
        When I update via http last "1" checks with params:
        """
          name: unaccepted_old
          createdDate: <currentDate-10>
        """

        When I create "1" tests with:
        """
          testName: TestName_2
          checks:
            - checkName: accepted_new
              filePath: files/B.png
        """
        When I accept via http the 1st check with name "accepted_new"

        Then I expect via http that "unaccepted_old" check exist exactly "1" times
        Then I expect via http that "accepted_new" check exist exactly "1" times
        Then I expect via http that "unaccepted_old" snapshot exist exactly "1" times
        Then I expect via http that "accepted_new" snapshot exist exactly "1" times
        Then I expect via http 1 baselines
        Then I expect exact "2" snapshot files

        When I remove via http checks that older than "9" days

        Then I expect via http that "unaccepted_old" check exist exactly "0" times
        Then I expect via http that "accepted_new" check exist exactly "1" times
        Then I expect via http that "unaccepted_old" snapshot exist exactly "0" times
        Then I expect via http that "accepted_new" snapshot exist exactly "1" times
        Then I expect via http 1 baselines
        Then I expect exact "1" snapshot files

    Scenario: Remove old checks [accepted_old_A, accepted_new_B]
    Nothing expect of check item  will be removed

        When I create "1" tests with:
        """
          testName: TestName
          checks:
            - checkName: CheckName
              filePath: files/A.png
        """
        When I accept via http the 1st check with name "CheckName"

        When I update via http last "1" checks with params:
        """
          name: CheckName
          createdDate: <currentDate-10>
        """

        When I create "1" tests with:
        """
          testName: TestName_2
          checks:
            - checkName: CheckName_2
              filePath: files/B.png
        """
        When I accept via http the 1st check with name "CheckName_2"

        When I update via http last "1" checks with params:
        """
          name: CheckName_2
          createdDate: <currentDate-20>
        """
        Then I expect via http that "^CheckName$" check exist exactly "1" times
        Then I expect via http that "^CheckName$" snapshot exist exactly "1" times

        Then I expect via http that "CheckName_2" check exist exactly "1" times
        Then I expect via http that "CheckName_2" snapshot exist exactly "1" times

        Then I expect via http 2 baselines
        Then I expect exact "2" snapshot files

        When I remove via http checks that older than "11" days

        Then I expect via http that "^CheckName$" check exist exactly "1" times
        Then I expect via http that "^CheckName$" snapshot exist exactly "1" times

        Then I expect via http that "CheckName_2" check exist exactly "0" times
        Then I expect via http that "CheckName_2" snapshot exist exactly "1" times

        Then I expect via http 2 baselines
        Then I expect exact "2" snapshot files

    Scenario: Auto removal task removes outdated checks based on settings
        When I create "1" tests with:
        """
          testName: AutoCleanupOld
          checks:
            - checkName: auto_old
              filePath: files/A.png
        """
        When I update via http check with params:
        """
          createdDate: <currentDate-12>
        """

        When I create "1" tests with:
        """
          testName: AutoCleanupNew
          checks:
            - checkName: auto_fresh
              filePath: files/B.png
        """

        Then I expect via http that "auto_old" check exist exactly "1" times
        Then I expect via http that "auto_fresh" check exist exactly "1" times

        When I update via http setting "auto_remove_old_checks" with params:
        """
          value:
            days: 10
            lastRunAt: <currentDate-20>
          enabled: true
        """

        Then I wait up to 60 seconds via http that "auto_old" check exist exactly "0" times
        Then I expect via http that "auto_fresh" check exist exactly "1" times
        Then I expect via http that "auto_fresh" snapshot exist exactly "1" times
        Then I expect exact "1" snapshot files
