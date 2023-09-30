@integration
Feature: User roles
    By default we have 3 roles:
    - admin: can to do and see seeing everything
    - user: can view only his tests
    - reviewer: can see and accept all tests

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
        When I wait for "4" seconds
        When I set env variables:
        """
          SYNGRISI_TEST_MODE: 0
          SYNGRISI_AUTH: 1
        """
        Given I start Server and start Driver

    @e2e
    Scenario: User - roles
        # login as test admin
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
        Then I wait on element "span*=JD" to be displayed

        # generate and parse API key
        When I click on the element "span*=JD"
        When I click on the element "button=Generate API key"
        When I click on the element "button=Generate"
#        When I click on the element "[data-test='copy-api-icon']"
        When I parse the API key
        When I click on the element "button=Close"


        # create checks
        When I set the API key in config
        When I create "5" tests with params:
        """
          filePath: files/A.png
          testName: User test
        """
        When I wait for "2" seconds

        # logout
        When I log out of the application

        ## reviewer
        # login
        When I login with user:"reviewer@gmail.com" password "Password-123"
        Then I wait on element "span*=RR" to be displayed

        # generate and parse API key
        When I click on the element "span*=RR"
        When I click on the element "button=Generate API key"
        When I click on the element "button=Generate"
        When I parse the API key
        When I click on the element "button=Close"

        # create checks
        When I set the API key in config
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
        Then I wait on element "span*=SD" to be displayed

        # generate and parse API key
        When I click on the element "span*=SD"
        When I click on the element "button=Generate API key"
        When I click on the element "button=Generate"
        When I parse the API key
        When I click on the element "button=Close"

        # create checks
        When I set the API key in config
        When I create "3" tests with params:
        """
          filePath: files/A.png
          testName: Admin test
        """

        # logout
        When I wait for "2" seconds
        When I go to "logout" page
        When I wait for "2" seconds
        When I refresh page

        ### verify checks
        ## USER
        # login
        When I login with user:"user@gmail.com" password "Password-123"
        Then I wait on element "span*=JD" to be displayed
        # checks

        When I wait for "3" seconds
        Then I expect that element "//div[contains(text(), 'User test')]" does appear exactly "5" times
        Then I expect that element "[data-table-test-creatorusername='user@gmail.com']" does appear exactly "5" times
        Then I expect that element "//div[contains(text(), 'Reviewer test')]" is not displayed
        Then I expect that element "//div[contains(text(), 'Admin test')]" is not displayed

        # logout
        When I log out of the application

        ## REVIEWER
        # login
        When I login with user:"reviewer@gmail.com" password "Password-123"
        Then I wait on element "span*=RR" to be displayed
        # checks
        When I wait for "3" seconds

        Then I expect that element "//div[contains(text(), 'User test')]" does appear exactly "5" times
        Then I expect that element "[data-table-test-creatorusername='user@gmail.com']" does appear exactly "5" times

        Then I expect that element "//div[contains(text(), 'Reviewer test')]" does appear exactly "7" times
        Then I expect that element "[data-table-test-creatorusername='reviewer@gmail.com']" does appear exactly "7" times

        Then I expect that element "//div[contains(text(), 'Admin test')]" does appear exactly "3" times
        Then I expect that element "[data-table-test-creatorusername='superadmin@gmail.com']" does appear exactly "3" times

        # logout
        When I log out of the application

        ## ADMIN
        # login
        When I login with user:"superadmin@gmail.com" password "Password-123"
        Then I wait on element "span*=SD" to be displayed
        # checks
        Then I expect that element "//div[contains(text(), 'User test')]" does appear exactly "5" times
        Then I expect that element "[data-table-test-creatorusername='user@gmail.com']" does appear exactly "5" times

        Then I expect that element "//div[contains(text(), 'Reviewer test')]" does appear exactly "7" times
        Then I expect that element "[data-table-test-creatorusername='reviewer@gmail.com']" does appear exactly "7" times

        Then I expect that element "//div[contains(text(), 'Admin test')]" does appear exactly "3" times
        Then I expect that element "[data-table-test-creatorusername='superadmin@gmail.com']" does appear exactly "3" times
