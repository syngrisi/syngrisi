@integration
Feature: Check Acceptance

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver

    Scenario: Acceptance - passed after fail [new, accept, fail, accept, passed]
        # first check
        When I create "1" tests with params:
        """
          filePath: files/A.png
          checkName: Check - 1
          testName: Acceptance
        """
        When I accept via http the 1st check with name "Check - 1"
        When I expect via http 1st check filtered as "name=Check - 1" matched:
        """
        markedAs: accepted
        status: [new]
        """
        When I expect via http 1st test filtered as "name=Acceptance - 1" matched:
        """
        markedAs: Accepted
        status: New
        """

        # second check before accept
        When I create "1" tests with params:
        """
          filePath: files/B.png
          checkName: Check - 1
          testName: Acceptance2
        """
        When I expect via http 2st check filtered as "name=Check - 1" matched:
        """
        markedAs: accepted
        status: [failed]
        """
        When I expect via http 1st test filtered as "name=Acceptance2 - 1" matched:
        """
        markedAs: Accepted
        status: Failed
        """
        # second check after accept
        When I accept via http the 2st check with name "Check - 1"

        Then I expect via http 2st check filtered as "name=Check - 1" matched:
        """
        markedAs: accepted
        status: [passed]
        """
        Then I expect via http 1st test filtered as "name=Acceptance2 - 1" matched:
        """
        markedAs: Accepted
        status: Passed
        """

        # third check before accept
        When I create "1" tests with params:
        """
          filePath: files/B.png
          checkName: Check - 1
          testName: Acceptance3
        """
        Then I expect via http 3st check filtered as "name=Check - 1" matched:
        """
        markedAs: accepted
        status: [passed]
        """
        Then I expect via http 1st test filtered as "name=Acceptance3 - 1" matched:
        """
        markedAs: Accepted
        status: Passed
        """

    Scenario: Acceptance - test acceptance statuses [Unaccepted, Partially, Accepted]
        When I create "1" tests with::
        """
          testName: "Acceptance"
          checks:
            - filePath: files/A.png
              checkName: Check - 1
            - filePath: files/B.png
              checkName: Check - 2
        """

        # Unaccepted
        When I expect via http 1st test filtered as "name=Acceptance" matched:
        """
        markedAs: Unaccepted
        status: New
        """

        # Partially
        When I accept via http the 1st check with name "Check - 1"
        When I expect via http 1st test filtered as "name=Acceptance" matched:
        """
        markedAs: Partially
        status: New
        """

        # Accepted
        When I accept via http the 1st check with name "Check - 2"
        When I expect via http 1st test filtered as "name=Acceptance" matched:
        """
        markedAs: Accepted
        status: New
        """

    Scenario: Acceptance - create check after remove accepted test [new, accept, delete, passed]
        # new
        When I create "1" tests with params:
        """
          filePath: files/A.png
          checkName: Check - 1
          testName: Acceptance
        """
        When I accept via http the 1st check with name "Check - 1"
        When I expect via http 1st check filtered as "name=Check - 1" matched:
        """
        markedAs: accepted
        status: [new]
        """
        When I expect via http 1st test filtered as "name=Acceptance - 1" matched:
        """
        markedAs: Accepted
        status: New
        """

        # accept
        When I accept via http the 1st check with name "Check - 1"


        # remove
        When I remove via http the 1st test with name "Acceptance - 1"
        Then I expect via http 1 baselines
        Then I expect exact "1" snapshot files

        # passed
        When I create "1" tests with params:
        """
          filePath: files/A.png
          checkName: Check - 1
          testName: Acceptance
        """
        When I accept via http the 1st check with name "Check - 1"
        When I expect via http 1st check filtered as "name=Check - 1" matched:
        """
        markedAs: accepted
        status: [passed]
        """
        When I expect via http 1st test filtered as "name=Acceptance - 1" matched:
        """
        markedAs: Accepted
        status: Passed
        """

    Scenario: Accept same check 2 times
    if you take one check 2 times, the baseline should not be duplicated

        When I create "1" tests with params:
        """
          testName: Baseline Accept
          checkName: Check - 1
        """
        When I accept via http the 1st check with name "Check - 1"
        Then I expect via http 1 baselines

        When I accept via http the 1st check with name "Check - 1"
        Then I expect via http 1 baselines

