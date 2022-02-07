Feature: Crashed check
    This feature check if test is failed when comparison is failed and server gives the 500 error.
    This test use Resemble.Js issue when library crashed with specific images and env variable COMPARE_METHOD=2
    to enable the library, issue link: https://github.com/Automattic/node-canvas/issues/1735

    Background:
        Given I clear Database and stop Server
        When I set env variables:
        """
        COMPARE_METHOD: "2"
        """
        Given I start Server and start Driver

    Scenario: Crashed
        Given I set window size: "1366x768"

        Given I start VRS session with parameters:
        """
        testName: "Crashed test"
        """
        When I check image with path: "files/crash_0.png" as "crashed"
        When I stop VRS session

        Given I start VRS session with parameters:
        """
        testName: "Crashed test"
        """
        When I check image with path: "files/crash_1.png" as "crashed" and suppress exceptions
        Then I expect the stored "error" object is contain:
        """
        Response code 500 (Internal Server Error)
        """
        When I stop VRS session

        When I open the app

        Then I wait and refresh page on element "span=Failed" for "3" seconds to exist
        Then I expect that 1th VRS test "Crashed test" has "Failed" status

        Then I expect that 2th VRS test "Crashed test" has "New" status

        When I click on "Crashed test" VRS test
        When I wait for "2" seconds
        Then I expect that VRS test "Crashed test" is unfolded

        Then I expect that VRS check "1/1 crashed" has "Failed" status
        When I wait for "1" seconds
        When I execute javascript code:
        """
        document.getElementsByClassName('group-links-view')[0].style.height='300px'
        document.getElementsByClassName('group-links-view')[0].style.width='300px'
        """
        When I click on the element "//div[contains(., 'crashed') and @name='check-name']/../../../..//div[@class='group-links-view']"
        When I wait for "2" seconds

        Then the element "//div[contains(text(), 'failReasons')]/../div[2]" contains the text "internal_server_error"
        Then I expect that element "//*[@title='toggle diff (D)']" is not displayed
