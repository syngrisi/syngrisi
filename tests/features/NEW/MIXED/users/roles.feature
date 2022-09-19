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
            "firstName": "Johnny",
            "lastName": "Doe",
            "role": "admin",
            "password": "Password-123"
        }
        """

        ### create checks
        ## user
        # login
        When I login with user:"user@gmail.com" password "Password-123"
        Then I wait on element "*=JD" to be displayed

        # generate and parse API key
        When I click on the element "a#user-icon"
        When I click on the element "#generate-api"
        When I accept the confirmbox
        When I parse the API key

        # create checks
        When I set the API key in config
        When I create "5" tests with params:
        """
          filePath: files/A.png
          testName: User test
        """
        When I wait for "2" seconds
        When I click on the element "#user-icon"
        When I click on the element "=Sign Out"
        When I wait for "2" seconds

        ## reviewer
        # login
        When I login with user:"reviewer@gmail.com" password "Password-123"
        Then I wait on element "*=RR" to be displayed

        # generate and parse API key
        When I click on the element "a#user-icon"
        When I click on the element "#generate-api"
        When I accept the confirmbox
        When I parse the API key

        # create checks
        When I set the API key in config
        When I create "7" tests with params:
        """
          filePath: files/A.png
          testName: Reviewer test
        """

        When I wait for "2" seconds
        When I click on the element "#user-icon"
        When I click on the element "=Sign Out"
        When I wait for "2" seconds

        ## admin
        # login
        When I login with user:"superadmin@gmail.com" password "Password-123"
        Then I wait on element "*=JD" to be displayed

        # generate and parse API key
        When I click on the element "a#user-icon"
        When I click on the element "#generate-api"
        When I accept the confirmbox
        When I parse the API key

        # create checks
        When I set the API key in config
        When I create "3" tests with params:
        """
          filePath: files/A.png
          testName: Admin test
        """

        When I wait for "2" seconds
        When I click on the element "#user-icon"
        When I click on the element "=Sign Out"
        When I wait for "2" seconds


        ### verify checks
        ## user
        # login
        When I login with user:"user@gmail.com" password "Password-123"
        Then I wait on element "*=JD" to be displayed
        # checks
        When I wait for "3" seconds
        Then I expect that element "//span[contains(text(), 'User test')]/../../..//span[@name='cell-creator' and contains(text(), 'user@gmail.com')]" does appear exactly "5" times
        Then I expect that element "//span[contains(text(), 'Reviewer test')]/../../..//span[@name='cell-creator']" is not displayed
        Then I expect that element "//span[contains(text(), 'Admin test')]/../../..//span[@name='cell-creator']" is not displayed
        When I wait for "2" seconds
        When I click on the element "#user-icon"
        When I click on the element "=Sign Out"
        When I wait for "2" seconds

        ## reviewer
        # login
        When I login with user:"reviewer@gmail.com" password "Password-123"
        Then I wait on element "*=RR" to be displayed
        # checks
        When I wait for "3" seconds
        Then I expect that element "//span[contains(text(), 'User test')]/../../..//span[@name='cell-creator']" does appear exactly "5" times
        Then I expect that element "//span[contains(text(), 'Reviewer test')]/../../..//span[@name='cell-creator' and contains(text(), 'reviewer@gmail.com')]" does appear exactly "7" times
        Then I expect that element "//span[contains(text(), 'Admin test')]/../../..//span[@name='cell-creator']" does appear exactly "3" times

        When I wait for "2" seconds
        When I click on the element "#user-icon"
        When I click on the element "=Sign Out"
        When I wait for "2" seconds

        ## admin
        # login
        When I login with user:"superadmin@gmail.com" password "Password-123"
        Then I wait on element "*=JD" to be displayed
        # checks
        When I wait for "3" seconds
        Then I expect that element "//span[contains(text(), 'User test')]/../../..//span[@name='cell-creator']" does appear exactly "5" times
        Then I expect that element "//span[contains(text(), 'Reviewer test')]/../../..//span[@name='cell-creator']" does appear exactly "7" times
        Then I expect that element "//span[contains(text(), 'Admin test')]/../../..//span[@name='cell-creator' and contains(text(), 'superadmin@gmail.com')]" does appear exactly "3" times
