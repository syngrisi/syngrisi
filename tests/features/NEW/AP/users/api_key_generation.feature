Feature: API key generation

    Background:
        Given I clear Database and stop Server
        When I set env variables:
        """
          SYNGRISI_TEST_MODE: 1
          SYNGRISI_AUTH: 0
        """
        Given I start Server
        When I create via http test user
        Given I stop the Syngrisi server
        When I set env variables:
        """
          SYNGRISI_TEST_MODE: 0
          SYNGRISI_AUTH: 1
        """
        Given I start Server and start Driver

    @smoke
    Scenario: Smoke API key generation
        When I login via http with user:"Test" password "123"

        ## create user
        # user
        When I create via http user as:"Test" with params:
        """
        {
            "username": "user@gmail.com",
            "firstName": "John",
            "lastName": "Doe",
            "role": "user",
            "password": "Password-123"
        }
        """

        When I login with user:"user@gmail.com" password "Password-123"
        When I wait for "3" seconds
        When I go to "index2" page
        # generate and parse API key
        When I click on the element "[data-test=user-icon]"
        When I click on the element "#generate-api"
        When I click on the element "span=Generate"
        When I wait for "3" seconds
        When I parse the API key

        # create checks
        When I set the API key in config
        When I create "1" tests with params:
        """
          filePath: files/A.png
          testName: User test
        """

        # check tests
        When I wait for "2" seconds
        When I open the app
        When I wait for "3" seconds
        Then I expect that element "//span[contains(text(), 'User test')]/../../..//span[@name='cell-creator' and contains(text(), 'user@gmail.com')]" does appear exactly "1" times
