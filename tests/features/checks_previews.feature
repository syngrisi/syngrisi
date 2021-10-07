@integration
Feature: Checks previews

    Background:
        Given I clear test VRS database
        Given I stop the Syngrisi server
        Given I start VRS server with parameters:
        """
          port: 3001
          databaseName: VRSdbTest
          baseLineFolder: ./baselinesTest/
        """
        Given I setup VRS driver with parameters:
        """
          url: "http://vrs:3001/"
        """

        Given I start VRS session with parameters:
        """
          testName: "region check"
        """
        When I open the url "http://vrs:3001/"
        When I check image with path: "files/A.png" as "region"
        Then the "check" "status" should be "new"

        When I stop VRS session

    Scenario: Create Ignore Region check if it present on Main Grid
        When I open the url "http://vrs:3001/"
        When I wait for "3" seconds
        When I click on "region check" VRS test
        Then I expect that VRS test "region check" is unfolded
        When I click on the element "[name=region]"
        When I wait for "2" seconds
        When I click on the element "[title='baseline snapshoot']"
        When I wait for "2" seconds
        When I click on the element "[name=ignore-regions]"
        When I wait for "1" seconds
        When I execute javascript code:
        """
         return baseline.allRects.length.toString();
        """
        When I wait for "1" seconds
        Then I expect the stored "js" object is equal:
        """
          1
        """

        When I execute javascript code:
        """
         const { left, top: top1, width, height, fill, stroke, opacity } = baseline.getLastRegion()
         return [left, top1, width, height, fill, stroke, opacity].toString()
        """
        Then I expect the stored "js" object is equal:
        """
          20,50,200,100,MediumVioletRed,rgba(100,200,200,0.5),0.5
        """

        When I click on the element "[name=save-baseline]"

        When I open the url "http://vrs:3001/"
        When I wait for "3" seconds
        When I execute javascript code:
        """
          return Object.keys(baselines).length.toString();
        """
        Then I expect the stored "js" object is equal:
        """
          0
        """

        When I click on "region check" VRS test
        Then I expect that VRS test "region check" is unfolded

        When I execute javascript code:
        """
          return Object.keys(baselines).length.toString();
        """
        Then I expect the stored "js" object is equal:
        """
          1
        """

        When I execute javascript code:
        """
          const { left, top: top1, width, height, fill, stroke, opacity } = baselines[Object.keys(baselines)[0]].getLastRegion();
          return [left, top1, width, height, fill, stroke, opacity].toString();
        """
        Then I expect the stored "js" object is equal:
        """
          4.8448145344436035,12.112036336109007,48.44814534443603,24.224072672218018,MediumVioletRed,rgba(100,200,200,0.5),0.5
        """
