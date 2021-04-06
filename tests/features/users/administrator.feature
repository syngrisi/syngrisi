@integration
Feature: Default Administrator

    Background:
        Given I clear test VRS database
        Given I kill process which used port: "3001"
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

    Scenario: Default Administrator should be created after first server start
        When I open the url "http://vrs:3001/admin?task=users"
        When I wait for "3" seconds
        Then I expect that element "//input[@name='username' and @value='Administrator']/../..//input[@name='firstName' and @value='AdminFn']/../..//input[@name='lastName' and @value='AdminLn']" is displayed
