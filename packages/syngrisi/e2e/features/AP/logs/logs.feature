@mode:serial
@fast-server @env:SYNGRISI_AUTH=false
Feature: Logs Table

  Background:
    When I open the url "data:,"
    Given the database is cleared
    When I open the app
    When I clear local storage
    When I login with user:"testadmin@test.com" password "Test-123"

  @smoke
  Scenario: Check Infinity scroll
    When I create "30" log messages with params:
      """
      message: TESTMSG
      level: info
      """

    When I go to "logs" page
    Then the element with locator "[data-test='table-row-Message']" should be visible for 30 sec
    Then the element "//*[@data-test='table-row-Message' and contains(., 'TESTMSG')]" does appear exactly "20" times
    When I scroll to element "(//*[@data-test='table-row-Message' and contains(., 'TESTMSG')])[20]"
    # Wait for infinity scroll to fetch next page
    When I wait 3 seconds for the element with locator "(//*[@data-test='table-row-Message' and contains(., 'TESTMSG')])[30]" to be visible
    Then the element "//*[@data-test='table-row-Message' and contains(., 'TESTMSG')]" does appear exactly "30" times

    # scroll affix
    # Then the element with locator "[data-test='infinity-scroll-affix-loaded-count']" should have contains text "2"
    # Then the element with locator "[data-test='infinity-scroll-affix-total-count']" should have contains text "3"

    When I execute javascript code:
      """
      return document.querySelector("[data-test='table-scroll-area'] .mantine-ScrollArea-viewport").scrollTop.toString();
      """
    Then I expect the stored "js" string is not equal:
      """
      0
      """

    When I click element with locator "[data-test='infinity-scroll-affix']"

    When I execute javascript code:
      """
      return document.querySelector("[data-test='table-scroll-area'] .mantine-ScrollArea-viewport").scrollTop.toString();
      """
    Then I expect the stored "js" string is equal:
      """
      0
      """

  Scenario: Update Table with new Logs
    After the user opens the log table, the Application store logs timestamp on the open the table moment,
    and then shows the user only logs that are older than this timestamp and when the new logs continue to arrive,
    the user should see new logs counter indicator on the top right corner of the 'Refresh' icon (which will be
    updated every 3 seconds) and after clicking on the icon, the table will be refreshed with new logs.

    When I go to "logs" page

    When I refresh page

    When I create "5" log messages with params:
      """
      message: TESTMSG
      level: info
      """

    When I wait until element "[data-test='table-refresh-icon-badge']" contains text "5"
    Then the element with locator "[data-test='table-refresh-icon-badge']" should have contains text "5"

    Then the element "//*[@data-test='table-row-Message' and contains(., 'TESTMSG')]" does appear exactly "0" times
    When I click element with locator "[data-test='table-refresh-icon']"
    Then the element with locator "//*[@data-test='table-row-Message' and contains(., 'TESTMSG')]" should be visible for 30 sec
    Then the element "//*[@data-test='table-row-Message' and contains(., 'TESTMSG')]" does appear exactly "5" times

  Scenario: Select, fold/unfold icon - appear
    When I create "1" log messages with params:
      """
      message: TESTMSG
      level: info
      """
    When I go to "logs" page

    Then the element with locator "[data-test='folding-table-items']" should not be visible

    Then the element with locator "//*[@data-test='table-row-Message' and contains(.,'TESTMSG')]" should be visible for 30 sec
    When I click element with locator "//*[@data-test='table-row-Message' and contains(.,'TESTMSG')]/..//input"
    Then the element with locator "[data-test='folding-table-items']" should be visible for 30 sec
    When I click element with locator "//*[@data-test='table-row-Message' and contains(.,'TESTMSG')]/..//input"

    When I wait on element "[data-test='folding-table-items']" to not be displayed

  Scenario: Select, fold/unfold items
    When I create "20" log messages with params:
      """
      message: filler
      level: info
      """
    When I create "1" log messages with params:
      """
      message: TESTMSG
      level: info
      """
    When I go to "logs" page
    # unfold at click
    Then the element with locator "//*[@data-test='table-row-Message' and contains(.,'TESTMSG')]" should be visible for 30 sec
    Then the element with locator "//*[@data-test='table-item-collapsed-row' and contains(., 'TESTMSG')]" should not be visible
    When I click element with locator "//*[@data-test='table-row-Message' and contains(.,'TESTMSG')]"
    Then the element with locator "//*[@data-test='table-item-collapsed-row' and contains(., 'TESTMSG')]" should be visible for 30 sec

    When I click element with locator "//*[@data-test='table-row-Message' and contains(.,'TESTMSG')]"

    Then I wait on element "//*[@data-test='table-item-collapsed-row' and contains(., 'TESTMSG')]" to not be displayed

    # unfold by item checkbox and unfold icon
    When I click element with locator "//*[@data-test='table-row-Message' and contains(.,'TESTMSG')]/..//input"
    Then the element with locator "[data-test='folding-table-items']" should be visible for 30 sec

    When I click element with locator "[data-test='folding-table-items']"
    Then the element with locator "//*[@data-test='table-item-collapsed-row' and contains(., 'TESTMSG')]" should be visible for 30 sec

    When I click element with locator "[data-test='folding-table-items']"

    Then I wait on element "//*[@data-test='table-item-collapsed-row' and contains(., 'TESTMSG')]" to not be displayed

    # unfold all
    When I click element with locator "[data-test='table-select-all']"
    Then the element with locator "[data-test='folding-table-items']" should be visible for 30 sec
    When I click element with locator "[data-test='folding-table-items']"

    Then the element "//*[@data-test='table-item-collapsed-row']" does appear exactly "20" times

  @smoke @flaky
  Scenario: Main Group, Single Rule
    When I create "20" log messages with params:
      """
      message: filler
      """
    When I create "3" log messages with params:
      """
      message: TESTMSG
      level: info
      """
    When I go to "logs" page
    When I wait 30 seconds for the element with locator "[data-test*='table_row_']" to be visible
    Then the element "[data-test*='table_row_']" does appear exactly "20" times

    When I click element with locator "[data-test='table-filtering']"
    When I wait 30 seconds for the element with locator "//*[@data-test='filter-main-group']" to be visible
    When I select the option with the text "Message" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-column-name']"
    When I select the option with the text "contains" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-operator']"
    When I set "TESTMSG" to the inputfield "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//input[@data-test='table-filter-value']"
    When I click element with locator "[data-test='table-filter-apply']"


    Then the element "//*[@data-test='table-row-Message' and contains(., 'TESTMSG')]" does appear exactly "3" times
    Then the element "[data-test*='table_row_']" does appear exactly "3" times

  @smoke
  Scenario: Main Group, Multiple Rules - And
    When I create "20" log messages with params:
      """
      message: filler
      """
    When I create "3" log messages with params:
      """
      message: TESTMSG
      level: info
      """

    When I create "3" log messages with params:
      """
      message: TESTMSG
      level: warn
      """
    When I go to "logs" page
    When I wait 30 seconds for the element with locator "[data-test*='table_row_']" to be visible
    Then the element "[data-test*='table_row_']" does appear exactly "20" times

    When I click element with locator "[data-test='table-filtering']"
    When I wait 30 seconds for the element with locator "//*[@data-test='filter-main-group']" to be visible

    # message
    When I select the option with the text "Message" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-column-name']"
    When I select the option with the text "contains" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-operator']"
    When I set "TESTMSG" to the inputfield "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//input[@data-test='table-filter-value']"

    # level
    When I select the option with the text "Level" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-1']//select[@data-test='table-filter-column-name']"

    When I select the option with the text "equals" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-1']//select[@data-test='table-filter-operator']"
    When I select the option with the text "warn" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-1']//select[@data-test='table-filter-value']"

    When I click element with locator "[data-test='table-filter-apply']"


    Then the element "//*[@data-test='table-row-Message' and contains(., 'TESTMSG')]" does appear exactly "3" times
    Then the element "//*[@data-test='table-row-Level' and @title='warn']" does appear exactly "3" times
    Then the element "[data-test*='table_row_']" does appear exactly "3" times

  @smoke
  Scenario: Main Group, Multiple Rules - Or
    When I create "20" log messages with params:
      """
      message: filler
      """
    When I create "3" log messages with params:
      """
      message: TESTMSG
      level: info
      """

    When I create "3" log messages with params:
      """
      message: TESTMSG
      level: warn
      """

    When I create "3" log messages with params:
      """
      message: TESTMSG
      level: error
      """
    When I go to "logs" page
    When I wait 30 seconds for the element with locator "[data-test*='table_row_']" to be visible
    Then the element "[data-test*='table_row_']" does appear exactly "20" times

    When I click element with locator "[data-test='table-filtering']"
    When I wait 30 seconds for the element with locator "//*[@data-test='filter-main-group']" to be visible
    When I click element with locator "//*[@data-test='filter-main-group']//*[@data-test='filter-group-operator-or']/.."

    # level warn
    When I select the option with the text "Level" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-column-name']"

    When I select the option with the text "equals" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-operator']"
    When I select the option with the text "warn" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-value']"

    # level error
    When I select the option with the text "Level" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-1']//select[@data-test='table-filter-column-name']"

    When I select the option with the text "equals" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-1']//select[@data-test='table-filter-operator']"
    When I select the option with the text "error" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-1']//select[@data-test='table-filter-value']"

    When I click element with locator "[data-test='table-filter-apply']"

    When I wait 30 seconds for the element with locator "[data-test*='table_row_']" to be visible

    Then the element "[data-test*='table_row_']" does appear exactly "6" times
    Then the element "//*[@data-test='table-row-Level' and @title='warn']" does appear exactly "3" times
    Then the element "//*[@data-test='table-row-Level' and @title='error']" does appear exactly "3" times

  Scenario: Two Groups
    When I set window size: "1300x768"
    When I create "20" log messages with params:
      """
      message: filler
      """
    When I create "3" log messages with params:
      """
      message: TESTMSG
      level: info
      """

    When I create "3" log messages with params:
      """
      message: TESTMSG
      level: warn
      """

    When I create "3" log messages with params:
      """
      message: TESTMSG
      level: error
      """
    When I go to "logs" page
    When I wait 30 seconds for the element with locator "[data-test*='table_row_']" to be visible
    Then the element "[data-test*='table_row_']" does appear exactly "20" times

    When I click element with locator "[data-test='table-filtering']"
    When I wait 30 seconds for the element with locator "//*[@data-test='filter-main-group']" to be visible

    # message main groups
    When I select the option with the text "Message" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-column-name']"
    When I select the option with the text "contains" for element "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-operator']"
    When I set "TESTMSG" to the inputfield "//*[@data-test='filter-main-group']//*[@data-test='filter-rule-0']//input[@data-test='table-filter-value']"

    When I click element with locator "[data-test='table-filter-add-group-button']"
    When I click element with locator "//*[@data-test='filter-group-0']//*[@data-test='filter-group-operator-or']/.."

    # new group level - error
    When I select the option with the text "Level" for element "//*[@data-test='filter-group-0']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-column-name']"

    When I select the option with the text "equals" for element "//*[@data-test='filter-group-0']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-operator']"
    When I select the option with the text "error" for element "//*[@data-test='filter-group-0']//*[@data-test='filter-rule-0']//select[@data-test='table-filter-value']"

    When I click element with locator "//*[@data-test='filter-group-0']//button[@data-test='table-filter-add-rule-button']"

    # new group level - info
    When I select the option with the text "Level" for element "//*[@data-test='filter-group-0']//*[@data-test='filter-rule-1']//select[@data-test='table-filter-column-name']"

    When I select the option with the text "equals" for element "//*[@data-test='filter-group-0']//*[@data-test='filter-rule-1']//select[@data-test='table-filter-operator']"
    When I select the option with the text "info" for element "//*[@data-test='filter-group-0']//*[@data-test='filter-rule-1']//select[@data-test='table-filter-value']"

    When I scroll to element "[data-test='table-filter-apply']"

    When I click element with locator "[data-test='table-filter-apply']"


    Then the element "[data-test*='table_row_']" does appear exactly "6" times
    Then the element "//*[@data-test='table-row-Message' and contains(., 'TESTMSG')]" does appear exactly "6" times
    Then the element "//*[@data-test='table-row-Level' and @title='error']" does appear exactly "3" times
    Then the element "//*[@data-test='table-row-Level' and @title='info']" does appear exactly "3" times

  Scenario: Set visible Columns
    When I create "1" log messages with params:
      """
      message: Test Log Message
      level: info
      """
    When I go to "logs" page
    When I wait 30 seconds for the element with locator "[data-test='table-header-Id']" to be visible
    Then the element with locator "[data-test='table-header-Id']" should be visible
    Then the element with locator "[data-test='table-header-Level']" should be visible
    Then the element with locator "[data-test='table-header-Message']" should be visible
    Then the element with locator "[data-test='table-header-User']" should be visible
    Then the element with locator "[data-test='table-header-Timestamp']" should be visible
    Then the element "th" does appear exactly "6" times

    Then the element with locator "[data-test='table-row-Id']" should be visible
    Then the element with locator "[data-test='table-row-Level']" should be visible
    Then the element with locator "[data-test='table-row-Message']" should be visible
    Then the element with locator "[data-test='table-row-User']" should be visible
    Then the element with locator "[data-test='table-row-Timestamp']" should be visible
    Then the element "tbody tr:first-of-type td" does appear exactly "6" times

    When I click element with locator "[data-test='table-sorting']"
    When I wait on element "[data-test='settings-visible-columns-Id']" to exist
    When I click on the element "[data-test='settings-visible-columns-Id']" via js
    When I wait on element "[data-test='table-header-Id']" to not be displayed
    Then the element with locator "[data-test='table-row-Id']" should not be visible
    Then the element "th" does appear exactly "5" times
    Then the element "tbody tr:first-of-type td" does appear exactly "5" times

    When I click on the element "[data-test='settings-visible-columns-Scope']" via js
    When I wait 30 seconds for the element with locator "[data-test='table-header-Scope']" to be visible
    Then the element with locator "[data-test='table-row-Scope']" should be visible
    Then the element "th" does appear exactly "6" times
    Then the element "tbody tr:first-of-type td" does appear exactly "6" times

  @skip-ci
  Scenario: Sorting
    When I create "1" log messages with params:
      """
      message: 2-TESTMSG
      level: info
      """
    When I create "1" log messages with params:
      """
      message: 0-TESTMSG
      level: info
      """
    When I create "1" log messages with params:
      """
      message: 1-TESTMSG
      level: info
      """
    When I go to "logs" page
    When I wait 30 seconds for the element with locator "//*[@data-test='table-row-Message' and contains(., '0-TESTMSG')]" for 10000ms to be visible
    Then the element with locator "//*[@data-test='table-row-Message' and contains(., '1-TESTMSG')]" should be visible
    Then the element with locator "//*[@data-test='table-row-Message' and contains(., '2-TESTMSG')]" should be visible
    When I execute javascript code:
      """
      const elements = Array
        .from(document.querySelectorAll("[data-test='table-row-Message']"))
        .filter(x=> x.innerText.includes('-TESTMSG'));
      const result = elements.map(x=>x.innerText).join(', ');
      return result;
      """
    Then I expect the stored "js" string is equal:
      """
      1-TESTMSG, 0-TESTMSG, 2-TESTMSG
      """

    When I click element with locator "[data-test='table-sorting']"
    When I select the option with the text "Message" for element "select[data-test='table-sort-by-select']"
    When I wait 30 seconds for the element with locator "[data-test='table-row-Message']" to be visible

    When I execute javascript code:
      """
      const elements = Array
        .from(document.querySelectorAll("[data-test='table-row-Message']"))
        .filter(x=> x.innerText.includes('-TESTMSG'));
      const result = elements.map(x=>x.innerText).join(', ');
      return result;
      """
    Then I expect the stored "js" string is equal:
      """
      2-TESTMSG, 1-TESTMSG, 0-TESTMSG
      """

    When I click element with locator "[title='sort order is descendant']"
    When I wait 30 seconds for the element with locator "//tbody/tr[1]//*[@data-test='table-row-Message' and contains(., '0-TESTMSG')]" to be visible
    When I execute javascript code:
      """
      const elements = Array
        .from(document.querySelectorAll("[data-test='table-row-Message']"))
        .filter(x=> x.innerText.includes('-TESTMSG'));
      const result = elements.map(x=>x.innerText).join(', ');
      return result;
      """
    Then I expect the stored "js" string is equal:
      """
      0-TESTMSG, 1-TESTMSG, 2-TESTMSG
      """
