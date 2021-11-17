@integration
Feature: Check Acceptance

    Background:
        Given I stop the Syngrisi server
        Given I clear test VRS database
        When I set env variables:
        """
          TEST: 1
          SYNGRISI_AUTH: 0
        """
        Given I start VRS server
        Given I setup VRS driver

    Scenario: Acceptance - one Test, one Check
        Given I start VRS session with parameters:
        """
          testName: "Accept one check"
        """
        When I check image with path: "files/A.png" as "new int check 1"

        When I stop VRS session

        # BEFORE ACCEPT
        When I open the app
        Then I wait and refresh page on element "span=Accept one check" for "3" seconds to exist
        Then I expect that VRS test "Accept one check" has "New" status
        Then I expect that VRS test "Accept one check" has "Unaccepted" accepted status
        When I click on "Accept one check" VRS test
        Then I expect that VRS test "Accept one check" is unfolded
        Then I expect that VRS check "1/1 new int check 1" has "New" status
        When I wait for "1" seconds
        Then I expect the "new int check 1" check has "not accept" acceptance status

        # AFTER ACCEPT
        When I accept the "new int check 1" check
        When I wait for "1" seconds
        Then I expect that VRS test "Accept one check" has "Accepted" accepted status
        Then I expect the "new int check 1" check has "accept" acceptance status
        Then I expect that the element "i.accept-button-icon" to have attribute "title" containing "Accepted by: Guest"
        Then I expect that the element "i.accept-button-icon" to have attribute "title" containing "Accepted date: <YYYY-MM-DD>"

        Then I expect that the element "canvas.snapshoot-canvas" to have attribute "title" containing "created by: Guest"

        When I refresh page
        When I wait for "3" seconds
        When I click on "Accept one check" VRS test
        When I wait for "3" seconds
        Then I expect the "new int check 1" check has "accept" acceptance status
        Then I expect that the element "i.accept-button-icon" to have attribute "title" containing "Accepted by: Guest"
        Then I expect that the element "i.accept-button-icon" to have attribute "title" containing "Accepted date: <YYYY-MM-DD>"

        Then I expect that the element "canvas.snapshoot-canvas" to have attribute "title" containing "accepted by: Guest"
        Then I expect that the element "canvas.snapshoot-canvas" to have attribute "title" containing "accepted date: <YYYY-MM-DD>"

    Scenario: Acceptance - two Test, one Check, accept First
        # FIRST TEST
        Given I start VRS session with parameters:
        """
          testName: "Accept two checks"
        """
        When I check image with path: "files/A.png" as "new int check 1"

        When I stop VRS session

        When I open the app
        Then I wait and refresh page on element "span=Accept two checks" for "3" seconds to exist
        Then I expect that VRS test "Accept two checks" has "New" status

        When I click on "Accept two checks" VRS test
        When I wait for "1" seconds
        Then I expect that VRS test "Accept two checks" is unfolded
        Then I expect that VRS check "1/1 new int check 1" has "New" status
        Then I expect that VRS test "Accept two checks" has "Unaccepted" accepted status

        Then I expect the "1/1 new int check 1" check has "not accept" acceptance status
        When I wait for "1" seconds
        When I accept the "1/1 new int check 1" check
        When I wait for "2" seconds
        Then I expect the "1/1 new int check 1" check has "accept" acceptance status
        Then I expect that VRS test "Accept two checks" has "Accepted" accepted status

        # check is test status doesn't recalculated wrongly
        When I refresh page
        Then I expect that VRS check "1/1 new int check 1" has "New" status
        Then I expect that VRS test "Accept two checks" has "Accepted" accepted status

        When I wait for "5" seconds

        # SECOND TEST
        Given I start VRS session with parameters:
        """
          testName: "Accept two checks"
        """
        When I check image with path: "files/A.png" as "new int check 1"
        When I stop VRS session
        When I wait for "3" seconds

        When I open the app

        When I wait for "2" seconds
        Then I expect that VRS test "Accept two checks" has "Passed" status

        When I click on "Accept two checks" VRS test
        Then I expect that VRS test "Accept two checks" is unfolded
        Then I expect that VRS check "1/1 new int check 1" has "Passed" status
        Then I expect that VRS test "Accept two checks" has "Accepted" accepted status

        When I wait for "1" seconds
        Then I expect the "1/1 new int check 1" check has "previously accept" acceptance status

    Scenario: Acceptance - two Test, one Check, Second failed, accept both
        # FIRST TEST
        When I create "1" tests with few checks:
        """
          testName: "second Failed accept both"
          checks:
            - filePath: files/A.png
              checkName: Check - 1
        """

        When I open the app
        Then I wait and refresh page on element "span=second Failed accept both" for "3" seconds to exist
        Then I expect that VRS test "second Failed accept both" has "New" status

        When I click on "second Failed accept both" VRS test
        When I wait for "3" seconds

        Then I expect that VRS test "second Failed accept both" is unfolded
        When I accept the "1/1 Check - 1" check
        When I wait for "1" seconds
        Then I expect that VRS check "1/1 Check - 1" has "New" status

        When I refresh page
        When I wait for "3" seconds
        When I click on "second Failed accept both" VRS test
        When I wait for "1" seconds
        Then I expect that VRS test "second Failed accept both" is unfolded
        When I wait for "1" seconds
        Then I expect that VRS check "1/1 Check - 1" has "New" status

        # SECOND TEST
        When I create "1" tests with few checks:
        """
          testName: "second Failed accept both"
          checks:
            - filePath: files/B.png
              checkName: Check - 1
        """
        When I open the app
        Then I wait and refresh page on element "span=second Failed accept both" for "3" seconds to exist
        Then I expect that VRS test "second Failed accept both" has "Failed" status

        When I click on "second Failed accept both" VRS test
        When I wait for "1" seconds
        Then I expect that VRS test "second Failed accept both" is unfolded
        Then I expect that VRS check "1/1 Check - 1" has "Failed" status

        When I accept the "1/1 Check - 1" check
        When I wait for "1" seconds
        Then I expect that VRS check "1/1 Check - 1" has "Passed" status

        When I refresh page
        When I wait for "3" seconds
        When I click on "second Failed accept both" VRS test
        When I wait for "1" seconds
        Then I expect that VRS test "second Failed accept both" is unfolded
        Then I expect that VRS check "1/1 Check - 1" has "Passed" status

    Scenario: Acceptance - two Test, one Check, accept Second
        # FIRST TEST
        Given I start VRS session with parameters:
        """
          testName: "Accept two checks"
        """
        When I check image with path: "files/A.png" as "new int check 1"

        When I stop VRS session

        When I open the app
        Then I wait and refresh page on element "span=Accept two checks" for "3" seconds to exist
        Then I expect that VRS test "Accept two checks" has "New" status

        When I click on "Accept two checks" VRS test
        When I wait for "1" seconds
        Then I expect that VRS test "Accept two checks" is unfolded
        Then I expect that VRS check "1/1 new int check 1" has "New" status
        Then I expect that VRS test "Accept two checks" has "Unaccepted" accepted status

        When I wait for "5" seconds

        # SECOND TEST
        Given I start VRS session with parameters:
        """
          testName: "Accept two checks"
        """
        When I check image with path: "files/A.png" as "new int check 1"
        When I stop VRS session
        When I wait for "3" seconds

        When I open the app

        When I wait for "2" seconds
        Then I expect that VRS test "Accept two checks" has "Passed" status

        When I click on "Accept two checks" VRS test
        Then I expect that VRS test "Accept two checks" is unfolded
        Then I expect that VRS check "1/1 new int check 1" has "Passed" status
        Then I expect that VRS test "Accept two checks" has "Unaccepted" accepted status

        When I wait for "2" seconds
        Then I expect the "1/1 new int check 1" check has "not accept" acceptance status
        When I accept the "1/1 new int check 1" check
        When I wait for "2" seconds
        Then I expect the "1/1 new int check 1" check has "accept" acceptance status
        Then I expect that VRS test "Accept two checks" has "Accepted" accepted status

        When I wait for "2" seconds
        Then I expect the "1/1 new int check 1" check has "accept" acceptance status
