Feature: Get Checks

    Background:
        Given I clear test VRS database
        Given I kill process which used port: "3001"
        When I set env variables:
        """
        PAGE_SIZE: 3
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

    Scenario: Pagination - without parameters
        Given I start VRS session with parameters:
        """
          testName: "GetChecks1"
        """
        When I assert image with path: "files/A.png" as "GetChecks_1"
        When I stop VRS session

        Given I start VRS session with parameters:
        """
          testName: "GetChecks2"
        """
        When I assert image with path: "files/A.png" as "GetChecks_2"
        When I stop VRS session

        Given I start VRS session with parameters:
        """
          testName: "GetChecks3"
        """
        When I assert image with path: "files/A.png" as "GetChecks_3"
        When I stop VRS session

        Given I start VRS session with parameters:
        """
          testName: "GetChecks4"
        """
        When I assert image with path: "files/A.png" as "GetChecks_4"
        When I stop VRS session

        Given I start VRS session with parameters:
        """
          testName: "GetChecks5"
        """
        When I assert image with path: "files/A.png" as "GetChecks_5"
        When I stop VRS session

        # check 1st page response
        When I open the url "http://vrs:3001/checks?page=1"
        When I send "get" request to "http://vrs:3001/checks?page=1" with:
        """
        """
        When I expect the "get" 1st value response with:
        """
        name: 'GetChecks5'
        status: New
        """
        When I expect the "get" 2st value response with:
        """
        name: 'GetChecks4'
        status: New
        """
        When I expect the "get" 3st value response with:
        """
        name: 'GetChecks3'
        status: New
        """

        # check 2nd page response
        When I open the url "http://vrs:3001/checks?page=2"
        When I send "get" request to "http://vrs:3001/checks?page=2" with:
        """
        """
#        When I start debugger
        When I expect the "get" 1st value response with:
        """
        name: 'GetChecks2'
        status: New
        """
        When I expect the "get" 2st value response with:
        """
        name: 'GetChecks1'
        status: New
        """

    Scenario: Pagination - sort by name, ascending
        Given I start VRS session with parameters:
        """
          testName: "B_GetChecks2"
        """
        When I assert image with path: "files/A.png" as "B_GetChecks_2"
        When I stop VRS session

        Given I start VRS session with parameters:
        """
          testName: "C_GetChecks3"
        """
        When I assert image with path: "files/A.png" as "C_GetChecks_3"
        When I stop VRS session

        Given I start VRS session with parameters:
        """
          testName: "A_GetChecks1"
        """
        When I assert image with path: "files/A.png" as "A_GetChecks_1"
        When I stop VRS session

        Given I start VRS session with parameters:
        """
          testName: "E_GetChecks5"
        """
        When I assert image with path: "files/A.png" as "E_GetChecks_5"
        When I stop VRS session

        Given I start VRS session with parameters:
        """
          testName: "D_GetChecks4"
        """
        When I assert image with path: "files/A.png" as "D_GetChecks_4"
        When I stop VRS session

        # check 1st page response
        When I send "get" request to "http://vrs:3001/checks?page=1&sort_name_1" with:
        """
        """
        When I expect the "get" 1st value response with:
        """
        name: 'A_GetChecks1'
        status: New
        """
        When I expect the "get" 2st value response with:
        """
        name: 'B_GetChecks2'
        status: New
        """
        When I expect the "get" 3st value response with:
        """
        name: 'C_GetChecks3'
        status: New
        """

        # check 2nd page response
        When I send "get" request to "http://vrs:3001/checks?page=2&sort_name_1" with:
        """
        """
        When I expect the "get" 1st value response with:
        """
        name: 'D_GetChecks4'
        status: New
        """
        When I expect the "get" 2st value response with:
        """
        name: 'E_GetChecks5'
        status: New
        """

    Scenario: Pagination - sort by name, descending
        Given I start VRS session with parameters:
        """
          testName: "B_GetChecks2"
        """
        When I assert image with path: "files/A.png" as "B_GetChecks_2"
        When I stop VRS session

        Given I start VRS session with parameters:
        """
          testName: "C_GetChecks3"
        """
        When I assert image with path: "files/A.png" as "C_GetChecks_3"
        When I stop VRS session

        Given I start VRS session with parameters:
        """
          testName: "A_GetChecks1"
        """
        When I assert image with path: "files/A.png" as "A_GetChecks_1"
        When I stop VRS session

        Given I start VRS session with parameters:
        """
          testName: "E_GetChecks5"
        """
        When I assert image with path: "files/A.png" as "E_GetChecks_5"
        When I stop VRS session

        Given I start VRS session with parameters:
        """
          testName: "D_GetChecks4"
        """
        When I assert image with path: "files/A.png" as "D_GetChecks_4"
        When I stop VRS session

        # check 1st page response
#        When I send "get" request to "http://vrs:3001/checks?page=1&sortprop=name&sortorder=-1" with:
        When I send "get" request to "http://vrs:3001/checks?page=1&sort_name_-1" with:
        """
        """
        When I expect the "get" 1st value response with:
        """
        name: 'E_GetChecks5'
        status: New
        """
        When I expect the "get" 2st value response with:
        """
        name: 'D_GetChecks4'
        status: New
        """
        When I expect the "get" 3st value response with:
        """
        name: 'C_GetChecks3'
        status: New
        """

        # check 2nd page response
        When I send "get" request to "http://vrs:3001/checks?page=2&sort_name_-1" with:
        """
        """
        When I expect the "get" 1st value response with:
        """
        name: 'B_GetChecks2'
        status: New
        """
        When I expect the "get" 2st value response with:
        """
        name: 'A_GetChecks1'
        status: New
        """

    Scenario: Pagination - sort by date, descending
        Given I start VRS session with parameters:
        """
          testName: "B_GetChecks2"
        """
        When I assert image with path: "files/A.png" as "B_GetChecks_2"
        When I stop VRS session

        Given I start VRS session with parameters:
        """
          testName: "C_GetChecks3"
        """
        When I assert image with path: "files/A.png" as "C_GetChecks_3"
        When I stop VRS session

        Given I start VRS session with parameters:
        """
          testName: "A_GetChecks1"
        """
        When I assert image with path: "files/A.png" as "A_GetChecks_1"
        When I stop VRS session

        Given I start VRS session with parameters:
        """
          testName: "E_GetChecks5"
        """
        When I assert image with path: "files/A.png" as "E_GetChecks_5"
        When I stop VRS session

        Given I start VRS session with parameters:
        """
          testName: "D_GetChecks4"
        """
        When I assert image with path: "files/A.png" as "D_GetChecks_4"
        When I stop VRS session

        # check 1st page response
        When I send "get" request to "http://vrs:3001/checks?page=1&sort_updatedDate_-1" with:
        """
        """
        When I expect the "get" 1st value response with:
        """
        name: 'D_GetChecks4'
        status: New
        """
        When I expect the "get" 2st value response with:
        """
        name: 'E_GetChecks5'
        status: New
        """
        When I expect the "get" 3st value response with:
        """
        name: 'A_GetChecks1'
        status: New
        """

        # check 2nd page response
        When I send "get" request to "http://vrs:3001/checks?page=2&sort_updatedDate_-1" with:
        """
        """
        When I expect the "get" 1st value response with:
        """
        name: 'C_GetChecks3'
        status: New
        """
        When I expect the "get" 2st value response with:
        """
        name: 'B_GetChecks2'
        status: New
        """

    Scenario: Pagination - filter by suite name
        Given I start VRS session with parameters:
        """
          testName: "A_GetChecks1"
          suiteName: Suite1
        """
        When I assert image with path: "files/A.png" as "A_GetChecks_1"
        When I stop VRS session

        Given I start VRS session with parameters:
        """
          testName: "B_GetChecks2"
          suiteName: Suite1
        """
        When I assert image with path: "files/A.png" as "B_GetChecks_2"
        When I stop VRS session

        Given I start VRS session with parameters:
        """
          testName: "C_GetChecks3"
          suiteName: Suite1
        """
        When I assert image with path: "files/A.png" as "C_GetChecks_3"
        When I stop VRS session

        Given I start VRS session with parameters:
        """
          testName: "D_GetChecks4"
          suiteName: Suite1
        """
        When I assert image with path: "files/A.png" as "D_GetChecks_4"
        When I stop VRS session

        Given I start VRS session with parameters:
        """
          testName: "E_GetChecks5"
          suiteName: Suite2
        """
        When I assert image with path: "files/A.png" as "E_GetChecks_5"
        When I stop VRS session

        # Suite1 - check 1st page response
        When I send "get" request to "http://vrs:3001/checks?page=1&filter_suitename_eq=Suite1" with:
        """
        """
        When I expect the "get" 1st value response with:
        """
        name: 'D_GetChecks4'
        status: New
        """
        When I expect the "get" 2st value response with:
        """
        name: 'C_GetChecks3'
        status: New
        """
        When I expect the "get" 3st value response with:
        """
        name: 'B_GetChecks2'
        status: New
        """

        # Suite1 - check 2nd page response
        When I send "get" request to "http://vrs:3001/checks?page=2&filter_suitename_eq=Suite1" with:
        """
        """
        When I expect the "get" 1st value response with:
        """
        name: 'A_GetChecks1'
        status: New
        """

        # Suite2 - check 1st page response
        When I send "get" request to "http://vrs:3001/checks?page=1&filter_suitename_eq=Suite2" with:
        """
        """
        When I expect the "get" 1st value response with:
        """
        name: 'E_GetChecks5'
        status: New
        """

    Scenario: Pagination - filter by suite name, sort by name

        Given I start VRS session with parameters:
        """
          testName: "B_GetChecks2"
          suiteName: Suite1
        """
        When I assert image with path: "files/A.png" as "B_GetChecks_2"
        When I stop VRS session

        Given I start VRS session with parameters:
        """
          testName: "C_GetChecks3"
          suiteName: Suite1
        """
        When I assert image with path: "files/A.png" as "C_GetChecks_3"
        When I stop VRS session

        Given I start VRS session with parameters:
        """
          testName: "D_GetChecks4"
          suiteName: Suite1
        """
        When I assert image with path: "files/A.png" as "D_GetChecks_4"
        When I stop VRS session

        Given I start VRS session with parameters:
        """
          testName: "A_GetChecks1"
          suiteName: Suite1
        """
        When I assert image with path: "files/A.png" as "A_GetChecks_1"
        When I stop VRS session

        Given I start VRS session with parameters:
        """
          testName: "E_GetChecks5"
          suiteName: Suite2
        """
        When I assert image with path: "files/A.png" as "E_GetChecks_5"
        When I stop VRS session

        # Suite1 - check 1st page response
        When I send "get" request to "http://vrs:3001/checks?page=1&sort_name_1&filter_suitename_eq=Suite1" with:
        """
        """
        When I expect the "get" 1st value response with:
        """
        name: 'A_GetChecks1'
        status: New
        """
        When I expect the "get" 2st value response with:
        """
        name: 'B_GetChecks2'
        status: New
        """
        When I expect the "get" 3st value response with:
        """
        name: 'C_GetChecks3'
        status: New
        """

        # Suite1 - check 2nd page response
        When I send "get" request to "http://vrs:3001/checks?page=2&sort_name_1&filter_suitename_eq=Suite1" with:
        """
        """
        When I expect the "get" 1st value response with:
        """
        name: 'D_GetChecks4'
        status: New
        """

        # Suite2 - check 1st page response
        When I send "get" request to "http://vrs:3001/checks?page=1&sort_name_1&filter_suitename_eq=Suite2" with:
        """
        """
        When I expect the "get" 1st value response with:
        """
        name: 'E_GetChecks5'
        status: New
        """
