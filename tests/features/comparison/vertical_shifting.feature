@visual @comparison @shifting
Feature: Vertical Shifting

    Background:
        Given I clear Database and stop Server
        When I set env variables:
        """
        V_SHIFTING:1
        """
        Given I start Server and start Driver

    @smoke
    Scenario: Down-Up 3 pix
    Down-Up - because before make a comparison we crop bottom pixels of baseline and top pixels of actual image

        When I create "1" tests with params:
        """
          testName: "Top shifting"
          checkName: Check - 1
          filePath: files/vShift.png
          vShifting: 3
        """
        When I accept via http the 1st check with name "Check - 1"

        When I create "1" tests with params:
        """
          testName: "Top shifting"
          checkName: Check - 1
          filePath: files/vShift_top.png
          vShifting: 3
        """

        Then I expect via http 2st test filtered as "name=Top shifting - 1" matched:
        """
        status: Passed
        """

        Then I expect via http 2st check filtered as "name=Check - 1" matched:
        """
        status: [passed]
        """
        Then I expect "check" saved object:
        """
          vOffset: 3
          topStablePixels: 3
        """
        When I open the app
        When I click on "Top shifting - 1" VRS test
        When I open "Check - 1" view
        Then the element "#vertical-shifting-char" contains the text "⇅"

    Scenario: Up-Down 3 pix
    Up-Down - because before make a comparison we crop top pixels of baseline and bottom pixels of actual image

        When I create "1" tests with params:
        """
          testName: "Bottom shifting"
          checkName: Check - 1
          filePath: files/vShift.png
          vShifting: 3
        """
        When I accept via http the 1st check with name "Check - 1"

        When I create "1" tests with params:
        """
          testName: "Bottom shifting"
          checkName: Check - 1
          filePath: files/vShift_bottom.png
          vShifting: 3
        """

        Then I expect via http 2st test filtered as "name=Bottom shifting - 1" matched:
        """
        status: Passed
        """

        Then I expect via http 2st check filtered as "name=Check - 1" matched:
        """
        status: [passed]
        """
        Then I expect "check" saved object:
        """
          vOffset: 3
          topStablePixels: 3
        """

    Scenario: Down-Up to low threshold [threshold - 1px, shifting - 3px]

        When I create "1" tests with params:
        """
          testName: "Top shifting"
          checkName: Check - 1
          filePath: files/vShift.png
          vShifting: 1
        """
        When I accept via http the 1st check with name "Check - 1"

        When I create "1" tests with params:
        """
          testName: "Top shifting"
          checkName: Check - 1
          filePath: files/vShift_top.png
          vShifting: 1
        """

        Then I expect via http 2st test filtered as "name=Top shifting - 1" matched:
        """
        status: Failed
        """

        Then I expect via http 2st check filtered as "name=Check - 1" matched:
        """
        status: [failed]
        """
        Then I expect "check" saved object:
        """
          vOffset: 1
          topStablePixels: 1
        """
        When I open the app
        When I click on "Top shifting - 1" VRS test
        When I open "Check - 1" view
        Then the element "#vertical-shifting-char" contains the text "⇅"

