@fast-server
Feature: About Modal and Version Info

  Background:
    When I set env variables:
      """
         SYNGRISI_TEST_MODE: "true"
         SYNGRISI_AUTH: "false"
      """
    Given I start Server
    When I create via http test user
    When I stop Server
    When I set env variables:
      """
          SYNGRISI_TEST_MODE: "false"
          SYNGRISI_AUTH: "true"
      """
    When I reload session

  @smoke
  Scenario: Login page displays version info in footer
    Given I start Server
    When I open the url "<syngrisiUrl>auth"
    Then the element with locator "[data-test='auth-footer']" should be visible
    Then the element with locator "[data-test='auth-footer-github']" should be visible
    Then the element with locator "[data-test='auth-footer-github']" should have contains text "GitHub"
    Then the element with locator "[data-test='auth-footer-version']" should be visible
    Then the element with locator "[data-test='auth-footer-version']" should have contains text "v"

  Scenario: Login page displays commit hash in footer
    Given I start Server
    When I open the url "<syngrisiUrl>auth"
    Then the element with locator "[data-test='auth-footer-commit']" should be visible

  @smoke
  Scenario: Logout page displays version info in footer
    When I login with user:"Test" password "123456aA-"
    When I wait 10 seconds for the element with locator "span*=TA" to be visible
    When I go to "logout" page
    Then the element with locator "[data-test='auth-footer']" should be visible
    Then the element with locator "[data-test='auth-footer-version']" should be visible
    Then the element with locator "[data-test='auth-footer-version']" should have contains text "v"

  @smoke
  Scenario: About modal opens from user menu
    When I login with user:"Test" password "123456aA-"
    When I wait 10 seconds for the element with locator "span*=TA" to be visible
    When I click element with locator "[data-test='user-icon']"
    When I click element with locator "[data-test='about']"
    Then the element with locator "[data-test='about-modal']" should be visible
    Then the element with locator "[data-test='about-modal-content']" should be visible

  @smoke
  Scenario: About modal displays version information
    When I login with user:"Test" password "123456aA-"
    When I wait 10 seconds for the element with locator "span*=TA" to be visible
    When I click element with locator "[data-test='user-icon']"
    When I click element with locator "[data-test='about']"
    Then the element with locator "[data-test='about-version']" should be visible
    Then the element with locator "[data-test='about-version']" should have contains text "v"
    Then the element with locator "[data-test='about-commit']" should be visible

  Scenario: About modal displays Node.js version
    When I login with user:"Test" password "123456aA-"
    When I wait 10 seconds for the element with locator "span*=TA" to be visible
    When I click element with locator "[data-test='user-icon']"
    When I click element with locator "[data-test='about']"
    Then the element with locator "[data-test='about-node-version']" should be visible
    Then the element with locator "[data-test='about-node-version']" should have contains text "v"

  Scenario: About modal displays MongoDB version
    When I login with user:"Test" password "123456aA-"
    When I wait 10 seconds for the element with locator "span*=TA" to be visible
    When I click element with locator "[data-test='user-icon']"
    When I click element with locator "[data-test='about']"
    Then the element with locator "[data-test='about-mongo-version']" should be visible

  Scenario: About modal displays authentication type
    When I login with user:"Test" password "123456aA-"
    When I wait 10 seconds for the element with locator "span*=TA" to be visible
    When I click element with locator "[data-test='user-icon']"
    When I click element with locator "[data-test='about']"
    Then the element with locator "[data-test='about-auth-type']" should be visible
    Then the element with locator "[data-test='about-auth-type']" should have contains text "local"

  Scenario: About modal displays current user info
    When I login with user:"Test" password "123456aA-"
    When I wait 10 seconds for the element with locator "span*=TA" to be visible
    When I click element with locator "[data-test='user-icon']"
    When I click element with locator "[data-test='about']"
    Then the element with locator "[data-test='about-user-name']" should be visible
    Then the element with locator "[data-test='about-user-name']" should have contains text "Test Admin"
    Then the element with locator "[data-test='about-user-role']" should be visible
    Then the element with locator "[data-test='about-user-role']" should have contains text "admin"

  Scenario: About modal closes with close button
    When I login with user:"Test" password "123456aA-"
    When I wait 10 seconds for the element with locator "span*=TA" to be visible
    When I click element with locator "[data-test='user-icon']"
    When I click element with locator "[data-test='about']"
    Then the element with locator "[data-test='about-modal']" should be visible
    When I click element with locator "[data-test='about-close-button']"
    Then the element with locator "[data-test='about-modal']" should not be visible
