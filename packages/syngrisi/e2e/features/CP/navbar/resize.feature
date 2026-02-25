@fast-server @env:SYNGRISI_AUTH:false @env:SYNGRISI_TEST_MODE:true
Feature: Navbar Resize

  Background:
    When I open the app
    When I clear local storage
    When I go to "main" page

  Scenario: Resize navbar via drag handle
    When I wait 10 seconds for the element with locator "select[data-test='navbar-group-by']" to be visible
    Then the element with locator "[data-test='navbar-resize-handle']" should be visible
    Then the css attribute "width" from element "[data-test='navbar-resizable-root']" is "350px"

    When I drag the element with locator "[data-test='navbar-resize-handle']" by offset 150, 0
    Then the css attribute "width" from element "[data-test='navbar-resizable-root']" is "500px"
    When I execute javascript code:
    """
    const navbar = document.querySelector("[data-test='navbar-resizable-root']");
    const table = document.querySelector("[data-test='table-scroll-area']");
    if (!navbar || !table) return 'missing';
    const navbarRight = Math.round(navbar.getBoundingClientRect().right);
    const tableLeft = Math.round(table.getBoundingClientRect().left);
    return String(Math.abs(navbarRight - tableLeft) <= 12);
    """
    Then I expect the stored "js" string is equal:
    """
    true
    """

    When I drag the element with locator "[data-test='navbar-resize-handle']" by offset -1000, 0
    Then the css attribute "width" from element "[data-test='navbar-resizable-root']" is "260px"
    When I execute javascript code:
    """
    const navbar = document.querySelector("[data-test='navbar-resizable-root']");
    const table = document.querySelector("[data-test='table-scroll-area']");
    if (!navbar || !table) return 'missing';
    const navbarRight = Math.round(navbar.getBoundingClientRect().right);
    const tableLeft = Math.round(table.getBoundingClientRect().left);
    return String(Math.abs(navbarRight - tableLeft) <= 12);
    """
    Then I expect the stored "js" string is equal:
    """
    true
    """
