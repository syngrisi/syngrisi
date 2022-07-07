@integration
Feature: Checks previews

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver
        When I create "1" tests with params:
        """
          testName: "region check"
          checkName: region
        """

    Scenario: Create Ignore Region check if it present on Main Grid
        When I accept via http the 1st check with name "region"
        When I open the app
        When I wait for "3" seconds
        When I click on "region check - 1" VRS test
        When I wait for "2" seconds
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

        When I click on "region check - 1" VRS test
        When I wait for "2" seconds
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
        8.602150537634408,21.50537634408602,86.88172043010752,43.87096774193548,MediumVioletRed,rgba(100,200,200,0.5),0.5
        """
