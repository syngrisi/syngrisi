@integration
Feature: Creation by User

    Background:
        Given I clear Database and stop Server
        When I set env variables:
        """
        TEST: 1
        SYNGRISI_AUTH: 0
        """
        Given I start VRS server with parameters:
        """
        port: 3001
        databaseName: VRSdbTest
        baseLineFolder: ./baselinesTest/
        """
        When I open the url "http://vrs:3001/loadTestUser"
        Given I kill process which used port: "3001"

        When I set env variables:
        """
        TEST: 0
        SYNGRISI_AUTH: 1
        """
        Given I start VRS server with parameters:
        """
        port: 3001
        databaseName: VRSdbTest
        baseLineFolder: ./baselinesTest/
        """

        Given I setup VRS driver with parameters:
        """
        url: "http://vrs:3001/"
        """

    Scenario: Create as User
        # login as test admin
        When I login with user:"Test" password "123"
        Then I wait on element "*=TA" to be displayed

        # create user
        When I open the url "http://vrs:3001/admin?task=users"
        When I wait for "3" seconds
        When I click on the element "#add-user"
        When I set "i_ivanov@gmail.com" to the inputfield "//input[@placeholder='Username']"
        When I set "Ivan" to the inputfield "//input[@placeholder='First Name']"
        When I set "Ivanov" to the inputfield "//input[@placeholder='Last Name']"
        When I select the option with the text "user" for element "//select[@new-user-role]"
        When I set "Password-123" to the inputfield "//input[@placeholder='password']"
        When I click on the element "a.send-new-user-button"
        When I wait for "3" seconds
        When I refresh page
        When I wait for "3" seconds
        Then I expect that element "//input[@name='username' and @value='i_ivanov@gmail.com']/../..//input[@name='firstName' and @value='Ivan']/../..//input[@name='lastName' and @value='Ivanov']" is displayed

        When I open the url "http://vrs:3001/logout"
        When I wait for "1" seconds

        # login by user
        When I login with user:"i_ivanov@gmail.com" password "Password-123"
        Then I wait on element "*=II" to be displayed

        # generate and parse API key
        When I click on the element "a#user-icon"
        When I click on the element "#generate-api"
        When I accept the confirmbox
        When I parse the API key

        # create check
        When I set the API key in config
        When I create "1" tests with params:
        """
          filePath: files/A.png
          testName: Create by User
        """

        # the check validation as new user
        When I go to "main" page
        When I wait for "2" seconds
        Then I expect that VRS test "Create by User - 1" has "New" status
        When I click on "Create by User - 1" VRS test

        Then I expect that VRS test "Create by User - 1" is unfolded
        Then I expect that "1" check has Created "created by" equal to "i_ivanov@gmail.com"

        # the check validation as test admin
        When I open the url "http://vrs:3001/logout"
        When I wait for "2" seconds

        When I login with user:"Test" password "123"
        Then I wait on element "*=TA" to be displayed

        Then I expect that VRS test "Create by User - 1" has "New" status
        When I click on "Create by User - 1" VRS test

        Then I expect that VRS test "Create by User - 1" is unfolded
        Then I expect that "1" check has Created "created by" equal to "i_ivanov@gmail.com"



