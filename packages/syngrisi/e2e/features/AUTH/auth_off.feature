@fast-server
Feature: Authentication - off

    Background:
#         Given I clear Database and stop Server
        Given I start Server

    @smoke
    Scenario: Login as Guest
        When I open the url "<syngrisiUrl>"
        When I wait 30 seconds for the element with locator "span*=SG" to be visible

    Scenario: Login as Guest with redirect
        When I open the url "<syngrisiUrl>admin"
        Then the current url contains "/admin"
        When I wait on element "[data-test='user-icon']"
        Then the element with locator "[data-test='user-icon']" should have contains text "SG"

