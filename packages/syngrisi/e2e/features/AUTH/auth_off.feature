Feature: Authentication - off

    Background:
        Given I clear Database and stop Server
        Given I start Server

    @smoke
    Scenario: Login as Guest
        When I open the url "<syngrisiUrl>"
        When I wait for "1" seconds
        Then I wait on element "span*=SG" to be displayed

    Scenario: Login as Guest with redirect
        When I open the url "<syngrisiUrl>admin"
        When I wait for "1" seconds
        Then the current url contains "/admin"
        When I wait on element "[data-test='user-icon']"
        Then I expect that element "[data-test='user-icon']" to contain text "SG"


