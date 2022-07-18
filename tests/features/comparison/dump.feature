@visual @comparison @shifting
Feature: DOM dump
  Background:
      Given I clear Database and stop Server
      Given I start Server and start Driver

  Scenario: Create check with DOM dump
    Given I start session with parameters:
    """
      testName: Create Check with Dom Dump
      suiteName: Dom Dump
    """
    When I open the url "<syngrisiUrl>static/shift.html"
    When I visually check page with DOM as "Dom dump check"
    When I stop session

    Then I expect "checkDump" saved object:
    """
      "tag": "DIV"
      "id": "rectangle"
      "x": 0
      "y": 0
      "width": 644
      "height": 402
      "top": 0
      "right": 644
      "bottom": 402
      "left": 0
      "domPath":
        - "body"
        - "div#rectangle"
    """
