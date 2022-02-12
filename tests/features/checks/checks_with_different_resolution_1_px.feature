Feature: Checks with different resolutions 1px
    The 1px difference resolution should be ignored
    But this is applicable only if image was cropped by 1px from the bottom
#    ┌───────────┐   ┌───────────┐
#    │xxxxxxxxxxx│   │xxxxxxxxxxx│
#    │xxxxxxxxxxx│   │xxxxxxxxxxx│
#    │xxxxxxxxxxx│   │xxxxxxxxxxx│
#    │xxxxxxxxxxx│   │xxxxxxxxxxx│
#    │xxxxxxxxxxx│   │ooooooooooo│
#    └───────────┘   └───────────┘

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver

    Scenario: Two checks with identical image parts but different resolutions [1px, bottom]
        When I create "1" tests with params:
        """
          testName: Checks with different resolutions 1px
          checkName: Check - 1
          filePath: files/A_cropped_bottom_1_px.png
        """
        When I accept via http the 1st check with name "Check - 1"

        When I create "1" tests with params:
        """
          testName: Checks with different resolutions 1px
          checkName: Check - 1
          filePath: files/A.png
        """
        When I expect via http 2st test filtered as "name=Checks with different resolutions 1px - 1" matched:
        """
        status: Passed
        """

        When I expect via http 2st check filtered as "name=Check - 1" matched:
        """
        status: [passed]
        """
        When I open the app
        When I click on "Checks with different resolutions 1px - 1" VRS test
        When I open "Check - 1" view
        Then the element "#not-equal-resolution-char" contains the text "≠"
        Then  I expect that element "#not-equal-resolution-char" has the class "d-inline"
