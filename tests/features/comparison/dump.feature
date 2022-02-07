@visual @comparison @shifting
Feature: DOM dump
  Background:
      Given I clear Database and stop Server
      Given I start Server and start Driver

  Scenario: Create check with DOM dump
    Given I start VRS session with parameters:
    """
      testName: Create Check with Dom Dump
      suiteName: Dom Dump
    """
    When I open the url "http://localhost:3001/static/shift.html"
    When I visually check page with DOM as "Dom dump check"
    When I stop VRS session

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

#    Given I start VRS session with parameters:
#    """
#      testName: Down-Up
#      suiteName: Vertical Shifting
#    """
#    When I open the url "http://localhost:3001/static/shift.html"
#    When I execute javascript code:
#    """
#    document.getElementById('rectangle').style['margin-top']='1px'
#    """
#    When I visually assert page as "Top - Down Shifting"
#    When I stop VRS session
#
#  Scenario: Up-Down 1 pix
#   Up-Down - because before make a comparison we crop top pixels of baseline and bottom pixels of actual image
#
#    Given I start VRS session with parameters:
#    """
#      testName: Down-Up
#      suiteName: Vertical Shifting
#    """
#    When I open the url "http://localhost:3001/static/shift.html"
#    When I execute javascript code:
#    """
#    document.getElementById('rectangle').style['margin-top']='1px'
#    """
#
#    Then I visually assert page as "Top - Down Shifting"
#    When I stop VRS session
#
#    Given I start VRS session with parameters:
#    """
#      testName: Down-Up
#      suiteName: Vertical Shifting
#    """
#    When I open the url "http://localhost:3001/static/shift.html"
#
#    Then I visually assert page as "Top - Down Shifting"
#    When I stop VRS session
#
