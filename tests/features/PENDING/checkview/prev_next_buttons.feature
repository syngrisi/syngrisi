Feature: Prev and Next CheckView Button

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver

    Scenario: Go to prev and next checks
        When I open the app
        When I create "1" tests with:
        """
          testName: "Prev and Next - $"
          checks:
            - filePath: files/A.png
              checkName: Check - 1
            - filePath: files/B.png
              checkName: Check - 2
            - filePath: files/A.png
              checkName: Check - 3
        """

        When I create "1" tests with:
        """
          testName: "Prev and Next - $"
          checks:
            - filePath: files/A.png
              checkName: Check - 1
            - filePath: files/B.png
              checkName: Check - 2
            - filePath: files/A.png
              checkName: Check - 3
        """

        When I wait and refresh page on element "span=Prev and Next - 1" for "5" seconds to exist
        When I click on "Prev and Next - 1" VRS test
        When I wait for "2" seconds
        When I open "Check - 1" view
        When I wait for "2" seconds
        Then the element "#check_count" contains the text "1/3"
        Then the element "#head_check_name" contains the text "Check - 1"
        # because native getAttribute method work wrongly
        When I execute javascript code:
        """
        return document.getElementById('previous').parentElement.getAttribute('disabled');
        """
        Then I expect the stored "js" string is equal:
        """
          true
        """

        When I execute javascript code:
        """
        return document.getElementById('next').parentElement.getAttribute('disabled');
        """
        Then I expect the stored "js" string is equal:
        """
          false
        """

        When I click on the element "#next"
        When I wait for "2" seconds
        Then the element "#check_count" contains the text "2/3"
        Then the element "#head_check_name" contains the text "Check - 2"
        When I execute javascript code:
        """
        return document.getElementById('previous').parentElement.getAttribute('disabled');
        """
        Then I expect the stored "js" string is equal:
        """
          false
        """

        When I execute javascript code:
        """
        return document.getElementById('next').parentElement.getAttribute('disabled');
        """
        Then I expect the stored "js" string is equal:
        """
          false
        """

        When I click on the element "#next"
        When I wait for "2" seconds
        Then the element "#check_count" contains the text "3/3"
        Then the element "#head_check_name" contains the text "Check - 3"
        When I execute javascript code:
        """
        return document.getElementById('previous').parentElement.getAttribute('disabled');
        """
        Then I expect the stored "js" string is equal:
        """
          false
        """

        When I execute javascript code:
        """
        return document.getElementById('next').parentElement.getAttribute('disabled');
        """
        Then I expect the stored "js" string is equal:
        """
          true
        """

        When I click on the element "#previous"
        When I wait for "2" seconds
        Then the element "#check_count" contains the text "2/3"
        Then the element "#head_check_name" contains the text "Check - 2"
        When I execute javascript code:
        """
        return document.getElementById('previous').parentElement.getAttribute('disabled');
        """
        Then I expect the stored "js" string is equal:
        """
          false
        """

        When I execute javascript code:
        """
        return document.getElementById('next').parentElement.getAttribute('disabled');
        """
        Then I expect the stored "js" string is equal:
        """
          false
        """
