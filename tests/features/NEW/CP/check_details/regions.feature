@smoke
Feature: Check details - Regions

  Background:
    Given I clear Database and stop Server
    Given I start Server and start Driver
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
    When I unfold the test "TestName"
    When I click on the element "[data-test-preview-image='CheckName']"
    Then I wait on element "[data-check-header-name='CheckName']" to be displayed

  Scenario: Regions - add, save, check
    # check absence
    When I execute javascript code:
    """
       return(mainView.allRects.length.toString());
    """
    When I wait for "1" seconds
    Then I expect the stored "js" string is equal:
    """
      0
    """

    # add and check presence
    Then I wait on element "[data-check='add-ignore-region']" to be displayed
    When I click on the element "[data-check='add-ignore-region']"

    When I execute javascript code:
    """
     return (mainView.allRects.length.toString());
    """

    When I wait for "1" seconds
    Then I expect the stored "js" string is equal:
    """
      1
    """

    # save refresh page check presence
    When I click on the element "[data-check='save-ignore-region']"
    When I wait for "1" seconds
    When I refresh page
    When I wait for "3" seconds
    When I execute javascript code:
    """
     return (mainView.allRects.length.toString());
    """

    When I wait for "1" seconds
    Then I expect the stored "js" string is equal:
    """
      1
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
    When I click on the element "[data-check='save-ignore-region']"
    When I wait for "1" seconds
    When I refresh page
    When I wait for "3" seconds

    # check updated coordinates
    When I execute javascript code:
    """
     return mainView.canvas.getObjects().filter(x=>x.name==='ignore_rect').length.toString()
    """
    Then I expect the stored "js" string is equal:
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

    Then I expect the stored "js" string is equal:
    """
      300,500,204,104,MediumVioletRed,black,0.5
    """

  Scenario: Regions - delete
    # add and check presence
    Then I wait on element "[data-check='add-ignore-region']" to be displayed
    When I click on the element "[data-check='add-ignore-region']"

    When I execute javascript code:
    """
     return (mainView.allRects.length.toString());
    """

    When I wait for "1" seconds
    Then I expect the stored "js" string is equal:
    """
      1
    """

    # save refresh page check presence
    When I click on the element "[data-check='save-ignore-region']"
    When I wait for "1" seconds
    When I refresh page
    When I wait for "3" seconds
    When I execute javascript code:
    """
     return (mainView.allRects.length.toString());
    """

    When I wait for "1" seconds
    Then I expect the stored "js" string is equal:
    """
      1
    """

    # select and remove
    When I execute javascript code:
    """
     mainView.canvas.setActiveObject(mainView.canvas.getObjects().filter(x=>x.name==='ignore_rect')[0]);
     mainView.canvas.requestRenderAll();
    """
    When I click on the element "[data-check='remove-ignore-region']"

    # save refresh page check absence
    When I click on the element "[data-check='save-ignore-region']"
    When I wait for "1" seconds
    When I refresh page
    When I wait for "3" seconds
    When I execute javascript code:
    """
     return (mainView.allRects.length.toString());
    """

    When I wait for "1" seconds
    Then I expect the stored "js" string is equal:
    """
      0
    """

  Scenario: Regions - copy regions from previous baseline
    # add region to first check
    Then I wait on element "[data-check='add-ignore-region']" to be displayed
    When I click on the element "[data-check='add-ignore-region']"

    # save refresh page check presence
    When I click on the element "[data-check='save-ignore-region']"
    When I wait for "1" seconds
    When I refresh page
    When I wait for "3" seconds
    When I execute javascript code:
    """
     return (mainView.allRects.length.toString());
    """

    When I wait for "1" seconds
    Then I expect the stored "js" string is equal:
    """
      1
    """

    # create second check
    Given I create "1" tests with:
    """
      testName: TestName
      checks:
          - checkName: CheckName
            filePath: files/A.png
    """

    # open second check and check absence
    When I go to "main" page
    When I unfold the test "TestName"
    When I click on the element "[data-test-preview-image='CheckName']"

    Then I wait on element "[data-check-header-name='CheckName']" to be displayed
    When I execute javascript code:
    """
     return (mainView.allRects.length.toString());
    """

    When I wait for "1" seconds
    Then I expect the stored "js" string is equal:
    """
      0
    """

    # accept second check and check presence
    When I accept via http the 2st check with name "CheckName"

    When I go to "main" page
    When I unfold the test "TestName"
    When I click on the element "[data-test-preview-image='CheckName']"

    Then I wait on element "[data-check-header-name='CheckName']" to be displayed
    When I execute javascript code:
    """
     return (mainView.allRects.length.toString());
    """

    When I wait for "1" seconds
    Then I expect the stored "js" string is equal:
    """
      1
    """


