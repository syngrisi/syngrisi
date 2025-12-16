@smoke @fast-server
Feature: Check details Related Checks

  Background:
    When I set window size: "1440x900"
    #         Given I start Server and start Driver
    When I open the app
    When I clear database
    When I clear local storage

  @flaky
  Scenario: Related - same projects
    Given I create "1" tests with:
      """
          testName: TestName-Related-1
          project: Project1
          branch: integration1
          browserName: safari
          os: Windows
          viewport: 500x500
          checks:
              - checkName: CheckName-Related
                filePath: files/A.png
                os: Windows
                viewport: 500x500
                browserName: safari
      """
    Given I create "1" tests with:
      """
          testName: TestName-Related-2
          project: Project1
          branch: integration1
          browserName: safari
          os: macOS
          viewport: 500x500
          checks:
              - checkName: CheckName-Related
                filePath: files/A.png
                os: macOS
                viewport: 500x500
                browserName: safari
      """
    Given I create "1" tests with:
      """
          testName: TestName-Related-3
          project: Project1
          branch: integration2
          browserName: firefox
          os: macOS
          viewport: 501x501
          checks:
              - checkName: CheckName-Related
                filePath: files/B.png
                os: macOS
                viewport: 501x501
                browserName: firefox
      """

    # other name - use unique test name to avoid unfold ambiguity
    Given I create "1" tests with:
      """
          testName: TestName-Related-4
          project: Project1
          branch: integration1
          browserName: safari
          os: macOS
          viewport: 501x501
          checks:
              - checkName: CheckName2
                filePath: files/A.png
                os: Windows
                viewport: 501x501
                browserName: safari
      """
    When I go to "main" page
    When I unfold the test "TestName-Related-1"
    When I unfold the test "TestName-Related-2"
    When I unfold the test "TestName-Related-3"
    When I unfold the test "TestName-Related-4"
    When I open the 3rd check "CheckName-Related"

    # 3
    When I wait 10 seconds for the element with locator "[data-related-check-item='CheckName-Related']" to be visible
    When I wait 10 seconds for the element with locator "[data-related-check-item='CheckName-Related'] [data-related-check='image']" to be visible
    Then the element "[data-related-check-item='CheckName-Related'] [data-viewport-badge-name='CheckName-Related']" matches the text "501X501"
    Then the element "[data-related-check-item='CheckName-Related'] [data-related-check='branch']" matches the text "INTEGRATION2"
    Then the element "[data-related-check-item='CheckName-Related'] [data-related-check='os-label']" matches the text "macOS"
    Then the element "[data-related-check-item='CheckName-Related'] [data-related-check='browser-name']" matches the text "firefox"
    Then the element with locator "[data-related-check-item='CheckName-Related'] [data-related-check='browser-version']" should have contains text "11"

    # 2
    When I wait 10 seconds for the element with locator "(//*[@data-related-check-item='CheckName-Related'])[2]" to be visible
    When I wait 10 seconds for the element with locator "(//*[@data-related-check-item='CheckName-Related'])[2]//*[@data-related-check='image']" to be visible
    Then the element "(//*[@data-related-check-item='CheckName-Related'])[2]//*[@data-viewport-badge-name='CheckName-Related']" matches the text "500X500"
    Then the element "(//*[@data-related-check-item='CheckName-Related'])[2]//*[@data-related-check='branch']" matches the text "INTEGRATION1"
    Then the element "(//*[@data-related-check-item='CheckName-Related'])[2]//*[@data-related-check='os-label']" matches the text "macOS"
    Then the element "(//*[@data-related-check-item='CheckName-Related'])[2]//*[@data-related-check='browser-name']" matches the text "safari"
    Then the element with locator "(//*[@data-related-check-item='CheckName-Related'])[2]//*[@data-related-check='browser-version']" should have contains text "11"

    # 1
    When I wait 10 seconds for the element with locator "(//*[@data-related-check-item='CheckName-Related'])[3]" to be visible
    When I wait 10 seconds for the element with locator "(//*[@data-related-check-item='CheckName-Related'])[3]//*[@data-related-check='image']" to be visible
    Then the element "(//*[@data-related-check-item='CheckName-Related'])[3]//*[@data-viewport-badge-name='CheckName-Related']" matches the text "500X500"
    Then the element "(//*[@data-related-check-item='CheckName-Related'])[3]//*[@data-related-check='branch']" matches the text "INTEGRATION1"
    Then the element "(//*[@data-related-check-item='CheckName-Related'])[3]//*[@data-related-check='os-label']" matches the text "Windows"
    Then the element "(//*[@data-related-check-item='CheckName-Related'])[3]//*[@data-related-check='browser-name']" matches the text "safari"
    Then the element with locator "(//*[@data-related-check-item='CheckName-Related'])[3]//*[@data-related-check='browser-version']" should have contains text "11"

    # other name
    Then I wait on element "[data-related-check-item='CheckName2']" to not be displayed

  Scenario: Related - different projects
    Given I create "2" tests with:
      """
          testName: TestName-Related
          project: Project1
          branch: integration$
          browserName: safari
          os: Windows
          viewport: 500x500
          checks:
              - checkName: CheckName-Related
                filePath: files/A.png
                os: Windows
                viewport: 500x500
                browserName: safari
      """

    Given I create "1" tests with:
      """
          testName: TestName-Related
          project: Project2
          branch: integration$
          browserName: firefox
          os: Windows
          viewport: 500x500
          checks:
              - checkName: CheckName-Related
                filePath: files/A.png
                os: Windows
                viewport: 500x500
                browserName: firefox
      """

    When I go to "main" page
    When I wait 10 seconds for the element with locator "[data-table-test-name=TestName-Related]" to be visible

    # filter by project
    When I select the option with the text "Project1" for element "select[data-test='current-project']"

    When I unfold the test "TestName-Related"
    When I open the 1st check "CheckName-Related"

    #        When I click element with locator "[data-table-test-name=TestName]"
    #        When I wait 10 seconds for the element with locator "//*[@data-test-preview-image='CheckName']" to be visible
    #        When I click element with locator "//*[@data-test-preview-image='CheckName']"
    #        When I wait 10 seconds for the element with locator "[data-check-header-name='CheckName']" to be visible
    #        When I wait 10 seconds for the element with locator "(//*[@data-related-check-item='CheckName'])" to be visible

    When I wait 10 seconds for the element with locator "//*[@data-related-check='browser-name' and text()='safari']" to be visible
    Then the element "//*[@data-related-check='browser-name' and text()='safari']" does appear exactly "2" times
    Then the element "//*[@data-related-check='browser-name' and text()='firefox']" does appear exactly "0" times

  Scenario: Related - sort by Date
    # Create tests one by one with delays to ensure distinct createdDate values for reliable sorting
    Given I create "1" tests with:
      """
          testName: TestName-Related-0
          project: Project1
          branch: integration0
          browserName: safari0
          os: Windows
          viewport: 500x500
          checks:
              - checkName: CheckName-Related
                filePath: files/A.png
                os: Windows
                viewport: 500x500
                browserName: safari0
      """
    When I pause for 500 ms
    Given I create "1" tests with:
      """
          testName: TestName-Related-1
          project: Project1
          branch: integration1
          browserName: safari1
          os: Windows
          viewport: 500x500
          checks:
              - checkName: CheckName-Related
                filePath: files/A.png
                os: Windows
                viewport: 500x500
                browserName: safari1
      """
    When I pause for 500 ms
    Given I create "1" tests with:
      """
          testName: TestName-Related-2
          project: Project1
          branch: integration2
          browserName: safari2
          os: Windows
          viewport: 500x500
          checks:
              - checkName: CheckName-Related
                filePath: files/A.png
                os: Windows
                viewport: 500x500
                browserName: safari2
      """

    When I go to "main" page
    When I unfold the test "TestName-Related-2"
    When I open the 1st check "CheckName-Related"

    # 3
    When I wait 10 seconds for the element with locator "(//*[@data-related-check-item='CheckName-Related'])[1]" to be visible
    Then the element with locator "(//*[@data-related-check-item='CheckName-Related'])[1]//*[@data-related-check='branch']" should have text "integration2"

    # 2
    When I wait 10 seconds for the element with locator "(//*[@data-related-check-item='CheckName-Related'])[2]" to be visible
    Then the element with locator "(//*[@data-related-check-item='CheckName-Related'])[2]//*[@data-related-check='branch']" should have text "integration1"

    # 1
    When I wait 10 seconds for the element with locator "(//*[@data-related-check-item='CheckName-Related'])[3]" to be visible
    Then the element with locator "(//*[@data-related-check-item='CheckName-Related'])[3]//*[@data-related-check='branch']" should have text "integration0"

    # sort
    When I click element with locator "[data-test='related-check-icon-open-sort']"
    When I click element with locator "[data-test='navbar-sort-by-order']"

    # 1
    When I wait 10 seconds for the element with locator "(//*[@data-related-check-item='CheckName-Related'])[1]" to be visible
    Then the element with locator "(//*[@data-related-check-item='CheckName-Related'])[1]//*[@data-related-check='branch']" should have text "integration0"

    # 2
    When I wait 10 seconds for the element with locator "(//*[@data-related-check-item='CheckName-Related'])[2]" to be visible
    Then the element with locator "(//*[@data-related-check-item='CheckName-Related'])[2]//*[@data-related-check='branch']" should have text "integration1"

    # 3
    When I wait 10 seconds for the element with locator "(//*[@data-related-check-item='CheckName-Related'])[3]" to be visible
    Then the element with locator "(//*[@data-related-check-item='CheckName-Related'])[3]//*[@data-related-check='branch']" should have text "integration2"

  Scenario: Related - filter by Browser
    Given I create "1" tests with:
      """
          testName: TestName-Related-$
          project: Project1
          branch: integration$
          browserName: safari
          os: Windows
          viewport: 500x500
          checks:
              - checkName: CheckName-Related
                filePath: files/A.png
                os: Windows
                viewport: 500x500
                browserName: safari
      """

    Given I create "2" tests with:
      """
          testName: TestName-Related-$
          project: Project1
          branch: integration$
          browserName: firefox
          os: Windows
          viewport: 500x500
          checks:
              - checkName: CheckName-Related
                filePath: files/A.png
                os: Windows
                viewport: 500x500
                browserName: firefox
      """

    When I go to "main" page

    When I unfold the test "TestName-Related-1"
    When I open the 1st check "CheckName-Related"

    When I wait 10 seconds for the element with locator "[data-check-header-name='CheckName-Related']" to be visible
    When I wait 10 seconds for the element with locator "(//*[@data-related-check-item='CheckName-Related'])" to be visible

    # before filter
    When I wait 10 seconds for the element with locator "//*[@data-related-check='browser-name' and text()='safari']" to be visible
    When I wait 10 seconds for the element with locator "//*[@data-related-check='browser-name' and text()='firefox']" to be visible
    Then the element "//*[@data-related-check='browser-name' and text()='safari']" does appear exactly "1" times
    Then the element "//*[@data-related-check='browser-name' and text()='firefox']" does appear exactly "2" times

    # after filter
    When I click element with locator "[data-test='related-check-icon-open-filter']"
    When I wait 10 seconds for the element with locator "label=Browser" to be visible
    When I click element with locator "label=Browser"

    When I wait 10 seconds for the element with locator "//*[@data-related-check='browser-name' and text()='firefox']" to be visible
    Then the element "//*[@data-related-check='browser-name' and text()='safari']" does appear exactly "0" times
    Then the element "//*[@data-related-check='browser-name' and text()='firefox']" does appear exactly "2" times

