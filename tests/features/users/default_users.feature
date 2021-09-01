@integration
Feature: Default Users

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
        When I stop the Syngrisi server

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
        When I login with user:"Test" password "123"
        Then I wait on element "*=TA" to be displayed

    Scenario: Default Administrator and Guest should be created after first server start
        When I open the url "http://vrs:3001/admin?task=users"
        When I wait for "3" seconds
        Then I expect that element "//input[@name='username' and @value='Administrator']/../..//input[@name='firstName' and @value='Syngrisi']/../..//input[@name='lastName' and @value='Admin']" is displayed
        Then I expect that element "//input[@name='username' and @value='Administrator']/../..//input[@name='firstName' and @value='Syngrisi']/../..//input[@name='lastName' and @value='Admin']/../..//select[@name='role']" contain value "admin"
