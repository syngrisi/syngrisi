@integration
Feature: Pagination

    Background:
        Given I clear Database and stop Server

    Scenario: Pagination - no duplicated tests
        When I set env variables:
        """
          PAGE_SIZE: 10
        """
        Given I start Server and start Driver

        When I create "5" tests with params:
        """
        filePath: files/A.png
        testName: Pagination Test
        """
        When I open the app
        When I wait for "3" seconds

        Then I expect that element "span*=Pagination Test" does appear exactly "5" times
        Then I expect that element "span*=Pagination Test - 1" does appear exactly "1" times
        Then I expect that element "span*=Pagination Test - 2" does appear exactly "1" times
        Then I expect that element "span*=Pagination Test - 3" does appear exactly "1" times
        Then I expect that element "span*=Pagination Test - 4" does appear exactly "1" times
        Then I expect that element "span*=Pagination Test - 5" does appear exactly "1" times

    Scenario: Pagination, suite - no duplicated tests
        When I set env variables:
        """
          PAGE_SIZE: 10
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

        When I create "5" tests with params:
        """
        filePath: files/A.png
        testName: Pagination Test
        """
        When I open the app
        When I click on the element "span=Integration suite"
        When I wait for "3" seconds

        Then I expect that element "span*=Pagination Test" does appear exactly "5" times
        Then I expect that element "span*=Pagination Test - 1" does appear exactly "1" times
        Then I expect that element "span*=Pagination Test - 2" does appear exactly "1" times
        Then I expect that element "span*=Pagination Test - 3" does appear exactly "1" times
        Then I expect that element "span*=Pagination Test - 4" does appear exactly "1" times
        Then I expect that element "span*=Pagination Test - 5" does appear exactly "1" times

    Scenario: Pagination - 3 pages appears from start
        When I set env variables:
        """
          PAGE_SIZE: 10
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

        When I create "40" tests with params:
        """
        filePath: files/A.png
        testName: Pagination Test
        """
        When I open the app
        When I wait for "3" seconds

        Then I expect that element "span*=Pagination Test" does appear exactly "30" times

    Scenario: Pagination - scrolling
        When I set env variables:
        """
          PAGE_SIZE: 10
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

        When I create "40" tests with params:
        """
        filePath: files/A.png
        testName: Pagination Test
        """
        When I wait for "5" seconds
        When I open the app
        When I wait for "5" seconds

        Then I expect that element "span*=Pagination Test" does appear exactly "30" times

        When I scroll to the bottom of page
        When I wait for "3" seconds
        Then I expect that element "span*=Pagination Test" does appear exactly "40" times

