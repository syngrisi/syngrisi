@integration
Feature: Regions works properly

    Background:
        Given I clear test VRS database
        Given I kill process which used port: "3001"
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

    Scenario: Create Region without saving
        When I open the url "http://vrs:3001/"
        When I wait for "3" seconds
        When I click on "region check" VRS test
        Then I expect that VRS test "region check" is unfolded
        When I click on the element "[name=region]"
        When I click on the element "[title='baseline snapshoot']"
        When I execute javascript code:
        """
        (()=>{
           return(baseline.allRects.length.toString());
        })()
        """
        When I wait for "1" seconds
        Then I expect the stored "js" object is equal:
        """
          0
        """

        When I click on the element "[name=add-region]"
        When I execute javascript code:
        """
         return (baseline.allRects.length.toString());
        """

        When I wait for "1" seconds
        Then I expect the stored "js" object is equal:
        """
          1
        """

        When I execute javascript code:
        """
        (()=>{
         const { left, top, width, height, fill, stroke, opacity } = baseline.getLastRegion();
         return([left, top, width, height, fill, stroke, opacity].toString());
        })()
        """
        Then I expect the stored "js" object is equal:
        """
          20,50,200,100,MediumVioletRed,rgba(100,200,200,0.5),0.5
        """

        When I refresh page
        When I wait for "2" seconds
        When I execute javascript code:
        """
         return(baseline.allRects.length.toString());
        """

        When I wait for "1" seconds
        Then I expect the stored "js" object is equal:
        """
          0
        """

    Scenario: Create Region with saving
        When I open the url "http://vrs:3001/"
        When I wait for "3" seconds
        When I click on "region check" VRS test
        Then I expect that VRS test "region check" is unfolded
        When I click on the element "[name=region]"
        When I wait for "2" seconds
        When I click on the element "[title='baseline snapshoot']"
        When I wait for "2" seconds
        When I click on the element "[name=add-region]"
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
        (()=>{
         const { left, top, width, height, fill, stroke, opacity } = baseline.getLastRegion()
         return [left, top, width, height, fill, stroke, opacity].toString()
        })()
        """
        Then I expect the stored "js" object is equal:
        """
          20,50,200,100,MediumVioletRed,rgba(100,200,200,0.5),0.5
        """

        When I click on the element "[name=save-snapshot]"

        When I refresh page
        When I wait for "2" seconds
        When I execute javascript code:
        """
         return baseline.allRects.length.toString()
        """
        When I wait for "1" seconds
        Then I expect the stored "js" object is equal:
        """
          1
        """

        When I execute javascript code:
        """
        (()=>{
         const { left, top, width, height, fill, stroke, opacity } = baseline.getLastRegion()
         return [Math.round(left), Math.round(top), Math.round(width), Math.round(height), fill, stroke, opacity].toString()
        })()
        """
        Then I expect the stored "js" object is equal:
        """
          20,50,200,100,MediumVioletRed,rgba(100,200,200,0.5),0.5
        """

    Scenario: Create Region with saving after change position
        When I open the url "http://vrs:3001/"
        When I wait for "3" seconds
        When I click on "region check" VRS test
        Then I expect that VRS test "region check" is unfolded
        When I click on the element "[name=region]"
        When I wait for "2" seconds
        When I click on the element "[title='baseline snapshoot']"
        When I wait for "1" seconds

        When I click on the element "[name=add-region]"
        When I execute javascript code:
        """
         return baseline.allRects.length.toString();
        """
        Then I expect the stored "js" object is equal:
        """
          1
        """

        When I execute javascript code:
        """
        (()=>{
         const { left, top, width, height, fill, stroke, opacity } = baseline.getLastRegion()
         return [left, top, width, height, fill, stroke, opacity].toString()
        })()
        """
        Then I expect the stored "js" object is equal:
        """
          20,50,200,100,MediumVioletRed,rgba(100,200,200,0.5),0.5
        """

        When I execute javascript code:
        """
        (()=>{
          baseline.getLastRegion().left = 300
          baseline.getLastRegion().top = 500
          baseline.canvas.renderAll()
          const { left, top, width, height, fill, stroke, opacity } = baseline.getLastRegion()
          return [Math.round(left), Math.round(top), Math.round(width), Math.round(height), fill, stroke, opacity].toString()
        })()
        """
        Then I expect the stored "js" object is equal:
        """
          300,500,200,100,MediumVioletRed,rgba(100,200,200,0.5),0.5
        """

        When I click on the element "[name=save-snapshot]"

        When I wait for "1" seconds
        When I refresh page
        When I wait for "2" seconds
        When I execute javascript code:
        """
         return baseline.canvas.getObjects().filter(x=>x.name==='ignore_rect').length.toString()
        """
        Then I expect the stored "js" object is equal:
        """
          1
        """

        When I execute javascript code:
        """
        (()=>{
         const { left, top, width, height, fill, stroke, opacity } = baseline.getLastRegion()
         console.log(baseline.getLastRegion())
         console.log(baseline.getLastRegion())
         console.log(baseline.getLastRegion())
         return [Math.round(left), Math.round(top), Math.round(width), Math.round(height), fill, stroke, opacity].toString()
        })()
        """

        Then I expect the stored "js" object is equal:
        """
          300,500,200,100,MediumVioletRed,rgba(100,200,200,0.5),0.5
        """

    Scenario: Create Region with saving - two regions
        When I open the url "http://vrs:3001/"
        When I wait for "3" seconds
        When I click on "region check" VRS test
        Then I expect that VRS test "region check" is unfolded
        When I click on the element "[name=region]"
        When I wait for "1" seconds
        When I click on the element "[title='baseline snapshoot']"
        When I wait for "1" seconds
        When I click on the element "[name=add-region]"
        When I click on the element "[name=add-region]"
        When I click on the element "[name=save-snapshot]"

        When I refresh page
        When I wait for "2" seconds
        When I execute javascript code:
        """
         return baseline.canvas.getObjects().filter(x=>x.name==='ignore_rect').length.toString()
        """
        When I wait for "1" seconds
        Then I expect the stored "js" object is equal:
        """
          2
        """

    Scenario: Delete Region with saving
        When I open the url "http://vrs:3001/"
        When I wait for "3" seconds
        When I click on "region check" VRS test
        Then I expect that VRS test "region check" is unfolded
        When I click on the element "[name=region]"
        When I wait for "1" seconds
        When I click on the element "[title='baseline snapshoot']"
        When I wait for "1" seconds

        When I click on the element "[name=add-region]"
        When I click on the element "[name=save-snapshot]"
        When I click on the element "#region-delete-icon-1"
        When I click on the element "[name=save-snapshot]"

        When I refresh page
        When I wait for "2" seconds
        When I execute javascript code:
        """
         return baseline.canvas.getObjects().filter(x=>x.name==='ignore_rect').length.toString()
        """
        When I wait for "1" seconds
        Then I expect the stored "js" object is equal:
        """
          0
        """

