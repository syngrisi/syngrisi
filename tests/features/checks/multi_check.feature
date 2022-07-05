@integration
Feature: Few Checks into the same Test

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver

    Scenario: Tho checks with different images [new, new]
        When I create "1" tests with:
        """
          testName: "Test"
          checks:
            - filePath: files/A.png
              checkName: Check - 1
            - filePath: files/B.png
              checkName: Check - 2
        """

        When I expect via http 1st test filtered as "name=Test" matched:
        """
          markedAs: Unaccepted
          status: New
        """
        When I expect via http 1st check filtered as "name=Check - 1" matched:
        """
         status: [new]
        """
        When I expect via http 1st check filtered as "name=Check - 2" matched:
        """
         status: [new]
        """

    Scenario: Tho checks with different images [new, new, -> new, passed]
        When I create "1" tests with:
        """
          testName: "Test"
          checks:
            - filePath: files/A.png
              checkName: Check - 1
            - filePath: files/B.png
              checkName: Check - 2
        """
        When I accept via http the 1st check with name "Check - 1"
        When I create "1" tests with:
        """
          testName: "Test"
          checks:
            - filePath: files/A.png
              checkName: Check - 1
        """
        When I expect via http 2st test filtered as "name=Test" matched:
        """
          markedAs: Accepted
          status: Passed
        """
        When I expect via http 2st check filtered as "name=Check - 1" matched:
        """
         status: [passed]
        """
        When I expect via http 1st check filtered as "name=Check - 2" matched:
        """
         status: [new]
        """

    Scenario: Tho checks with different images [new, new, -> passed, passed]
        When I create "1" tests with:
        """
          testName: "Test"
          checks:
            - filePath: files/A.png
              checkName: Check - 1
            - filePath: files/B.png
              checkName: Check - 2
        """
        When I accept via http the 1st check with name "Check - 1"
        When I accept via http the 1st check with name "Check - 2"
        When I create "1" tests with:
        """
          testName: "Test"
          checks:
            - filePath: files/A.png
              checkName: Check - 1
            - filePath: files/B.png
              checkName: Check - 2
        """
        When I expect via http 2st test filtered as "name=Test" matched:
        """
          markedAs: Accepted
          status: Passed
        """
        When I expect via http 1st test filtered as "name=Test" matched:
        """
          markedAs: Accepted
          status: New
        """

        When I expect via http 2st check filtered as "name=Check - 1" matched:
        """
          markedAs: accepted
          status: [passed]
        """
        When I expect via http 2st check filtered as "name=Check - 2" matched:
        """
          markedAs: accepted
          status: [passed]
        """

    Scenario: Tho checks with different images [new, new, -> failed, failed]
        When I create "1" tests with:
        """
          testName: "Test"
          checks:
            - filePath: files/A.png
              checkName: Check - 1
            - filePath: files/A.png
              checkName: Check - 2
        """
        When I accept via http the 1st check with name "Check - 1"
        When I accept via http the 1st check with name "Check - 2"
        When I create "1" tests with:
        """
          testName: "Test"
          checks:
            - filePath: files/B.png
              checkName: Check - 1
            - filePath: files/B.png
              checkName: Check - 2
        """
        When I expect via http 2st test filtered as "name=Test" matched:
        """
          markedAs: Accepted
          status: Failed
        """
        When I expect via http 1st test filtered as "name=Test" matched:
        """
          markedAs: Accepted
          status: New
        """

        When I expect via http 2st check filtered as "name=Check - 1" matched:
        """
          markedAs: accepted
          status: [failed]
        """
        When I expect via http 2st check filtered as "name=Check - 2" matched:
        """
          markedAs: accepted
          status: [failed]
        """
