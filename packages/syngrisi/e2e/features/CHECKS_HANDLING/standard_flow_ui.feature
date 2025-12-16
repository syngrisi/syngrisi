@fast-server
Feature: Standard Checks Flow - UI

  Background:
    #         Given I start Server and start Driver
    When I open the app
    When I clear local storage

  @smoke
  Scenario: Status View - Standard Flow
    # NEW
    Given I create "1" tests with:
      """
      testName: TestName-StandardFlow
      checks:
        - checkName: CheckName-StandardFlow
          filePath: files/A.png
      """
    When I go to "main" page
    # BEFORE ACCEPT
    When I wait 10 seconds for the element with locator "[data-table-test-name='TestName-StandardFlow']" to be visible
    When I unfold the test "TestName-StandardFlow"
    When the element with locator "[data-row-name='TestName-StandardFlow'] td[data-test='table-row-Accepted']" should have contains text "Unaccepted"
    # preview
    Then the element "[data-check-status-name='CheckName-StandardFlow'] span" matches the text "NEW"
    Then the css attribute "background-color" from element "[data-check-status-name='CheckName-StandardFlow']" is "rgba(34,139,230,1)"
    Then the element with locator "[data-test='check-accept-icon'] svg" should have has attribute "data-test-icon-type=outline"
    Then the css attribute "color" from element "[data-test='check-accept-icon'] svg" is "rgba(134,142,150,1)"

    # modal
    When I open the 1st check "CheckName-StandardFlow"
    Then the element ".modal [data-check-status-name='CheckName-StandardFlow']" matches the text "NEW"
    Then the css attribute "background-color" from element ".modal [data-check-status-name='CheckName-StandardFlow']" is "rgba(34,139,230,1)"

    Then the css attribute "color" from element ".modal [data-test='check-accept-icon'] svg" is "rgba(134,142,150,1)"
    Then the element with locator ".modal [data-test='check-accept-icon'] svg" should have has attribute "data-test-icon-type=outline"
    When I click element with locator "[data-test='close-check-detail-icon']"

    # AFTER ACCEPT
    # modal
    When I accept the "CheckName-StandardFlow" check
    When the element with locator "[data-row-name='TestName-StandardFlow'] td[data-test='table-row-Accepted']" should have contains text "Accepted"

    When I open the 1st check "CheckName-StandardFlow"

    Then the css attribute "color" from element ".modal [data-test='check-accept-icon'] svg" is "rgba(64,192,87,1)"
    Then the element with locator ".modal [data-test='check-accept-icon'] svg" should have has attribute "data-test-icon-type=fill"

    # preview
    When I click element with locator "[data-test='close-check-detail-icon']"
    # check that check wasn't unfolded after accept
    When I wait 10 seconds for the element with locator "[data-table-check-name='CheckName-StandardFlow']" to be visible
    Then the css attribute "color" from element "[data-test='check-accept-icon'] svg" is "rgba(64,192,87,1)"
    Then the element with locator "[data-test='check-accept-icon'] svg" should have has attribute "data-test-icon-type=fill"
    Then the css attribute "background-color" from element "[data-check-status-name='CheckName-StandardFlow']" is "rgba(34,139,230,1)"

    # PASSED
    Given I create "1" tests with:
      """
      testName: TestName-StandardFlow
      checks:
        - filePath: files/A.png
          checkName: CheckName-StandardFlow
      """
    When I go to "main" page

    When I wait 10 seconds for the element with locator "[data-table-test-name='TestName-StandardFlow']" to be visible
    When I unfold the test "TestName-StandardFlow"
    When the element with locator "[data-row-name='TestName-StandardFlow'] td[data-test='table-row-Accepted']" should have contains text "Accepted"

    # preview
    Then the element "[data-check-status-name='CheckName-StandardFlow'] span" matches the text "PASSED"
    Then the css attribute "background-color" from element "[data-check-status-name='CheckName-StandardFlow']" is "rgba(64,192,87,1)"
    Then the element with locator "[data-test='check-accept-icon'] svg" should have has attribute "data-test-icon-type=outline"
    Then the css attribute "color" from element "[data-test='check-accept-icon'] svg" is "rgba(64,192,87,1)"

    # modal
    When I open the 1st check "CheckName-StandardFlow"
    Then the element ".modal [data-check-status-name='CheckName-StandardFlow']" matches the text "PASSED"
    Then the css attribute "background-color" from element ".modal [data-check-status-name='CheckName-StandardFlow']" is "rgba(64,192,87,1)"

    Then the css attribute "color" from element ".modal [data-test='check-accept-icon'] svg" is "rgba(64,192,87,1)"
    Then the element with locator ".modal [data-test='check-accept-icon'] svg" should have has attribute "data-test-icon-type=outline"
    When I click element with locator "[data-test='close-check-detail-icon']"

    # FAILED BY DIFF
    Given I create "1" tests with:
      """
      testName: TestName-StandardFlow
      checks:
        - filePath: files/B.png
          checkName: CheckName-StandardFlow
      """
    When I go to "main" page
    When I wait 10 seconds for the element with locator "[data-table-test-name='TestName-StandardFlow']" to be visible
    When I unfold the test "TestName-StandardFlow"

    # preview
    Then the element "[data-check-status-name='CheckName-StandardFlow'] span" matches the text "FAILED"
    Then the css attribute "background-color" from element "[data-check-status-name='CheckName-StandardFlow']" is "rgba(250,82,82,1)"
    Then the element with locator "[data-test='check-accept-icon'] svg" should have has attribute "data-test-icon-type=outline"
    Then the css attribute "color" from element "[data-test='check-accept-icon'] svg" is "rgba(64,192,87,1)"

    # modal
    When I open the 1st check "CheckName-StandardFlow"
    Then the element ".modal [data-check-status-name='CheckName-StandardFlow']" matches the text "FAILED"
    Then the css attribute "background-color" from element ".modal [data-check-status-name='CheckName-StandardFlow']" is "rgba(250,82,82,1)"

    Then the css attribute "color" from element ".modal [data-test='check-accept-icon'] svg" is "rgba(64,192,87,1)"
    Then the element with locator ".modal [data-test='check-accept-icon'] svg" should have has attribute "data-test-icon-type=outline"

  @smoke @flaky
  Scenario: Status View - Not Accepted
    # NEW
    Given I create "1" tests with:
      """
      testName: TestName-StandardFlow
      checks:
        - filePath: files/A.png
          checkName: CheckName-StandardFlow
      """
    When I go to "main" page
    When I wait 10 seconds for the element with locator "[data-table-test-name='TestName-StandardFlow']" to be visible
    When I unfold the test "TestName-StandardFlow"
    When I wait on element "[data-test='not-accepted-error-icon']" to not be displayed
    When I wait on element "[data-viewport-badge-name='CheckName-StandardFlow']+div[data-test='check-wrong-images-size-error-icon']" to not exist

    Given I create "1" tests with:
      """
      testName: TestName-StandardFlow
      checks:
        - filePath: files/A.png
          checkName: CheckName-StandardFlow
      """
    When I go to "main" page
    When I unfold the test "TestName-StandardFlow"
    Then the element "[data-check-status-name='CheckName-StandardFlow'] span" matches the text "FAILED"
    Then the css attribute "background-color" from element "[data-check-status-name='CheckName-StandardFlow']" is "rgba(250,82,82,1)"

    # preview
    Then the element "[data-check-status-name='CheckName-StandardFlow'] span" matches the text "FAILED"
    Then the css attribute "background-color" from element "[data-check-status-name='CheckName-StandardFlow']" is "rgba(250,82,82,1)"

    When I wait 10 seconds for the element with locator "[data-test='not-accepted-error-icon']" to be visible
    When I wait on element "[data-viewport-badge-name='CheckName-StandardFlow']+div[data-test='check-wrong-images-size-error-icon']" to not exist

    Then the element with locator "[data-test='check-accept-icon'] svg" should have has attribute "data-test-icon-type=outline"
    Then the css attribute "color" from element "[data-test='check-accept-icon'] svg" is "rgba(134,142,150,1)"

    # modal
    When I open the 1st check "CheckName-StandardFlow"
    Then the element ".modal [data-check-status-name='CheckName-StandardFlow']" matches the text "FAILED"
    Then the css attribute "background-color" from element ".modal [data-check-status-name='CheckName-StandardFlow']" is "rgba(250,82,82,1)"
    When I wait 10 seconds for the element with locator ".modal [data-test='not-accepted-error-icon']" to be visible
    When I wait on element ".modal [data-viewport-badge-name='CheckName-StandardFlow']+div[data-test='check-wrong-images-size-error-icon']" to not exist

    Then the css attribute "color" from element ".modal [data-test='check-accept-icon'] svg" is "rgba(134,142,150,1)"
    Then the element with locator ".modal [data-test='check-accept-icon'] svg" should have has attribute "data-test-icon-type=outline"

  @smoke
  Scenario: Status View - Wrong Size
    # NEW
    Given I create "1" tests with:
      """
      testName: TestName-StandardFlow
      checks:
        - filePath: files/A.png
          checkName: CheckName-StandardFlow
      """
    When I go to "main" page
    When I unfold the test "TestName-StandardFlow"

    When I wait on element "[data-test='not-accepted-error-icon']" to not be displayed
    When I wait on element "[data-viewport-badge-name='CheckName-StandardFlow']+div[data-test='check-wrong-images-size-error-icon']" to not exist

    When I accept the "CheckName-StandardFlow" check

    Given I create "1" tests with:
      """
      testName: TestName-StandardFlow
      checks:
        - filePath: files/A_cropped.png
          checkName: CheckName-StandardFlow
      """
    When I go to "main" page
    When I unfold the test "TestName-StandardFlow"

    # preview
    Then the element "[data-check-status-name='CheckName-StandardFlow'] span" matches the text "FAILED"
    Then the css attribute "background-color" from element "[data-check-status-name='CheckName-StandardFlow']" is "rgba(250,82,82,1)"
    When I wait on element "[data-test='not-accepted-error-icon']" to not be displayed
    When I wait 10 seconds for the element with locator "[data-viewport-badge-name='CheckName-StandardFlow']+div[data-test='check-wrong-images-size-error-icon']" to be visible

    Then the element with locator "[data-test='check-accept-icon'] svg" should have has attribute "data-test-icon-type=outline"
    Then the css attribute "color" from element "[data-test='check-accept-icon'] svg" is "rgba(64,192,87,1)"

    # modal
    When I open the 1st check "CheckName-StandardFlow"
    Then the element ".modal [data-check-status-name='CheckName-StandardFlow']" matches the text "FAILED"
    Then the css attribute "background-color" from element ".modal [data-check-status-name='CheckName-StandardFlow']" is "rgba(250,82,82,1)"
    When I wait on element ".modal [data-test='not-accepted-error-icon']" to not be displayed
    When I wait 10 seconds for the element with locator ".modal [data-test='check-wrong-images-size-error-icon']" to be visible

    Then the css attribute "color" from element ".modal [data-test='check-accept-icon'] svg" is "rgba(64,192,87,1)"
    Then the element with locator ".modal [data-test='check-accept-icon'] svg" should have has attribute "data-test-icon-type=outline"