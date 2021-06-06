@integration
Feature: Baseline - Remove

    Background:
        Given I clear test VRS database
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

        # login as test admin
        When I open the url "http://vrs:3001/login"
        When I wait for "2" seconds
        When I login with user:"Test" password "123"
        Then I wait on element "*=TA" to be displayed

        # create user
        When I open the url "http://vrs:3001/admin?task=users"
        When I wait for "3" seconds
        When I click on the element "#add-user"
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

        When I open the url "http://vrs:3001/logout"
        When I wait for "1" seconds

        # login by user
        When I open the url "http://vrs:3001/login"
        When I wait for "2" seconds
        When I login with user:"i_ivanov@gmail.com" password "Password-123"
        Then I wait on element "*=II" to be displayed

        # generate and parse API key
        When I click on the element "a#user-icon"
        When I click on the element "#generate-api"
        When I accept the confirmbox
        When I parse the API key
        When I set the API key in config

    Scenario: Remove Baseline - 1 unaccepted Check
        # create check
        When I create "1" tests with params:
        """
          filePath: files/A.png
          testName: Baseline Base Flow
          checkName: Check - 1
        """

        # check baseline without acceptance
        Then I expect 1 baselines
        Then I expect 1st baseline with:
        """
        browserName: 'Chrome'
        markedByUsername: ''
        markedAs: ''
        """

        # delete single check
        When I open the url "http://vrs:3001"
        When I wait for "2" seconds
        Then I expect that VRS test "Baseline Base Flow - 1" has "New" status
        Then I expect that VRS test "Baseline Base Flow - 1" has "Unaccepted" accepted status

        When I click on "Baseline Base Flow - 1" VRS test
        When I wait for "2" seconds
        Then I expect that VRS test "Baseline Base Flow - 1" is unfolded
        When I click on the element "a.remove-button"
        When I click on the element "a.remove-option"
        When I wait for "3" seconds

        Then I expect 0 baselines
        When I stop the Syngrisi server

    Scenario: Remove Baseline - 2 unaccepted Check
        # create check
        When I create "1" tests with params:
        """
          filePath: files/A.png
          testName: Baseline Base Flow
          checkName: Check - 1
        """

        When I create "1" tests with params:
        """
          filePath: files/A.png
          testName: Baseline Base Flow
          checkName: Check - 1
        """

        # check baseline without acceptance
        Then I expect 1 baselines
        Then I expect 1st baseline with:
        """
        browserName: 'Chrome'
        markedByUsername: ''
        markedAs: ''
        """

        # delete 1 check
        When I open the url "http://vrs:3001"
        When I wait for "2" seconds
        Then I expect that VRS test "Baseline Base Flow - 1" has "Passed" status
        Then I expect that VRS test "Baseline Base Flow - 1" has "Unaccepted" accepted status

        When I click on "Baseline Base Flow - 1" VRS test
        When I wait for "2" seconds
        Then I expect that VRS test "Baseline Base Flow - 1" is unfolded
        When I click on the element "a.remove-button"
        When I click on the element "a.remove-option"
        When I wait for "3" seconds

        Then I expect 1 baselines

        # delete 2 check
        When I open the url "http://vrs:3001"
        When I wait for "2" seconds
        Then I expect that VRS test "Baseline Base Flow - 1" has "New" status
        Then I expect that VRS test "Baseline Base Flow - 1" has "Unaccepted" accepted status

        When I click on "Baseline Base Flow - 1" VRS test
        When I wait for "2" seconds
        Then I expect that VRS test "Baseline Base Flow - 1" is unfolded
        When I click on the element "a.remove-button"
        When I click on the element "a.remove-option"
        When I wait for "3" seconds

        Then I expect 0 baselines
        When I stop the Syngrisi server

    Scenario: Remove Baseline - 1 unaccepted, 1 accepted Checks
        # create check
        When I create "1" tests with params:
        """
          filePath: files/A.png
          testName: Baseline Base Flow
          checkName: Check - 1
        """

        When I create "1" tests with params:
        """
          filePath: files/A.png
          testName: Baseline Base Flow
          checkName: Check - 1
        """
        # accept 2nd check, check baselines
        When I open the url "http://vrs:3001"
        When I wait for "2" seconds
        Then I expect that VRS test "Baseline Base Flow - 1" has "Passed" status
        Then I expect that VRS test "Baseline Base Flow - 1" has "Unaccepted" accepted status

        When I click on "Baseline Base Flow - 1" VRS test
        When I wait for "2" seconds
        Then I expect that VRS test "Baseline Base Flow - 1" is unfolded
        When I click on the element "a.accept-button"
        When I click on the element "a.accept-option"
        When I wait for "3" seconds

        Then I expect 2 baselines
        Then I expect 1st baseline with:
        """
        browserName: 'Chrome'
        markedByUsername: ''
        markedAs: ''
        """

        Then I expect 2st baseline with:
        """
        browserName: 'Chrome'
        markedByUsername: 'i_ivanov@gmail.com'
        markedAs: 'accepted'
        """
        # delete 1 check
        When I open the url "http://vrs:3001"
        When I wait for "2" seconds
        Then I expect that VRS test "Baseline Base Flow - 1" has "Passed" status
        Then I expect that VRS test "Baseline Base Flow - 1" has "Accepted" accepted status

        When I click on "Baseline Base Flow - 1" VRS test
        When I wait for "2" seconds
        Then I expect that VRS test "Baseline Base Flow - 1" is unfolded
        When I click on the element "a.remove-button"
        When I click on the element "a.remove-option"
        When I wait for "3" seconds
        Then I expect 2 baselines

        # delete 2 check
        When I open the url "http://vrs:3001"
        When I wait for "2" seconds
        Then I expect that VRS test "Baseline Base Flow - 1" has "New" status
        Then I expect that VRS test "Baseline Base Flow - 1" has "Unaccepted" accepted status

        When I click on "Baseline Base Flow - 1" VRS test
        When I wait for "2" seconds
        Then I expect that VRS test "Baseline Base Flow - 1" is unfolded
        When I click on the element "a.remove-button"
        When I click on the element "a.remove-option"
        When I wait for "3" seconds
        Then I expect 1 baselines

        When I stop the Syngrisi server
