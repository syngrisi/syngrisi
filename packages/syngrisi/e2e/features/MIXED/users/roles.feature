@integration @fast-server
Feature: User roles
    By default we have 3 roles:
    - admin: can to do and see seeing everything
    - user: can view only his tests
    - reviewer: can see and accept all tests

    Background:
#         Given I clear Database and stop Server
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
#         Given I start Server and start Driver

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
        # admin
        When I create via http user as:"Test" with params:
        """
        {
            "username": "superadmin@gmail.com",
            "firstName": "Sonny",
            "lastName": "Doe",
            "role": "admin",
            "password": "Password-123"
        }
        """

        ### create checks
        ## user
        # login
        When I reload session
        When I open the app
        When I login with user:"user@gmail.com" password "Password-123"
        When I wait 30 seconds for the element with locator "span*=JD" to be visible

        # generate and parse API key
        When I click element with locator "span*=JD"
        When I click element with locator "button=Generate API key"
        When I click element with locator "button=Generate"
#        When I click element with locator "[data-test='copy-api-icon']"
        When I parse the API key
        When I click element with locator "button=Close"


        # create checks
        When I set the API key in config
        When I start Driver
        When I create "5" tests with params:
        """
          filePath: files/A.png
          testName: User test
        """

        # logout
        When I log out of the application

        ## reviewer
        # login
        When I login with user:"reviewer@gmail.com" password "Password-123"
        When I wait 30 seconds for the element with locator "span*=RR" to be visible

        # generate and parse API key
        When I click element with locator "span*=RR"
        When I click element with locator "button=Generate API key"
        When I click element with locator "button=Generate"
        When I parse the API key
        When I click element with locator "button=Close"

        # create checks
        When I set the API key in config
        When I start Driver
        When I create "7" tests with params:
        """
          filePath: files/A.png
          testName: Reviewer test
        """

        # logout
        When I log out of the application

        ## admin
        # login
        When I login with user:"superadmin@gmail.com" password "Password-123"
        When I wait 30 seconds for the element with locator "span*=SD" to be visible

        # generate and parse API key
        When I click element with locator "span*=SD"
        When I click element with locator "button=Generate API key"
        When I click element with locator "button=Generate"
        When I parse the API key
        When I click element with locator "button=Close"

        # create checks
        When I set the API key in config
        When I start Driver
        When I create "3" tests with params:
        """
          filePath: files/A.png
          testName: Admin test
        """

        # logout
        When I go to "logout" page
        When I refresh page

        ### verify checks
        ## USER
        # login
        When I login with user:"user@gmail.com" password "Password-123"
        When I wait 30 seconds for the element with locator "span*=JD" to be visible
        # checks

        Then the element "//div[contains(text(), 'User test')]" does appear exactly "5" times
        Then the element "[data-table-test-creatorusername='user@gmail.com']" does appear exactly "5" times
        Then the element with locator "//div[contains(text(), 'Reviewer test')]" should not be visible
        Then the element with locator "//div[contains(text(), 'Admin test')]" should not be visible

        # logout
        When I log out of the application

        ## REVIEWER
        # login
        When I login with user:"reviewer@gmail.com" password "Password-123"
        When I wait 30 seconds for the element with locator "span*=RR" to be visible
        # checks

        Then the element "//div[contains(text(), 'User test')]" does appear exactly "5" times
        Then the element "[data-table-test-creatorusername='user@gmail.com']" does appear exactly "5" times

        Then the element "//div[contains(text(), 'Reviewer test')]" does appear exactly "7" times
        Then the element "[data-table-test-creatorusername='reviewer@gmail.com']" does appear exactly "7" times

        Then the element "//div[contains(text(), 'Admin test')]" does appear exactly "3" times
        Then the element "[data-table-test-creatorusername='superadmin@gmail.com']" does appear exactly "3" times

        # logout
        When I log out of the application

        ## ADMIN
        # login
        When I login with user:"superadmin@gmail.com" password "Password-123"
        When I wait 30 seconds for the element with locator "span*=SD" to be visible
        # checks
        Then the element "//div[contains(text(), 'User test')]" does appear exactly "5" times
        Then the element "[data-table-test-creatorusername='user@gmail.com']" does appear exactly "5" times

        Then the element "//div[contains(text(), 'Reviewer test')]" does appear exactly "7" times
        Then the element "[data-table-test-creatorusername='reviewer@gmail.com']" does appear exactly "7" times

        Then the element "//div[contains(text(), 'Admin test')]" does appear exactly "3" times
        Then the element "[data-table-test-creatorusername='superadmin@gmail.com']" does appear exactly "3" times

