@smoke
Feature: Check details Related Checks

    Background:
        When I set window size: "1440x900"
        Given I clear Database and stop Server
        Given I start Server and start Driver
        When I open the app
        When I clear local storage

    Scenario: Related - same projects
        Given I create "1" tests with:
        """
          testName: TestName-1
          project: Project1
          branch: integration1
          browserName: safari
          os: Windows
          viewport: 500x500
          checks:
              - checkName: CheckName
                filePath: files/A.png
                os: Windows
                viewport: 500x500
                browserName: safari
        """
        Given I create "1" tests with:
        """
          testName: TestName-2
          project: Project1
          branch: integration1
          browserName: safari
          os: macOS
          viewport: 500x500
          checks:
              - checkName: CheckName
                filePath: files/A.png
                os: macOS
                viewport: 500x500
                browserName: safari
        """
        Given I create "1" tests with:
        """
          testName: TestName-3
          project: Project1
          branch: integration2
          browserName: firefox
          os: macOS
          viewport: 501x501
          checks:
              - checkName: CheckName
                filePath: files/B.png
                os: macOS
                viewport: 501x501
                browserName: firefox
        """

        # other name
        Given I create "1" tests with:
        """
          testName: TestName-3
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
        When I unfold the test "TestName-1"
        When I open the 3st check "CheckName"

        # 3
        Then I wait on element "[data-related-check-item='CheckName']" to be displayed
        Then I wait on element "[data-related-check-item='CheckName'] [data-related-check='image']" to be displayed
        Then the element "[data-related-check-item='CheckName'] [data-viewport-badge-name='CheckName']" matches the text "501X501"
        Then the element "[data-related-check-item='CheckName'] [data-related-check='branch']" matches the text "INTEGRATION2"
        Then the element "[data-related-check-item='CheckName'] [data-related-check='os-label']" matches the text "macOS"
        Then the element "[data-related-check-item='CheckName'] [data-related-check='browser-name']" matches the text "firefox"
        Then the element with locator "[data-related-check-item='CheckName'] [data-related-check='browser-version']" should have contains text "11"

        # 2
        Then I wait on element "(//*[@data-related-check-item='CheckName'])[2]" to be displayed
        Then I wait on element "(//*[@data-related-check-item='CheckName'])[2]//*[@data-related-check='image']" to be displayed
        Then the element "(//*[@data-related-check-item='CheckName'])[2]//*[@data-viewport-badge-name='CheckName']" matches the text "500X500"
        Then the element "(//*[@data-related-check-item='CheckName'])[2]//*[@data-related-check='branch']" matches the text "INTEGRATION1"
        Then the element "(//*[@data-related-check-item='CheckName'])[2]//*[@data-related-check='os-label']" matches the text "macOS"
        Then the element "(//*[@data-related-check-item='CheckName'])[2]//*[@data-related-check='browser-name']" matches the text "safari"
        Then the element with locator "(//*[@data-related-check-item='CheckName'])[2]//*[@data-related-check='browser-version']" should have contains text "11"

        # 1
        Then I wait on element "(//*[@data-related-check-item='CheckName'])[3]" to be displayed
        Then I wait on element "(//*[@data-related-check-item='CheckName'])[3]//*[@data-related-check='image']" to be displayed
        Then the element "(//*[@data-related-check-item='CheckName'])[3]//*[@data-viewport-badge-name='CheckName']" matches the text "500X500"
        Then the element "(//*[@data-related-check-item='CheckName'])[3]//*[@data-related-check='branch']" matches the text "INTEGRATION1"
        Then the element "(//*[@data-related-check-item='CheckName'])[3]//*[@data-related-check='os-label']" matches the text "Windows"
        Then the element "(//*[@data-related-check-item='CheckName'])[3]//*[@data-related-check='browser-name']" matches the text "safari"
        Then the element with locator "(//*[@data-related-check-item='CheckName'])[3]//*[@data-related-check='browser-version']" should have contains text "11"

        # other name
        Then I wait on element "[data-related-check-item='CheckName2']" to not be displayed

    Scenario: Related - different projects
        Given I create "2" tests with:
        """
          testName: TestName
          project: Project1
          branch: integration$
          browserName: safari
          os: Windows
          viewport: 500x500
          checks:
              - checkName: CheckName
                filePath: files/A.png
                os: Windows
                viewport: 500x500
                browserName: safari
        """

        Given I create "1" tests with:
        """
          testName: TestName
          project: Project2
          branch: integration$
          browserName: firefox
          os: Windows
          viewport: 500x500
          checks:
              - checkName: CheckName
                filePath: files/A.png
                os: Windows
                viewport: 500x500
                browserName: firefox
        """

        When I go to "main" page
        When I wait 30 seconds for the element with locator "[data-table-test-name=TestName]" to be visible

        # filter by project
        When I select the option with the text "Project1" for element "select[data-test='current-project']"
        When I wait for "1" seconds

        When I unfold the test "TestName"
        When I open the 1st check "CheckName"

#        When I click element with locator "[data-table-test-name=TestName]"
#        Then I wait on element "//*[@data-test-preview-image='CheckName']" to be displayed
#        When I click element with locator "//*[@data-test-preview-image='CheckName']"
#        Then I wait on element "[data-check-header-name='CheckName']" to be displayed
#        Then I wait on element "(//*[@data-related-check-item='CheckName'])" to be displayed

        Then I wait on element "//*[@data-related-check='browser-name' and text()='safari']" to be displayed
        Then the element "//*[@data-related-check='browser-name' and text()='safari']" does appear exactly "2" times
        Then the element "//*[@data-related-check='browser-name' and text()='firefox']" does appear exactly "0" times

    Scenario: Related - sort by Date
        Given I create "3" tests with:
        """
          testName: TestName-$
          project: Project1
          branch: integration$
          browserName: safari$
          os: Windows
          viewport: 500x500
          checks:
              - checkName: CheckName
                filePath: files/A.png
                os: Windows
                viewport: 500x500
                browserName: safari$
        """

        When I go to "main" page
        When I unfold the test "TestName-2"
        When I open the 1st check "CheckName"

        # 3
        Then I wait on element "(//*[@data-related-check-item='CheckName'])[1]" to be displayed
        Then the element "(//*[@data-related-check-item='CheckName'])[1]//*[@data-related-check='branch']" matches the text "INTEGRATION2"

        # 2
        Then I wait on element "(//*[@data-related-check-item='CheckName'])[2]" to be displayed
        Then the element "(//*[@data-related-check-item='CheckName'])[2]//*[@data-related-check='branch']" matches the text "INTEGRATION1"

        # 1
        Then I wait on element "(//*[@data-related-check-item='CheckName'])[3]" to be displayed
        Then the element "(//*[@data-related-check-item='CheckName'])[3]//*[@data-related-check='branch']" matches the text "INTEGRATION0"

        # sort
        When I click element with locator "[data-test='related-check-icon-open-sort']"
        When I click element with locator "[data-test='navbar-sort-by-order']"
        When I wait for "1" seconds

        # 1
        Then I wait on element "(//*[@data-related-check-item='CheckName'])[1]" to be displayed
        Then the element "(//*[@data-related-check-item='CheckName'])[1]//*[@data-related-check='branch']" matches the text "INTEGRATION0"

        # 2
        Then I wait on element "(//*[@data-related-check-item='CheckName'])[2]" to be displayed
        Then the element "(//*[@data-related-check-item='CheckName'])[2]//*[@data-related-check='branch']" matches the text "INTEGRATION1"

        # 3
        Then I wait on element "(//*[@data-related-check-item='CheckName'])[3]" to be displayed
        Then the element "(//*[@data-related-check-item='CheckName'])[3]//*[@data-related-check='branch']" matches the text "INTEGRATION2"

    Scenario: Related - filter by Browser
        Given I create "1" tests with:
        """
          testName: TestName-$
          project: Project1
          branch: integration$
          browserName: safari
          os: Windows
          viewport: 500x500
          checks:
              - checkName: CheckName
                filePath: files/A.png
                os: Windows
                viewport: 500x500
                browserName: safari
        """

        Given I create "2" tests with:
        """
          testName: TestName-$
          project: Project1
          branch: integration$
          browserName: firefox
          os: Windows
          viewport: 500x500
          checks:
              - checkName: CheckName
                filePath: files/A.png
                os: Windows
                viewport: 500x500
                browserName: firefox
        """

        When I go to "main" page

        When I unfold the test "TestName-1"
        When I open the 1st check "CheckName"

        Then I wait on element "[data-check-header-name='CheckName']" to be displayed
        Then I wait on element "(//*[@data-related-check-item='CheckName'])" to be displayed

        # before filter
        Then I wait on element "//*[@data-related-check='browser-name' and text()='safari']" to be displayed
        Then I wait on element "//*[@data-related-check='browser-name' and text()='firefox']" to be displayed
        Then the element "//*[@data-related-check='browser-name' and text()='safari']" does appear exactly "1" times
        Then the element "//*[@data-related-check='browser-name' and text()='firefox']" does appear exactly "2" times

        # after filter
        When I click element with locator "[data-test='related-check-icon-open-filter']"
        When I wait 30 seconds for the element with locator "label=Browser" to be visible
        When I click element with locator "label=Browser"

        Then I wait on element "//*[@data-related-check='browser-name' and text()='firefox']" to be displayed
        Then the element "//*[@data-related-check='browser-name' and text()='safari']" does appear exactly "0" times
        Then the element "//*[@data-related-check='browser-name' and text()='firefox']" does appear exactly "2" times


