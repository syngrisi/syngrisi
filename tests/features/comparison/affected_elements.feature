@visual @comparison @shifting
Feature: Affected elements
  Based on DOM dump and diff
  Background:
    Given I clear Database and stop Server
    Given I start Server and start Driver

  Scenario: Get Affected elements without offset
    Given I start VRS session with parameters:
    """
      testName: Get Affected elements
      suiteName: Affected elements
    """
    When I open the url "http://localhost:3001/static/affected.html"
    When I visually check page with DOM as "Affected without shifting"
    When I stop VRS session

    Given I start VRS session with parameters:
    """
      testName: Get Affected elements
      suiteName: Affected elements
    """
    When I open the url "http://localhost:3001/static/affected.html"
    When I execute javascript code:
    """
    document.getElementById('child').style['height']='90px'
    """

    When I visually check page with DOM as "Affected without shifting"
    When I stop VRS session
    When I parse all affected elements in current and last successful checks from "http://localhost:3001/"

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

#  Scenario: Get Affected elements with offset
#    Given I start VRS session with parameters:
#    """
#      testName: Get Affected elements with offset
#      suiteName: Affected with offset
#    """
#    When I open the url "http://localhost:3001/static/affected_2.html"
#    When I visually check page with DOM dump as "Affected with shifting"
#    When I stop VRS session
#
#    Given I start VRS session with parameters:
#    """
#      testName: Get Affected elements with offset
#      suiteName: Affected with offset
#    """
#    When I open the url "http://localhost:3001/static/affected_2.html"
#    When I execute javascript code:
#    """
#    // document.getElementById('child').style['padding-top']='1px'
#    // document.getElementById('child').style['height']='99px'
#    document.getElementById('parent').style['margin-top']='6px'
#    document.getElementById('point').style['background']='green'
#    """
##    document.getElementsByTagName('body')[0].style['margin-top']='7px'
#    When I wait for "1" seconds
#    When I visually check page with DOM dump as "Affected with shifting"
#    When I stop VRS session
#    When I parse all affected elements in current and last successful checks from "http://localhost:3001/"

