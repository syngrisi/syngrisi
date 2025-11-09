Feature: API key generation

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
        SYNGRISI_TEST_MODE: true
        SYNGRISI_AUTH: true
        """
        Given I start Server and start Driver
        When I login via http with user:"Test" password "123456aA-"

    @smoke
    Scenario: Smoke API key generation
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
        When I go to "main" page
        # generate and parse API key
        When I click on the element "[data-test=user-icon]"
        When I click on the element "#generate-api"
        When I click on the element "span=Generate"
        When I wait for "3" seconds
        When I parse the API key

        # create checks
        When I set the API key in config
        When I start Driver
        When I create "1" tests with params:
        """
          filePath: files/A.png
          testName: User test
        """

        # check tests
        When I wait for "2" seconds
        When I open the app
        When I wait for "3" seconds
        Then I wait on element "[data-table-test-creatorusername='user@gmail.com']" to be displayed
        Then I expect that element "[data-table-test-creatorusername='user@gmail.com']" does appear exactly "1" times


