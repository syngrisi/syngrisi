@integration @fast-server
Feature: Default Users

  Background:
#
    When I set env variables:
    """
    SYNGRISI_TEST_MODE: true
    SYNGRISI_AUTH: false
    """
    Given I start Server
    When I create via http test user
    When I stop the Syngrisi server

    When I set env variables:
    """
    SYNGRISI_TEST_MODE: true
    SYNGRISI_AUTH: true
    """
#         Given I start Server and start Driver
    When I login with user:"Test" password "123456aA-"
    When I wait 10 seconds for the element with locator "span*=TA" to be visible

  @smoke
  Scenario: Default Administrator and Guest should be created after first server start
    When I go to "admin>users" page
    Then the element "//*[@data-test='Administrator']//*[@data-test='users-cell-first-name']" matches the text "Syngrisi"
    Then the element "//*[@data-test='Administrator']//*[@data-test='users-cell-last-name']" matches the text "Admin"
    Then the element "//*[@data-test='Administrator']//*[@data-test='users-cell-role']" matches the text "ADMIN"

    Then the element "//*[@data-test='Guest']//*[@data-test='users-cell-first-name']" matches the text "Syngrisi"
    Then the element "//*[@data-test='Guest']//*[@data-test='users-cell-last-name']" matches the text "Guest"
    Then the element "//*[@data-test='Guest']//*[@data-test='users-cell-role']" matches the text "USER"