#        Then I expect that last "2" checks with ident contains "ident.new int check 1.1366x768.chrome.MacIntel" has not the same "baselineId"

    Scenario: Acceptance - three Test, one Check
        # FIRST TEST
        Given I start VRS session with parameters:
        """
          testName: "Acceptance - three Test, one Check"
        """
        When I check image with path: "files/A.png" as "new int check 1"

        When I stop VRS session

        When I open the app
        Then I wait and refresh page on element "span=Acceptance - three Test, one Check" for "3" seconds to exist
        Then I expect that VRS test "Acceptance - three Test, one Check" has "New" status

        When I click on "Acceptance - three Test, one Check" VRS test
        When I wait for "1" seconds
        Then I expect that VRS test "Acceptance - three Test, one Check" is unfolded
        Then I expect that VRS check "1/1 new int check 1" has "New" status
        Then I expect that VRS test "Acceptance - three Test, one Check" has "Unaccepted" accepted status

        When I wait for "1" seconds
        Then I expect the "1/1 new int check 1" check has "not accept" acceptance status
        When I accept the "1/1 new int check 1" check
        When I wait for "2" seconds
        Then I expect the "1/1 new int check 1" check has "accept" acceptance status
        Then I expect that VRS test "Acceptance - three Test, one Check" has "Accepted" accepted status

        # check is test status doesn't recalculated wrongly
        When I refresh page
        Then I expect that VRS check "1/1 new int check 1" has "New" status
        Then I expect that VRS test "Acceptance - three Test, one Check" has "Accepted" accepted status

        When I wait for "5" seconds

        # SECOND TEST
        Given I start VRS session with parameters:
        """
          testName: "Acceptance - three Test, one Check"
        """
        When I check image with path: "files/A.png" as "new int check 1"
        When I stop VRS session
        When I wait for "3" seconds

        When I open the app

        When I wait for "2" seconds
        Then I expect that VRS test "Acceptance - three Test, one Check" has "Passed" status

        When I click on "Acceptance - three Test, one Check" VRS test
        Then I expect that VRS test "Acceptance - three Test, one Check" is unfolded
        Then I expect that VRS check "1/1 new int check 1" has "Passed" status
        Then I expect that VRS test "Acceptance - three Test, one Check" has "Accepted" accepted status

        When I wait for "2" seconds
        Then I expect the "1/1 new int check 1" check has "previously accept" acceptance status

        # THIRD TEST
        Given I start VRS session with parameters:
        """
          testName: "Acceptance - three Test, one Check"
        """
        When I check image with path: "files/A.png" as "new int check 1"
        When I stop VRS session
        When I wait for "3" seconds

        When I open the app

        When I wait for "2" seconds
        Then I expect that VRS test "Acceptance - three Test, one Check" has "Passed" status

        When I click on "Acceptance - three Test, one Check" VRS test
        Then I expect that VRS test "Acceptance - three Test, one Check" is unfolded
        Then I expect that VRS check "1/1 new int check 1" has "Passed" status
        Then I expect that VRS test "Acceptance - three Test, one Check" has "Accepted" accepted status

        When I wait for "2" seconds
        Then I expect the "1/1 new int check 1" check has "previously accept" acceptance status

