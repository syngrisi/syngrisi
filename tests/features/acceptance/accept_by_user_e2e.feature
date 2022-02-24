@integration @e2e
Feature: Acceptance by User

    Background:
        # setup env and create default test admin user
        Given I clear Database and stop Server
        When I set env variables:
        """
        TEST: 1
        SYNGRISI_AUTH: 0
        """
        Given I start Server
        Given I create via http test user
        Given I stop Server

        When I set env variables:
        """
        TEST: 0
        SYNGRISI_AUTH: 1
        """
        Given I start Server and start Driver

        # login as test admin
        When I login via http with user:"Test" password "123"
        # create user
        When I create via http user as:"Test" with params:
        """
        {
            "username": "j_doe@gmail.com",
            "firstName": "John",
            "lastName": "Doe",
            "role": "user",
            "password": "Password-123"
        }
        """

        When I login via http with user:"j_doe@gmail.com" password "Password-123"
        # generate and parse API key
        When I generate via http API key for the User
        When I set the API key in config

    @smoke
    Scenario: Create and accept by user
    create first, accept, create second, accept
        # create first check
        When I create "1" tests with params:
        """
          filePath: files/A.png
          checkName: Check - 1
          testName: Accept by User
        """

        # login by user
        When I login with user:"j_doe@gmail.com" password "Password-123"
        Then I wait on element "*=JD" to be displayed

        # first check validation before accept
        When I go to "main" page
        When I wait for "3" seconds
        Then I expect that VRS test "Accept by User - 1" has "New" status
        Then I expect that VRS test "Accept by User - 1" has "Unaccepted" accepted status

        # first check accept and validation
        When I click on "Accept by User - 1" VRS test
        Then I expect that VRS test "Accept by User - 1" is unfolded
        When I accept the "Check - 1" check

        When I wait for "3" seconds
        Then I expect that VRS test "Accept by User - 1" has "New" status
        Then I expect that VRS test "Accept by User - 1" has "Accepted" accepted status

        Then I expect that VRS check "1/1 Check - 1" has "New" status
        Then I expect the 1st "1/1 Check - 1" check has "accept" acceptance status

        Then I expect that the element "(//i[contains(@class, 'accept-button-icon')])[1]" to have attribute "title" containing "Accepted by: j_doe@gmail.com"
        Then I expect that the element "(//i[contains(@class, 'accept-button-icon')])[1]" to have attribute "title" containing "Accepted date: <YYYY-MM-DD>"

        When I refresh page
        When I wait for "3" seconds
        Then I expect that VRS test "Accept by User - 1" has "Accepted" accepted status

        When I click on "Accept by User - 1" VRS test
        Then I expect that VRS test "Accept by User - 1" is unfolded
        Then I expect that VRS check "1/1 Check - 1" has "New" status
        Then I expect the 1st "1/1 Check - 1" check has "accept" acceptance status

        Then I expect that "1" check preview tooltip "accepted by" field equal to "j_doe@gmail.com"
        Then I expect that "1" check preview tooltip "created by" field equal to "j_doe@gmail.com"
        Then I expect that "1" check preview tooltip "marked as" field equal to "accepted"
        Then I expect that "1" check preview tooltip "accepted date" field equal to "<YYYY-MM-DD>"
        Then I expect that "1" check preview tooltip "created date" field equal to "<YYYY-MM-DD>"

        # create second check
        When I create "1" tests with params:
        """
          filePath: files/A.png
          checkName: Check - 1
          testName: Accept by User
        """

        # second check validation before accept
        When I go to "main" page
        When I wait for "3" seconds
        Then I expect that VRS test "Accept by User - 1" has "Passed" status
        Then I expect that VRS test "Accept by User - 1" has "Accepted" accepted status

        When I click on "Accept by User - 1" VRS test
        Then I expect that VRS test "Accept by User - 1" is unfolded
        When I wait for "2" seconds

        Then I expect that VRS check "1/1 Check - 1" has "Passed" status
        Then I expect the 1st "1/1 Check - 1" check has "previously accept" acceptance status

        Then I expect that the element "(//i[contains(@class, 'accept-button-icon')])[1]" to have attribute "title" containing "Accepted by: j_doe@gmail.com"
        Then I expect that the element "(//i[contains(@class, 'accept-button-icon')])[1]" to have attribute "title" containing "Accepted date: <YYYY-MM-DD>"

        Then I expect that "1" check preview tooltip "accepted by" field equal to "j_doe@gmail.com"
        Then I expect that "1" check preview tooltip "created by" field equal to "j_doe@gmail.com"
        Then I expect that "1" check preview tooltip "marked as" field equal to "accepted"
        Then I expect that "1" check preview tooltip "accepted date" field equal to "<YYYY-MM-DD>"
        Then I expect that "1" check preview tooltip "created date" field equal to "<YYYY-MM-DD>"

        # first check accept and validation
        When I accept the "Check - 1" check

        When I wait for "3" seconds
        Then I expect that VRS test "Accept by User - 1" has "Passed" status
        Then I expect that VRS test "Accept by User - 1" has "Accepted" accepted status

        Then I expect that VRS check "1/1 Check - 1" has "Passed" status
        Then I expect the 1st "1/1 Check - 1" check has "accept" acceptance status

        Then I expect that the element "(//i[contains(@class, 'accept-button-icon')])[1]" to have attribute "title" containing "Accepted by: j_doe@gmail.com"
        Then I expect that the element "(//i[contains(@class, 'accept-button-icon')])[1]" to have attribute "title" containing "Accepted date: <YYYY-MM-DD>"

        When I refresh page
        When I wait for "2" seconds
        Then I expect that VRS test "Accept by User - 1" has "Accepted" accepted status

        When I click on "Accept by User - 1" VRS test
        Then I expect that VRS test "Accept by User - 1" is unfolded
        Then I expect that VRS check "1/1 Check - 1" has "Passed" status
        Then I expect the 1st "1/1 Check - 1" check has "accept" acceptance status

        Then I expect that "1" check preview tooltip "accepted by" field equal to "j_doe@gmail.com"
        Then I expect that "1" check preview tooltip "created by" field equal to "j_doe@gmail.com"
        Then I expect that "1" check preview tooltip "marked as" field equal to "accepted"
        Then I expect that "1" check preview tooltip "accepted date" field equal to "<YYYY-MM-DD>"
        Then I expect that "1" check preview tooltip "created date" field equal to "<YYYY-MM-DD>"

