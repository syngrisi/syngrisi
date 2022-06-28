Feature: Checks with different resolutions

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver

    # the things is - if we have two snapshots with identical top part but
    # different resolution e.q.:
    # ┌────────────┐    ┌────────────┐
    # │xxxxxxxxxxxx│    │xxxxxxxxxxxx│
    # │xxxxxxxxxxxx│    │xxxxxxxxxxxx│
    # └────────────┘    ├────────────┤
    #                   │oooooooooooo│
    #                   │oooooooooooo│
    #                   │oooooooooooo│
    #                   │oooooooooooo│
    #                   └────────────┘
    # in the case ressemlejs count such images identical and return mishmash percentage as '0'
    # in previous versions of Syngrisi such checks was marked a 'Passed', this is the wrong behaviour
    # expected results: check marked as 'Failed' and has '≠' character in the checkview header
    # and the '≠' character 'span' element has title attribute with baseline and actual attribute
    Scenario: Two checks with identical image parts but different resolutions
        When I create "1" tests with params:
        """
          testName: Checks with different resolutions
          checkName: Check - 1
          filePath: files/A_cropped.png
        """
        When I accept via http the 1st check with name "Check - 1"
        When I create "1" tests with params:
        """
          testName: Checks with different resolutions
          checkName: Check - 1
          filePath: files/A.png
        """
        Then I expect via http 2st test filtered as "name=Checks with different resolutions - 1" matched:
        """
        status: Failed
        """

        Then I expect via http 2st check filtered as "name=Check - 1" matched:
        """
        status: [failed]
        """
        Then I expect "check" saved object:
        """
          failReasons: [ 'wrong_dimensions' ]
        """
        When I open the app
        When I click on "Checks with different resolutions - 1" VRS test
        When I open "Check - 1" view
        Then the element "#not-equal-resolution-char" contains the text "≠"
        Then the element "//div[contains(text(), 'failReasons')]/../div[2]" contains the text "wrong_dimensions"


    Scenario: Two checks [wrong_dimensions, different_images]
        When I create "1" tests with params:
        """
          testName: Checks with different resolutions
          checkName: Check - 1
          filePath: files/A_cropped.png
        """
        When I accept via http the 1st check with name "Check - 1"

        When I create "1" tests with params:
        """
          testName: Checks with different resolutions
          checkName: Check - 1
          filePath: files/B.png
        """

        When I expect via http 2st test filtered as "name=Checks with different resolutions - 1" matched:
        """
        status: Failed
        """

        When I expect via http 2st check filtered as "name=Check - 1" matched:
        """
        status: [failed]
        """
        Then I expect "check" saved object:
        """
          failReasons: [ 'wrong_dimensions', 'different_images' ]
        """
        When I open the app
        When I click on "Checks with different resolutions - 1" VRS test
        When I open "Check - 1" view
        Then the element "#not-equal-resolution-char" contains the text "≠"
        Then I expect that element "#not-equal-resolution-char" is displayed
        Then the element "#mismatch_percentage" contains the text "(0.58%)"