#        Then I expect that last "2" checks with ident contains "ident.new int check 1.1366x768.chrome.MacIntel" has the same "baselineId"

    Scenario: Acceptance - two Test, two Check
        # FIRST TEST
        Given I start VRS session with parameters:
        """
          testName: "Acceptance - two Test, two Check"
        """
        When I check image with path: "files/A.png" as "new int check 1"
        When I check image with path: "files/B.png" as "new int check 2"

        When I stop VRS session

        When I open the app
        Then I wait and refresh page on element "span=Acceptance - two Test, two Check" for "3" seconds to exist
        Then I expect that VRS test "Acceptance - two Test, two Check" has "New" status

        When I click on "Acceptance - two Test, two Check" VRS test
        When I wait for "1" seconds
        Then I expect that VRS test "Acceptance - two Test, two Check" is unfolded

        Then I expect that VRS check "1/2 new int check 1" has "New" status
        Then I expect that VRS check "2/2 new int check 2" has "New" status
        Then I expect that VRS test "Acceptance - two Test, two Check" has "Unaccepted" accepted status

        When I wait for "2" seconds
        Then I expect the "1/2 new int check 1" check has "not accept" acceptance status
        Then I expect the "2/2 new int check 2" check has "not accept" acceptance status
        When I accept the "1/2 new int check 1" check
        When I wait for "2" seconds
        Then I expect the "1/2 new int check 1" check has "accept" acceptance status
        Then I expect the "2/2 new int check 2" check has "not accept" acceptance status

        Then I expect that VRS test "Acceptance - two Test, two Check" has "Partially" accepted status

        # check is test status doesn't recalculated wrongly
        When I refresh page
        Then I expect that VRS check "1/2 new int check 1" has "New" status
        Then I expect that VRS check "2/2 new int check 2" has "New" status
        Then I expect that VRS test "Acceptance - two Test, two Check" has "Partially" accepted status

        When I wait for "5" seconds

        # SECOND TEST
        Given I start VRS session with parameters:
        """
          testName: "Acceptance - two Test, two Check"
        """
        When I check image with path: "files/A.png" as "new int check 1"
        When I check image with path: "files/B.png" as "new int check 2"
        When I stop VRS session
        When I wait for "3" seconds

        When I open the app

        When I wait for "2" seconds
        Then I expect that VRS test "Acceptance - two Test, two Check" has "Passed" status

        Then I expect that VRS test "Acceptance - two Test, two Check" has "Partially" accepted status

        When I click on "Acceptance - two Test, two Check" VRS test
        Then I expect that VRS test "Acceptance - two Test, two Check" is unfolded

        When I wait for "2" seconds
        Then I expect the "1/2 new int check 1" check has "previously accept" acceptance status
        Then I expect the "2/2 new int check 2" check has "not accept" acceptance status
        When I accept the "2/2 new int check 2" check
        When I wait for "2" seconds
        Then I expect the "1/2 new int check 1" check has "previously accept" acceptance status
        Then I expect the "2/2 new int check 2" check has "accept" acceptance status

        Then I expect that VRS check "1/2 new int check 1" has "Passed" status
        Then I expect that VRS check "2/2 new int check 2" has "Passed" status
        Then I expect that VRS test "Acceptance - two Test, two Check" has "Accepted" accepted status

    Scenario: Acceptance - two Test, three Check, accept, remove, check Test status
        # FIRST TEST
        Given I start VRS session with parameters:
        """
          testName: "Acceptance - two Test, three Check, accept, remove, check Test status"
        """
        When I check image with path: "files/A.png" as "new int check 1"
        When I check image with path: "files/B.png" as "new int check 2"
        When I check image with path: "files/B.png" as "new int check 3"

        When I stop VRS session

        When I open the app
        When I wait for "2" seconds
        Then I wait and refresh page on element "span=Acceptance - two Test, three Check, accept, remove, check Test status" for "5" seconds to exist
        Then I expect that VRS test "Acceptance - two Test, three Check, accept, remove, check Test status" has "New" status

        When I click on "Acceptance - two Test, three Check, accept, remove, check Test status" VRS test
        When I wait for "1" seconds
        Then I expect that VRS test "Acceptance - two Test, three Check, accept, remove, check Test status" is unfolded

        Then I expect that VRS check "1/3 new int check 1" has "New" status
        Then I expect that VRS check "2/3 new int check 2" has "New" status
        Then I expect that VRS check "3/3 new int check 3" has "New" status
        Then I expect that VRS test "Acceptance - two Test, three Check, accept, remove, check Test status" has "Unaccepted" accepted status

        When I wait for "2" seconds
        Then I expect the "1/3 new int check 1" check has "not accept" acceptance status
        Then I expect the "2/3 new int check 2" check has "not accept" acceptance status
        Then I expect the "3/3 new int check 3" check has "not accept" acceptance status
        When I accept the "1/3 new int check 1" check
