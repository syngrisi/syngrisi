@integration
Feature: User roles
    By default we have 3 roles:
    - admin: can to do and see seeing everything
    - user: can view only his tests
    - reviewer: can see and accept all tests

    Background:
        Given I clear test VRS database
        Given I stop the Syngrisi server
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
        Given I start VRS server
        Given I setup VRS driver

    @e2e
    Scenario: User - roles
        # login as test admin
        When I login with user:"Test" password "123"
        Then I wait on element "*=TA" to be displayed

        ## create user
        # user
        When I open the url "http://vrs:3001/admin?task=users"
        When I wait for "3" seconds
        When I click on the element "#add-user"
        When I set "user@gmail.com" to the inputfield "//input[@placeholder='Username']"
        When I set "Ivan" to the inputfield "//input[@placeholder='First Name']"
        When I set "Ivanov" to the inputfield "//input[@placeholder='Last Name']"
        When I select the option with the text "user" for element "//select[@new-user-role]"
        When I set "Password-123" to the inputfield "//input[@placeholder='password']"
        When I click on the element "a.send-new-user-button"

        # reviewer
        When I open the url "http://vrs:3001/admin?task=users"
        When I wait for "3" seconds
        When I click on the element "#add-user"
        When I set "reviewer@gmail.com" to the inputfield "//input[@placeholder='Username']"
        When I set "Petr" to the inputfield "//input[@placeholder='First Name']"
        When I set "Petrov" to the inputfield "//input[@placeholder='Last Name']"
        When I select the option with the text "reviewer" for element "//select[@new-user-role]"
        When I set "Password-123" to the inputfield "//input[@placeholder='password']"
        When I click on the element "a.send-new-user-button"

        # admin
        When I open the url "http://vrs:3001/admin?task=users"
        When I wait for "3" seconds
        When I click on the element "#add-user"
        When I set "superadmin@gmail.com" to the inputfield "//input[@placeholder='Username']"
        When I set "Sidor" to the inputfield "//input[@placeholder='First Name']"
        When I set "Sidorov" to the inputfield "//input[@placeholder='Last Name']"
        When I select the option with the text "admin" for element "//select[@new-user-role]"
        When I set "Password-123" to the inputfield "//input[@placeholder='password']"
        When I click on the element "a.send-new-user-button"

        When I wait for "2" seconds
        When I click on the element "#user-icon"
        When I click on the element "=Sign Out"
        When I wait for "2" seconds

        ### create checks
        ## user
        # login
        When I login with user:"user@gmail.com" password "Password-123"
        Then I wait on element "*=II" to be displayed

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
        Then I wait on element "*=PP" to be displayed

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
        Then I wait on element "*=SS" to be displayed

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
        Then I wait on element "*=II" to be displayed
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
        Then I wait on element "*=PP" to be displayed
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
        Then I wait on element "*=SS" to be displayed
        # checks
        When I wait for "3" seconds
        Then I expect that element "//span[contains(text(), 'User test')]/../../..//span[@name='cell-creator']" does appear exactly "5" times
        Then I expect that element "//span[contains(text(), 'Reviewer test')]/../../..//span[@name='cell-creator']" does appear exactly "7" times
        Then I expect that element "//span[contains(text(), 'Admin test')]/../../..//span[@name='cell-creator' and contains(text(), 'superadmin@gmail.com')]" does appear exactly "3" times

    Scenario: Admin panel access
        # login as test admin
        When I login with user:"Test" password "123"
        Then I wait on element "*=TA" to be displayed

        # create admin
        When I open the url "http://vrs:3001/admin?task=users"
        When I wait for "3" seconds
        When I click on the element "#add-user"
        When I set "superadmin@gmail.com" to the inputfield "//input[@placeholder='Username']"
        When I set "Sidor" to the inputfield "//input[@placeholder='First Name']"
        When I set "Sidorov" to the inputfield "//input[@placeholder='Last Name']"
        When I select the option with the text "admin" for element "//select[@new-user-role]"
        When I set "Password-123" to the inputfield "//input[@placeholder='password']"
        When I click on the element "a.send-new-user-button"

        When I wait for "2" seconds
        When I click on the element "#user-icon"
        When I click on the element "=Sign Out"
        When I wait for "2" seconds

        # login as created admin
        When I login with user:"superadmin@gmail.com" password "Password-123"
        Then I wait on element "*=SS" to be displayed

        # go to admin panel
        When I click on the element "a#user-icon"
        When I wait for "1" seconds
        When I click on the element "a#admin-panel-link"

        Then the title is "Admin panel"
        Then the current url contains "/admin?task=users"
