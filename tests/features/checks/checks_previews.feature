@integration
Feature: Checks previews

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver
        When I create "2" tests with params:
        """
          testName: "region check"
          checkName: Check - 1
        """
        Given I start VRS session with parameters:
        """
          testName: "region check"
        """
        When I open the app
        When I check image with path: "files/A.png" as "region"
        Then the "check" "status" should be "new"

        When I stop VRS session

    Scenario: Create Ignore Region check if it present on Main Grid
        When I open the app
        When I wait for "3" seconds
        When I click on "region check" VRS test
        Then I expect that VRS test "region check" is unfolded
        When I click on the element "[name=region]"
        When I wait for "2" seconds
        When I click on the element "#ignore-regions"
        When I wait for "1" seconds
        When I execute javascript code:
        """
         return mainView.allRects.length.toString();
        """
        When I wait for "1" seconds
        Then I expect the stored "js" string is equal:
        """
          1
        """

        When I execute javascript code:
        """
         const { left, top: top1, width, height, fill, stroke, opacity } = mainView.getLastRegion()
         return [left, top1, width, height, fill, stroke, opacity].toString()
        """
        Then I expect the stored "js" string is equal:
        """
          20,50,200,100,MediumVioletRed,black,0.5
        """

        When I click on the element "#save-baseline"

        When I open the app
        When I wait for "3" seconds
        When I execute javascript code:
        """
          return Object.keys(baselines).length.toString();
        """
        Then I expect the stored "js" string is equal:
        """
          0
        """

        When I click on "region check" VRS test
        Then I expect that VRS test "region check" is unfolded

        When I execute javascript code:
        """
          return Object.keys(baselines).length.toString();
        """
        Then I expect the stored "js" string is equal:
        """
          1
        """

        When I execute javascript code:
        """
          const { left, top: top1, width, height, fill, stroke, opacity } = baselines[Object.keys(baselines)[0]].getLastRegion();
          return [left, top1, width, height, fill, stroke, opacity].toString();
        """
        Then I expect the stored "js" string is equal:
        """
        6.349206349206349,15.873015873015872,64.12698412698413,32.38095238095239,MediumVioletRed,rgba(100,200,200,0.5),0.5
        """
