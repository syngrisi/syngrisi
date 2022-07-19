@smoke
Feature: Remove Inconsistent items

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver

    Scenario: Abandoned File
        When I create "1" tests with params:
        """
          testName: TestName
          checkName: CheckName
        """
        Then I expect exact "1" snapshot files
        Given I stop Server
        When I clear database
        Given I start Server and start Driver

        When I create "1" tests with params:
        """
          testName: TestName
          checkName: CheckName
        """
        Then I expect exact "2" snapshot files
        When I remove via http Inconsistent items
        Then I expect exact "1" snapshot files

    Scenario: Abandoned Snapshot
        When I create "1" tests with params:
        """
          testName: TestName
          checkName: CheckName
        """
        Then I expect exact "1" snapshot files
        When I open the app
        Then I expect "1" occurrences of Existing "[title=CheckName]"

        When I clear screenshots folder
        Then I expect exact "0" snapshot files

        When I remove via http Inconsistent items
        When I refresh page

        Then I expect "0" occurrences of Existing "[title=CheckName]"

    Scenario: Empty Test and Suite
        When I create "1" tests with params:
        """
          suite: SuiteName
          testName: TestName
          checkName: CheckName
        """

        When I open the app
        Then I expect "1" occurrences of Existing "span=TestName - 1"
        Then I expect "1" occurrences of Existing "span=SuiteName"
        When I remove via http 1st check with name "CheckName"
        When I refresh page
        Then I expect "0" occurrences of Existing "span=TestName - 1"
        Then I expect "1" occurrences of Existing "span=SuiteName"
        When I expect via http 1st test filtered as "name=TestName - 1" matched:
        """
        status: New
        """
        Then I expect via http that "TestName - 1" test exist exactly "1" times
        When I remove via http Inconsistent items
        Then I expect via http that "TestName - 1" test exist exactly "0" times
        When I refresh page
        Then I expect "0" occurrences of Existing "span=SuiteName"

    Scenario: Empty Run
        When I create "1" tests with params:
        """
          run: RunName
          testName: TestName
          checkName: CheckName
        """
        When I remove via http 1st check with name "CheckName"
        When I open the app
        When I go to "runs" page
        Then I expect "1" occurrences of Existing "span=RunName"
        When I remove via http Inconsistent items
        When I refresh page
        Then I expect "0" occurrences of Existing "span=RunName"
