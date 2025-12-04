@integration @fast-server
Feature: Delete User

  Background:
    When I set env variables:
    """
    SYNGRISI_TEST_MODE: true
    SYNGRISI_AUTH: false
    """
    Given I start Server
    When I create via http test user
    When I stop Server

    When I set env variables:
    """
    SYNGRISI_TEST_MODE: true
    SYNGRISI_AUTH: true
    """
    Given I start Server
    When I login with user:"Test" password "123456aA-"
    When I wait 10 seconds for the element with locator "span*=TA" to be visible
    When I login via http with user:"Test" password "123456aA-"
    When I create via http user as:"Test" with params:
    """
    {
      "username": "j_doe@gmail.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user",
      "password": "Password-123"
    }
    """

  @smoke
  Scenario: Delete User - Success
    When I open the app
    When I go to "admin2" page
    When I wait 10 seconds for the element with locator "//*[@data-test='j_doe@gmail.com']" to be visible
    When I click element with locator "//*[@data-test='j_doe@gmail.com']//button[@aria-label='Remove user']"
    When I click element with locator "button[aria-label='Delete']"

    And the element "//*[@data-test='j_doe@gmail.com']" does not exist


