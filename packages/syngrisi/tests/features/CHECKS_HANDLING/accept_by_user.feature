Feature: Accept by user

  Background:
    Given I clear Database and stop Server
    When I set env variables:
    """
      SYNGRISI_TEST_MODE: true
      SYNGRISI_AUTH: false
    """
    Given I start Server
    When I create via http test user

    Given I stop the Syngrisi server
    When I set env variables:
    """
      SYNGRISI_TEST_MODE: false
      SYNGRISI_AUTH: true
    """
    Given I start Server

    # set API key
    When I login via http with user:"Test" password "123"
    When I generate via http API key for the User
    When I set the API key in config
    When I start Driver

  Scenario: Accept by user
    Given I create "1" tests with:
    """
      testName: TestName
      checks:
          - checkName: CheckName
            filePath: files/B.png
    """
    When I accept via http the 1st check with name "CheckName"

    Then I expect via http 1st check filtered as "name=CheckName" matched:
    """
      name: CheckName
      status: [new]
      markedAs: accepted
      markedByUsername: Test
    """


    When I open the app
    When I login with user:"Test" password "123"
