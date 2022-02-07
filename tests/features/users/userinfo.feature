Feature: Userinfo

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
        When I wait for "5" seconds
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

    Scenario: Userinfo - Logged User
        When I login with user:"Test" password "123"
        Then I wait on element "*=TA" to be displayed

        When I wait for "5" seconds
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
        When I stop the Syngrisi server
