@integration
Feature: Pagination

    Background:
        Given I clear test VRS database
        Given I kill process which used port: "3001"

    Scenario: Pagination - no duplicated tests
        Given I start VRS server with parameters:
        """
          port: 3001
          databaseName: VRSdbTest
          baseLineFolder: ./baselinesTest/
          pageSize: 10
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
        When I open the url "http://vrs:3001/"
        When I wait for "3" seconds

        Then I expect that element "span*=Pagination Test" does appear exactly "5" times
        Then I expect that element "span=Pagination Test - 1" does appear exactly "1" times
        Then I expect that element "span=Pagination Test - 2" does appear exactly "1" times
        Then I expect that element "span=Pagination Test - 3" does appear exactly "1" times
        Then I expect that element "span=Pagination Test - 4" does appear exactly "1" times
        Then I expect that element "span=Pagination Test - 5" does appear exactly "1" times

    Scenario: Pagination, suite - no duplicated tests
        Given I start VRS server with parameters:
        """
          port: 3001
          databaseName: VRSdbTest
          baseLineFolder: ./baselinesTest/
          pageSize: 10
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
        When I open the url "http://vrs:3001/"
        When I click on the element "=Integration suite"
        When I wait for "3" seconds

        Then I expect that element "span*=Pagination Test" does appear exactly "5" times
        Then I expect that element "span=Pagination Test - 1" does appear exactly "1" times
        Then I expect that element "span=Pagination Test - 2" does appear exactly "1" times
        Then I expect that element "span=Pagination Test - 3" does appear exactly "1" times
        Then I expect that element "span=Pagination Test - 4" does appear exactly "1" times
        Then I expect that element "span=Pagination Test - 5" does appear exactly "1" times

    Scenario: Pagination - 3 pages appears from start
        Given I start VRS server with parameters:
        """
          port: 3001
          databaseName: VRSdbTest
          baseLineFolder: ./baselinesTest/
          pageSize: 10
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
        When I open the url "http://vrs:3001/"
        When I wait for "3" seconds

        Then I expect that element "span*=Pagination Test" does appear exactly "30" times

    Scenario: Pagination - scrolling
        Given I start VRS server with parameters:
        """
          port: 3001
          databaseName: VRSdbTest
          baseLineFolder: ./baselinesTest/
          pageSize: 10
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
        When I open the url "http://vrs:3001/"
        When I wait for "3" seconds

        Then I expect that element "span*=Pagination Test" does appear exactly "30" times

        When I scroll to the bottom of page
        When I wait for "3" seconds
        Then I expect that element "span*=Pagination Test" does appear exactly "40" times

