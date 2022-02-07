@integration
Feature: Regions works properly

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver

        Given I start VRS session with parameters:
        """
          testName: "region check"
        """
        When I open the app
        When I check image with path: "files/A.png" as "region"
        Then the "check" "status" should be "new"
        When I stop VRS session

    Scenario: Create Region without saving
        When I open the app
        When I wait for "3" seconds
        When I click on "region check" VRS test
        Then I expect that VRS test "region check" is unfolded
        When I click on the element "[name=region]"
        When I wait for "1" seconds
        When I execute javascript code:
        """
           return(mainView.allRects.length.toString());
        """
        When I wait for "1" seconds
        Then I expect the stored "js" object is equal:
        """
          0
        """

        When I click on the element "#ignore-regions"
        When I execute javascript code:
        """
         return (mainView.allRects.length.toString());
        """

        When I wait for "1" seconds
        Then I expect the stored "js" object is equal:
        """
          1
        """

        When I execute javascript code:
        """
         const { left, top: top1, width, height, fill, stroke, opacity } = mainView.getLastRegion();
         return([left, top1, width, height, fill, stroke, opacity].toString());
        """
        Then I expect the stored "js" object is equal:
        """
          20,50,200,100,MediumVioletRed,black,0.5
        """

        When I refresh page
        When I wait for "2" seconds
        When I execute javascript code:
        """
         return(mainView.allRects.length.toString());
        """

        When I wait for "1" seconds
        Then I expect the stored "js" object is equal:
        """
          0
        """

    Scenario: Create Region with saving
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
        Then I expect the stored "js" object is equal:
        """
          1
        """

        When I execute javascript code:
        """
         const { left, top: top1, width, height, fill, stroke, opacity } = mainView.getLastRegion()
         return [left, top1, width, height, fill, stroke, opacity].toString()
        """
        Then I expect the stored "js" object is equal:
        """
          20,50,200,100,MediumVioletRed,black,0.5
        """

        When I click on the element "#save-baseline"

        When I refresh page
        When I wait for "2" seconds
        When I execute javascript code:
        """
         return mainView.allRects.length.toString()
        """
        When I wait for "1" seconds
        Then I expect the stored "js" object is equal:
        """
          1
        """

        When I execute javascript code:
        """
         const { left, top: top1, width, height, fill, stroke, opacity } = mainView.getLastRegion()
         return [Math.round(left), Math.round(top1), Math.round(width), Math.round(height), fill, stroke, opacity].toString()
        """
        Then I expect the stored "js" object is equal:
        """
          20,50,202,102,MediumVioletRed,black,0.5
        """

    Scenario: Create Region with saving after change position
        When I open the app
        When I wait for "3" seconds
        When I click on "region check" VRS test
        Then I expect that VRS test "region check" is unfolded
        When I click on the element "[name=region]"
        When I wait for "2" seconds

        When I click on the element "#ignore-regions"
        When I execute javascript code:
        """
         return mainView.allRects.length.toString();
        """
        Then I expect the stored "js" object is equal:
        """
          1
        """

        When I execute javascript code:
        """
         const { left, top: top1, width, height, fill, stroke, opacity } = mainView.getLastRegion()
         return [left, top1, width, height, fill, stroke, opacity].toString()
        """
        Then I expect the stored "js" object is equal:
        """
          20,50,200,100,MediumVioletRed,black,0.5
        """

        When I execute javascript code:
        """
          mainView.getLastRegion().left = 300
          mainView.getLastRegion().top = 500
          mainView.canvas.renderAll()
          const { left, top: top1, width, height, fill, stroke, opacity } = mainView.getLastRegion()
          return [Math.round(left), Math.round(top1), Math.round(width), Math.round(height), fill, stroke, opacity].toString()
        """
        Then I expect the stored "js" object is equal:
        """
          300,500,200,100,MediumVioletRed,black,0.5
        """

        When I click on the element "#save-baseline"

        When I wait for "1" seconds
        When I refresh page
        When I wait for "2" seconds
        When I execute javascript code:
        """
         return mainView.canvas.getObjects().filter(x=>x.name==='ignore_rect').length.toString()
        """
        Then I expect the stored "js" object is equal:
        """
          1
        """

        When I execute javascript code:
        """
         const { left, top: top1, width, height, fill, stroke, opacity } = mainView.getLastRegion()
         console.log(mainView.getLastRegion())
         console.log(mainView.getLastRegion())
         console.log(mainView.getLastRegion())
         return [Math.round(left), Math.round(top1), Math.round(width), Math.round(height), fill, stroke, opacity].toString()
        """

        Then I expect the stored "js" object is equal:
        """
          300,500,202,102,MediumVioletRed,black,0.5
        """

    Scenario: Create Region with saving - two regions
        When I open the app
        When I wait for "3" seconds
        When I click on "region check" VRS test
        Then I expect that VRS test "region check" is unfolded
        When I click on the element "[name=region]"
        When I wait for "1" seconds
        When I click on the element "#ignore-regions"
        When I click on the element "#ignore-regions"
        When I click on the element "#save-baseline"

        When I refresh page
        When I wait for "2" seconds
        When I execute javascript code:
        """
         return mainView.canvas.getObjects().filter(x=>x.name==='ignore_rect').length.toString()
        """
        When I wait for "1" seconds
        Then I expect the stored "js" object is equal:
        """
          2
        """

    Scenario: Delete Region with saving
        When I open the app
        When I wait for "3" seconds
        When I click on "region check" VRS test
        Then I expect that VRS test "region check" is unfolded
        When I click on the element "[name=region]"
        When I wait for "1" seconds

        When I click on the element "#ignore-regions"
        When I click on the element "#save-baseline"
        When I execute javascript code:
        """
        mainView.canvas.setActiveObject(mainView.getLastRegion()) // make region active
        """
        When I click on the element "#delete-rect"
        When I click on the element "#save-baseline"

        When I refresh page
        When I wait for "2" seconds
        When I execute javascript code:
        """
         return mainView.canvas.getObjects().filter(x=>x.name==='ignore_rect').length.toString()
        """
        When I wait for "1" seconds
        Then I expect the stored "js" object is equal:
        """
          0
        """

