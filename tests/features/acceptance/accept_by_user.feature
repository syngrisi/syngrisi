@integration
Feature: Acceptance by User

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

    @smoke
    Scenario: Create User and Accept
        # login as test admin
        When I login via http with user:"Test" password "123"
        # create user
        When I create via http user as:"Test" with params:
        """
        {
            "username": "i_ivanov@gmail.com",
            "firstName": "Ivan",
            "lastName": "Ivanov",
            "role": "user",
            "password": "Password-123"
        }
        """

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
          testName: Accept by User
        """

        # the check validation as new user
        When I go to "main" page
        When I wait for "3" seconds
        Then I expect that VRS test "Accept by User - 1" has "New" status
        Then I expect that VRS test "Accept by User - 1" has "Unaccepted" accepted status

        When I click on "Accept by User - 1" VRS test
        Then I expect that VRS test "Accept by User - 1" is unfolded
        When I click on the element "a.accept-button"
        When I click on the element "a.accept-option"

#        Then I expect that "1" check has Created "Accepted by" equal to "i_ivanov@gmail.com"
        When I wait for "2" seconds
        Then I expect that VRS test "Accept by User - 1" has "Accepted" accepted status

        When I refresh page
        When I wait for "2" seconds

        When I click on "Accept by User - 1" VRS test
        Then I expect that VRS test "Accept by User - 1" is unfolded
        Then I expect that "1" check has Created "accepted by" equal to "i_ivanov@gmail.com"
        Then I expect that VRS test "Accept by User - 1" has "Accepted" accepted status



#        Then I expect that "1" check has Created "Created by" equal to "i_ivanov@gmail.com"

#        # the check validation as test admin
#        When I open the url "http://vrs:3001/logout"
#        When I wait for "2" seconds
#
#        When I open the url "http://vrs:3001/login"
#        When I wait for "2" seconds
#        When I login with user:"Test" password "123"
#        Then I wait on element "*=TA" to be displayed
#
#        Then I expect that VRS test "Accept by User - 1" has "New" status
#        When I click on "Accept by User - 1" VRS test
#
#        Then I expect that VRS test "Accept by User - 1" is unfolded
#        Then I expect that "1" check has Created "Created by" equal to "i_ivanov@gmail.com"
#
