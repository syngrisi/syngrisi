@visual @comparison @shifting @Pending
Feature: Affected elements
    Based on DOM dump and diff

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver

    Scenario: Get Affected elements without offset
        # first check
        Given I start session with parameters:
        """
          testName: Get Affected elements
          suiteName: Affected elements
        """
        When I open the url "<syngrisiUrl>static/affected.html"
        When I visually check page with DOM as "Affected without shifting"
        When I stop session
        When I accept via http the 1st check with name "Affected without shifting"
        When I wait for "1" seconds

        # second check
        Given I start session with parameters:
        """
          testName: Get Affected elements
          suiteName: Affected elements
        """
        When I open the url "<syngrisiUrl>static/affected.html"
        When I execute javascript code:
        """
        document.getElementById('child').style['height']='90px'
        """
        When I visually check page with DOM as "Affected without shifting"
        When I stop session

        When I get all affected elements in current and last successful checks from the server
        Then I expect "actualElements" saved object:
        """
        - tag: DIV
          id: child
          x: 56
          y: 56
          width: 100
          height: 90
          domPath:
          - body
          - div#parent
          - div#child
          request: 56, 146
        - tag: DIV
          id: parent
          x: 5
          y: 5
          width: 202
          height: 202
          domPath:
          - body
          - div#parent
          request: 56, 155
        """

        Then I expect "prevElements" saved object:
        """
        - tag: DIV
          id: child
          x: 56
          y: 56
          width: 100
          height: 100
          domPath:
          - body
          - div#parent
          - div#child
          request: 56, 155
        """

