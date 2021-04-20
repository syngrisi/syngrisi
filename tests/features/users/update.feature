@integration
Feature: Update User

    Background:
        Given I clear test VRS database
        Given I kill process which used port: "3001"
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
        When I open the url "http://vrs:3001/login"
        When I wait for "2" seconds
        When I login with user:"Test" password "123"
        Then I wait on element "*=TA" to be displayed

    Scenario: Update User - Success
        When I open the url "http://vrs:3001/admin?task=users"
        When I wait for "3" seconds
        When I click on the element "input[value='Add User']"
        When I set "i_ivanov@gmail.com" to the inputfield "//input[@placeholder='Username']"
        When I set "Ivan" to the inputfield "//input[@placeholder='First Name']"
        When I set "Ivanov" to the inputfield "//input[@placeholder='Last Name']"
        When I set "user" to the inputfield "//select[@new-user-role]"
        When I set "Password-123" to the inputfield "//input[@placeholder='password']"
        When I click on the element "a.send-new-user-button"
        When I wait for "3" seconds
        When I refresh page
        When I wait for "3" seconds
        Then I expect that element "//input[@name='username' and @value='i_ivanov@gmail.com']/../..//input[@name='firstName' and @value='Ivan']/../..//input[@name='lastName' and @value='Ivanov']" is displayed
        When I expect that element "//input[@name='username' and @value='i_ivanov@gmail.com']/../..//input[@name='firstName' and @value='Ivan']/../..//input[@name='lastName' and @value='Ivanov']/../..//select[@name='role']" contain value "user"

        When I set "Ivan_1" to the inputfield "//input[@name='username' and @value='i_ivanov@gmail.com']/../..//input[@name='firstName']"

        When I set "Ivanov_1" to the inputfield "//input[@name='username' and @value='i_ivanov@gmail.com']/../..//input[@name='lastName']"
        When I set "admin" to the inputfield "//input[@name='username' and @value='i_ivanov@gmail.com']/../..//select[@name='role']"
        When I set "Password-1234" to the inputfield "//input[@name='username' and @value='i_ivanov@gmail.com']/../..//input[@name='password']"
        When I wait for "1" seconds
        When I click on the element "a[update-button-username='i_ivanov@gmail.com']"
        When I wait for "5" seconds
        When I refresh page
        When I wait for "3" seconds
        Then I expect that element "//input[@name='username' and @value='i_ivanov@gmail.com']/../..//input[@name='firstName' and @value='Ivan_1']/../..//input[@name='lastName' and @value='Ivanov_1']" is displayed
        When I expect that element "//input[@name='username' and @value='i_ivanov@gmail.com']/../..//input[@name='firstName' and @value='Ivan_1']/../..//input[@name='lastName' and @value='Ivanov_1']/../..//select[@name='role']" contain value "admin"
