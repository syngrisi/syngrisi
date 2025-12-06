@smoke @fast-server
Feature: Check details - Regions

   Background:
      When I open the app
      When I clear local storage
      Given I create "1" tests with:
         """
      testName: TestName
      checks:
          - checkName: CheckName
            filePath: files/A.png
         """
      When I accept via http the 1st check with name "CheckName"

      When I go to "main" page
      When I wait for test "TestName" to appear in table
      When I unfold the test "TestName"
      When I click element with locator "[data-test-preview-image='CheckName']"
      When I wait 10 seconds for the element with locator "[data-check-header-name='CheckName']" to be visible

   Scenario: Regions - add, save, check
      # check absence
      When I execute javascript code:
         """
       return(mainView.allRects.length.toString());
         """
      Then I expect the stored "js" string is equal:
         """
         0
         """

      # add and check presence
      When I wait 10 seconds for the element with locator "[data-check='add-ignore-region']" to be visible
      When I wait 3 seconds
      When I click element with locator "[data-check='add-ignore-region']"

      When I execute javascript code:
         """
     return (mainView.allRects.length.toString());
         """

      When I repeat javascript code until stored "js" string equals "1":
         """
     if (typeof mainView === 'undefined' || !mainView.allRects) return "loading";
     return (mainView.allRects.length.toString());
         """

      # save refresh page check presence
      When I click element with locator "[data-check='save-ignore-region']"
      When I refresh page
      When I execute javascript code:
         """
     return (mainView.allRects.length.toString());
         """

      When I repeat javascript code until stored "js" string equals "1":
         """
     if (typeof mainView === 'undefined' || !mainView.allRects) return "loading";
     return (mainView.allRects.length.toString());
         """

      # check initial coordinates
      When I execute javascript code:
         """
     const { left, top: top1, width, height, fill, stroke, opacity } = mainView.getLastRegion()
     return [left, top1, width, height, fill, stroke, opacity].toString()
         """
      Then I expect the stored "js" string is equal:
         """
      20,50,202,102,MediumVioletRed,black,0.5
         """

      # update coordinates
      When I execute javascript code:
         """
      mainView.getLastRegion().left = 300
      mainView.getLastRegion().top = 500
      mainView.canvas.renderAll()
      const { left, top: top1, width, height, fill, stroke, opacity } = mainView.getLastRegion()
      return [Math.round(left), Math.round(top1), Math.round(width), Math.round(height), fill, stroke, opacity].toString()
         """
      Then I expect the stored "js" string is equal:
         """
      300,500,202,102,MediumVioletRed,black,0.5
         """

      # save
      When I click element with locator "[data-check='save-ignore-region']"
      When I refresh page

      # check updated coordinates
      When I repeat javascript code until stored "js" string equals "1":
         """
     if (typeof mainView === 'undefined' || !mainView.canvas) return "0";
     return mainView.canvas.getObjects().filter(x=>x.name==='ignore_rect').length.toString()
         """

      When I execute javascript code:
         """
     const { left, top: top1, width, height, fill, stroke, opacity } = mainView.getLastRegion()
     console.log(mainView.getLastRegion())
     console.log(mainView.getLastRegion())
     console.log(mainView.getLastRegion())
     return [Math.round(left), Math.round(top1), Math.round(width), Math.round(height), fill, stroke, opacity].toString()
         """

      Then I expect the stored "js" string is equal:
         """
      300,500,204,104,MediumVioletRed,black,0.5
         """

   Scenario: Regions - delete
      # add and check presence
      When I wait 10 seconds for the element with locator "[data-check='add-ignore-region']" to be visible
      When I wait 3 seconds
      When I click element with locator "[data-check='add-ignore-region']"

      When I repeat javascript code until stored "js" string equals "1":
         """
     if (typeof mainView === 'undefined' || !mainView.allRects) return "loading";
     return (mainView.allRects.length.toString());
         """

      # save refresh page check presence
      When I click element with locator "[data-check='save-ignore-region']"
      When I refresh page

      When I repeat javascript code until stored "js" string equals "1":
         """
     if (typeof mainView === 'undefined' || !mainView.allRects) return "loading";
     return (mainView.allRects.length.toString());
         """

      # select and remove
      When I execute javascript code:
         """
     mainView.canvas.setActiveObject(mainView.canvas.getObjects().filter(x=>x.name==='ignore_rect')[0]);
     mainView.canvas.requestRenderAll();
         """
      When I click element with locator "[data-check='remove-ignore-region']"

      # save refresh page check absence
      When I click element with locator "[data-check='save-ignore-region']"
      When I refresh page

      When I repeat javascript code until stored "js" string equals "0":
         """
     if (typeof mainView === 'undefined' || !mainView.allRects) return "loading";
     return (mainView.allRects.length.toString());
         """

   @flaky
   Scenario: Regions - copy regions from previous baseline
      # add region to first check
      When I wait 10 seconds for the element with locator "[data-check='add-ignore-region']" to be visible
      When I click element with locator "[data-check='add-ignore-region']"

      # save refresh page check presence
      When I click element with locator "[data-check='save-ignore-region']"
      When I refresh page
      When I repeat javascript code until stored "js" string equals "1":
         """
     if (typeof mainView === 'undefined' || !mainView.allRects) return "loading";
     return (mainView.allRects.length.toString());
         """

      # create second check
      Given I create "1" tests with:
         """
      testName: TestName
      checks:
          - checkName: CheckName
            filePath: files/A.png
         """

      # open second check and check region presence
      When I go to "main" page
      When I wait for test "TestName" to appear in table
      When I unfold the test "TestName"
      When I click element with locator "[data-test-preview-image='CheckName']"

      When I wait 10 seconds for the element with locator "[data-check-header-name='CheckName']" to be visible
      When I repeat javascript code until stored "js" string equals "1":
         """
     if (typeof mainView === 'undefined' || !mainView.allRects) return "loading";
     return (mainView.allRects.length.toString());
         """

      # accept second check and check presence
      When I accept via http the 2st check with name "CheckName"

      When I go to "main" page
      When I wait for test "TestName" to appear in table
      When I unfold the test "TestName"
      When I click element with locator "[data-test-preview-image='CheckName']"

      When I wait 10 seconds for the element with locator "[data-check-header-name='CheckName']" to be visible
      When I repeat javascript code until stored "js" string equals "1":
         """
     if (typeof mainView === 'undefined' || !mainView.allRects) return "loading";
     return (mainView.allRects.length.toString());
         """