#        When I accept the "2/2 new int check 2" check
        When I wait for "2" seconds
        Then I expect the "1/3 new int check 1" check has "accept" acceptance status
        Then I expect the "2/3 new int check 2" check has "not accept" acceptance status
        Then I expect the "3/3 new int check 3" check has "not accept" acceptance status


        When I wait for "2" seconds
        Then I expect that VRS test "Acceptance - two Test, three Check, accept, remove, check Test status" has "Partially" accepted status

        When I wait for "2" seconds
        When I delete the "1/3 new int check 1" check
        Then I expect that element "//div[text()='1/3 new int check 1']" is not displayed
        When I wait for "2" seconds

        Then I expect that VRS test "Acceptance - two Test, three Check, accept, remove, check Test status" has "Unaccepted" accepted status
        When I refresh page
        When I wait for "2" seconds
        Then I expect that VRS test "Acceptance - two Test, three Check, accept, remove, check Test status" has "Unaccepted" accepted status

        When I click on "Acceptance - two Test, three Check, accept, remove, check Test status" VRS test
        When I wait for "1" seconds
        When I accept the "1/2 new int check 2" check
        When I wait for "1" seconds
        Then I expect that VRS test "Acceptance - two Test, three Check, accept, remove, check Test status" has "Partially" accepted status
        When I refresh page
        When I wait for "2" seconds
        Then I expect that VRS test "Acceptance - two Test, three Check, accept, remove, check Test status" has "Partially" accepted status

        When I click on "Acceptance - two Test, three Check, accept, remove, check Test status" VRS test
        When I wait for "1" seconds
        When I accept the "2/2 new int check 3" check
        When I wait for "1" seconds
        Then I expect that VRS test "Acceptance - two Test, three Check, accept, remove, check Test status" has "Accepted" accepted status
        When I refresh page
        When I wait for "2" seconds
        Then I expect that VRS test "Acceptance - two Test, three Check, accept, remove, check Test status" has "Accepted" accepted status

        When I click on "Acceptance - two Test, three Check, accept, remove, check Test status" VRS test
        When I delete the "1/2 new int check 2" check
        Then I expect that VRS test "Acceptance - two Test, three Check, accept, remove, check Test status" has "Accepted" accepted status
        When I refresh page
        When I wait for "2" seconds
        Then I expect that VRS test "Acceptance - two Test, three Check, accept, remove, check Test status" has "Accepted" accepted status
