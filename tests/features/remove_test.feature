Feature: Remove tests

    Background:
        Given I clear Database and stop Server
        When I set env variables:
        """
          TEST: 1
          SYNGRISI_AUTH: 0
        """
        Given I start VRS server
        When I create via http test user

        Given I stop the Syngrisi server
        When I set env variables:
        """
          TEST: 0
          SYNGRISI_AUTH: 1
        """
        Given I start Server and start Driver

        # create user
        When I login via http with user:"Test" password "123"
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
        When I generate via http API key for the User
        When I set the API key in config

    @e2e @smoke
    Scenario: Remove One unaccepted test
        # create check
        When I create "1" tests with params:
        """
          testName: Remove tests - 1
          checkName: Check - 1
        """
        When I wait for "2" seconds
        When I parse via http "actual" snapshot for 1st check with name "Check - 1"
        Then I expect exact "1" snapshot files

        # delete single test
        When I login with user:"j_doe@gmail.com" password "Password-123"
        When I wait for "2" seconds
        When I click on the element "[name='test']"
        When I wait for "1" seconds
        When I click on the element "[name='remove-tests']"
        When I wait for "1" seconds
        When I accept the confirmbox

        Then I expect that element "span=Remove tests - 1" does not exist
        When I refresh page
        Then I expect that element "span=Remove tests - 1" does not exist
        Then I expect via http that "Check - 1" check exist exactly "0" times
        Then I expect via http that "Remove tests - 1" test exist exactly "0" times
        When I wait for "3" seconds
        Then I expect exact "0" snapshot files
        Then I expect via http 0 baselines

    @smoke
    Scenario: Remove One accepted test
        # create check
        When I create "1" tests with params:
        """
          testName: Remove tests
          checkName: Check - 1
        """
        When I wait for "2" seconds
#        When I login via http with user:"Test" password "123"
        When I accept via http the 1st check with name "Check - 1"

        # remove last
        When I remove via http the 1st test with name "Remove tests - 1"
        When I wait for "2" seconds
        Then I expect via http that "Check - 1" check exist exactly "0" times
        Then I expect via http that "Remove tests - 1" test exist exactly "0" times
        Then I expect exact "1" snapshot files
        Then I expect via http 1 baselines

    Scenario: Remove Two unaccepted tests with same ident, remove order: [last, first]
        # create check
        When I create "2" tests with params:
        """
          testName: Remove tests
          checkName: Check - 1
        """
        When I wait for "2" seconds
        Then I expect via http that "Check - 1" check exist exactly "2" times
        Then I expect via http that "Remove tests - 1" test exist exactly "1" times
        Then I expect via http that "Remove tests - 2" test exist exactly "1" times
        Then I expect exact "1" snapshot files

        # remove last
        When I remove via http the 1st test with name "Remove tests - 2"
        When I wait for "2" seconds
        Then I expect via http that "Check - 1" check exist exactly "1" times
        Then I expect via http that "Remove tests - 1" test exist exactly "1" times
        Then I expect via http that "Remove tests - 2" test exist exactly "0" times
        Then I expect exact "1" snapshot files
        Then I expect via http 0 baselines

        # remove first
        When I remove via http the 1st test with name "Remove tests - 1"
        When I wait for "2" seconds
        Then I expect via http that "Check - 1" check exist exactly "0" times
        Then I expect via http that "Remove tests - 1" test exist exactly "0" times
        Then I expect via http that "Remove tests - 2" test exist exactly "0" times
        Then I expect exact "0" snapshot files
        Then I expect via http 0 baselines

    Scenario: Remove Two unaccepted tests with same ident, remove order: [first, last]
        # create check
        When I create "2" tests with params:
        """
          testName: Remove tests
          checkName: Check - 1
        """
        When I wait for "2" seconds
        Then I expect via http that "Check - 1" check exist exactly "2" times
        Then I expect via http that "Remove tests - 1" test exist exactly "1" times
        Then I expect via http that "Remove tests - 2" test exist exactly "1" times
        Then I expect exact "1" snapshot files

        # remove first
        When I remove via http the 1st test with name "Remove tests - 1"
        When I wait for "2" seconds
        Then I expect via http that "Check - 1" check exist exactly "1" times
        Then I expect via http that "Remove tests - 2" test exist exactly "1" times
        Then I expect via http that "Remove tests - 1" test exist exactly "0" times
        Then I expect exact "1" snapshot files
        Then I expect via http 0 baselines

        # remove second
        When I remove via http the 1st test with name "Remove tests - 2"
        When I wait for "2" seconds
        Then I expect via http that "Check - 1" check exist exactly "0" times
        Then I expect via http that "Remove tests - 1" test exist exactly "0" times
        Then I expect via http that "Remove tests - 2" test exist exactly "0" times
        Then I expect exact "0" snapshot files
        Then I expect via http 0 baselines

    Scenario: Remove Two tests with same ident: [accepted, unaccepted], order: [last, first]
        # create checks
        When I create "2" tests with params:
        """
          testName: Remove tests
          checkName: Check - 1
        """
        When I wait for "2" seconds
        When I login via http with user:"Test" password "123"
        When I accept via http the 1st check with name "Check - 1"

        # remove last
        When I remove via http the 1st test with name "Remove tests - 2"
        When I wait for "2" seconds
        Then I expect via http that "Check - 1" check exist exactly "1" times
        Then I expect via http that "Remove tests - 1" test exist exactly "1" times
        Then I expect via http that "Remove tests - 2" test exist exactly "0" times
        Then I expect exact "1" snapshot files
        Then I expect via http 1 baselines

        # remove first
        When I remove via http the 1st test with name "Remove tests - 1"
        When I wait for "2" seconds
        Then I expect via http that "Check - 1" check exist exactly "0" times
        Then I expect via http that "Remove tests - 1" test exist exactly "0" times
        Then I expect via http that "Remove tests - 2" test exist exactly "0" times
        Then I expect exact "1" snapshot files
        Then I expect via http 1 baselines
