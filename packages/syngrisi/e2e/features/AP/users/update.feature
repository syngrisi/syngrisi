@integration @fast-server
Feature: Update User

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
    #         Given I start Server and start Driver
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
  Scenario: Update User - Success
    When I open the app
    When I go to "admin2" page
    When I wait 10 seconds for the element with locator "//*[@data-test='j_doe@gmail.com']//button[@aria-label='Edit User']" to be visible
    When I click element with locator "//*[@data-test='j_doe@gmail.com']//button[@aria-label='Edit User']"
    When I set "Alex" to the inputfield "input[aria-label='First name']"
    When I set "Jonson" to the inputfield "input[aria-label='Last name']"
    When I select the option with the text "Reviewer" for element "[data-test='users-form-role']"

    When I click element with locator "button[aria-label='Save']"

    # wait for the success notification (update applied + table refetched) before asserting cells
    When I wait 10 seconds for the element with locator "//*[@aria-label='notification-success']" to be visible
    When I wait 5 seconds for the element with locator "//*[@data-test='j_doe@gmail.com']//*[@data-test='users-cell-first-name']" to be visible
    Then the element "//*[@data-test='j_doe@gmail.com']//*[@data-test='users-cell-username']" matches the text "j_doe@gmail.com"
    Then the element "//*[@data-test='j_doe@gmail.com']//*[@data-test='users-cell-first-name']" matches the text "Alex"
    Then the element "//*[@data-test='j_doe@gmail.com']//*[@data-test='users-cell-last-name']" matches the text "Jonson"
    Then the element "//*[@data-test='j_doe@gmail.com']//*[@data-test='users-cell-role']" matches the text "REVIEWER"

    When I refresh page
    Then the element "//*[@data-test='j_doe@gmail.com']//*[@data-test='users-cell-username']" matches the text "j_doe@gmail.com"
    Then the element "//*[@data-test='j_doe@gmail.com']//*[@data-test='users-cell-first-name']" matches the text "Alex"
    Then the element "//*[@data-test='j_doe@gmail.com']//*[@data-test='users-cell-last-name']" matches the text "Jonson"
    Then the element "//*[@data-test='j_doe@gmail.com']//*[@data-test='users-cell-role']" matches the text "REVIEWER"
