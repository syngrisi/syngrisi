Feature: Userinfo

    Background:
        Given I clear test VRS database
        Given I kill process which used port: "3001"
        When I set env variables:
        """
        TEST: 1
        SYNGRISY_AUTH: 0
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
        SYNGRISY_AUTH: 1
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

    Scenario: Userinfo - Logged User
        When I open the url "http://vrs:3001/login"
        When I wait for "2" seconds
        When I login with user:"Test" password "123"
        Then I wait on element "*=TA" to be displayed

        When I open the url "http://vrs:3001/userinfo"
        When I wait for "1" seconds
        Then page source match:
        """
        {
            "username": "Test",
            "role": "admin",
            "firstName": "Test",
            "lastName": "Admin"
        }
        """
