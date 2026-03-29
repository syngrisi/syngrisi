@integration @fast-server @smoke
Feature: User roles
    By default we have 3 roles:
    - admin: can to do and see seeing everything
    - user: can view only his tests
    - reviewer: can see and accept all tests

    Background:
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

    @e2e
    Scenario: User - roles
        # login as test admin
        When I login via http with user:"Test" password "123456aA-"

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
        # reviewer
        When I create via http user as:"Test" with params:
            """
            {
                "username": "reviewer@gmail.com",
                "firstName": "Richard",
                "lastName": "Roe",
                "role": "reviewer",
                "password": "Password-123"
            }
            """
        ### create checks
        ## user
        # login and generate API key via HTTP to reduce UI flakiness during seed setup
        When I login via http with user:"user@gmail.com" password "Password-123"
        When I generate via http API key for the User
        When I set the API key in config
        When I start Driver
        When I create "3" tests with params:
            """
      filePath: files/A.png
      testName: User test
            """

        ## reviewer
        # login and generate API key via HTTP to reduce UI flakiness during seed setup
        When I login via http with user:"reviewer@gmail.com" password "Password-123"
        When I generate via http API key for the User
        When I set the API key in config
        When I start Driver
        When I create "4" tests with params:
            """
      filePath: files/A.png
      testName: Reviewer test
            """

        ## admin
        # login and generate API key via HTTP to reduce UI flakiness during seed setup
        When I login via http with user:"Test" password "123456aA-"
        When I generate via http API key for the User
        When I set the API key in config
        When I start Driver
        When I create "2" tests with params:
            """
      filePath: files/A.png
      testName: Admin test
            """

        ### verify checks
        ## USER
        # login
        When I open the app
        When I login with user:"user@gmail.com" password "Password-123"
        When I wait 30 seconds for the element with locator "span*=JD" to be visible
        # checks - use polling assertions with refresh to handle data loading timing (60s for CI stability)
        Then the element "//div[contains(text(), 'User test')]" should have exactly 3 items within 60 seconds with refresh
        Then the element "[data-table-test-creatorusername='user@gmail.com']" should have exactly 3 items within 15 seconds
        Then the element with locator "//div[contains(text(), 'Reviewer test')]" should not be visible
        Then the element with locator "//div[contains(text(), 'Admin test')]" should not be visible

        # logout
        When I log out of the application

        ## REVIEWER
        # login
        When I login with user:"reviewer@gmail.com" password "Password-123"
        When I wait 30 seconds for the element with locator "span*=RR" to be visible
        # checks - use polling assertions with refresh to handle data loading timing
        Then the element "//div[contains(text(), 'User test')]" should have exactly 3 items within 30 seconds with refresh
        Then the element "[data-table-test-creatorusername='user@gmail.com']" should have exactly 3 items within 10 seconds

        Then the element "//div[contains(text(), 'Reviewer test')]" should have exactly 4 items within 30 seconds with refresh
        Then the element "[data-table-test-creatorusername='reviewer@gmail.com']" should have exactly 4 items within 10 seconds

        Then the element "//div[contains(text(), 'Admin test')]" should have exactly 2 items within 30 seconds with refresh
        Then the element "[data-table-test-creatorusername='Test']" should have exactly 2 items within 10 seconds

        # logout
        When I log out of the application

        ## ADMIN
        # login
        When I login with user:"Test" password "123456aA-"
        When I wait 30 seconds for the element with locator "span*=TA" to be visible
        # checks - use polling assertions with refresh to handle data loading timing
        Then the element "//div[contains(text(), 'User test')]" should have exactly 3 items within 30 seconds with refresh
        Then the element "[data-table-test-creatorusername='user@gmail.com']" should have exactly 3 items within 10 seconds

        Then the element "//div[contains(text(), 'Reviewer test')]" should have exactly 4 items within 30 seconds with refresh
        Then the element "[data-table-test-creatorusername='reviewer@gmail.com']" should have exactly 4 items within 10 seconds

        Then the element "//div[contains(text(), 'Admin test')]" should have exactly 2 items within 30 seconds with refresh
        Then the element "[data-table-test-creatorusername='Test']" should have exactly 2 items within 10 seconds
