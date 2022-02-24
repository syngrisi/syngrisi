Feature: Check if some baseline exist by image and ident parameters

    Background:
        Given I clear Database and stop Server
        When I set env variables:
        """
          TEST: 1
          SYNGRISI_AUTH: 0
        """
        Given I start VRS server
        When I create via http test user

        Given I stop the Syngrisi server
        When I set env variables:
        """
          TEST: 0
          SYNGRISI_AUTH: 1
        """
        Given I start Server and start Driver

        # create user
        When I login via http with user:"Test" password "123"
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
        When I login via http with user:"j_doe@gmail.com" password "Password-123"
        When I generate via http API key for the User
        When I set the API key in config

    Scenario: Check if some baseline exist by image and ident parameters - [right ident, right screenshot]
        When I create "1" tests with params:
        """
          testName: Test
          checkName: Check - 1
          runident: run
          app: app
        """
        When I accept via http the 1st check with name "Check - 1"
        When I wait for "1" seconds
        When I check if baseline exist:
        """
          name: Check - 1
          viewport: 1366x768
          browserName: <test: browserName>
          os: <testPlatform>
          filePath: files/A.png
          app: <test: app>
          branch: integration
        """
        Then I expect the stored "checkedBaseline" string is contain:
        """
        success
        """

    Scenario: Check if some baseline exist by image and ident parameters - [wrong ident, right file]
        When I create "1" tests with params:
        """
          testName: Test
          checkName: Check - 1
          runident: run
          app: app
        """
        When I accept via http the 1st check with name "Check - 1"
        When I wait for "1" seconds
        When I check if baseline exist:
        """
          name: Check - 1_WRONG
          viewport: 1366x768
          browserName: <test: browserName>
          os: <testPlatform>
          filePath: files/A.png
          app: <test: app>
          branch: integration
        """
        Then I expect the stored "checkedBaseline" string is contain:
        """
        baseline not found
        """
    Scenario: Check if some baseline exist by image and ident parameters - [right ident, wrong file]
        When I create "1" tests with params:
        """
          testName: Test
          checkName: Check - 1
          runident: run
          app: app
        """
        When I accept via http the 1st check with name "Check - 1"
        When I wait for "1" seconds
        When I check if baseline exist:
        """
          name: Check - 1
          viewport: 1366x768
          browserName: <test: browserName>
          os: <testPlatform>
          filePath: files/B.png
          app: <test: app>
          branch: integration
        """
        Then I expect the stored "checkedBaseline" string is contain:
        """
        snapshot not found
        """
