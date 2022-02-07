@visual @comparison @shifting @Pending
Feature: Vertical Shifting
  Background:
    Given I clear Database and stop Server
    When I set env variables:
    """
    V_SHIFTING:1
    """
    Given I start Server and start Driver

  Scenario: Down-Up 1 pix
    Down-Up - because before make a comparison we crop bottom pixels of baseline and top pixels of actual image

    Given I start VRS session with parameters:
    """
      testName: Down-Up
      suiteName: Vertical Shifting
    """
    When I open the url "http://localhost:3001/static/shift.html"
    When I visually assert page as "Top - Down Shifting"
    When I stop VRS session

    Given I start VRS session with parameters:
    """
      testName: Down-Up
      suiteName: Vertical Shifting
    """
    When I open the url "http://localhost:3001/static/shift.html"
    When I execute javascript code:
    """
    document.getElementById('rectangle').style['margin-top']='1px'
    """
    When I visually assert page as "Top - Down Shifting"
    When I stop VRS session

  Scenario: Up-Down 1 pix
   Up-Down - because before make a comparison we crop top pixels of baseline and bottom pixels of actual image

    Given I start VRS session with parameters:
    """
      testName: Down-Up
      suiteName: Vertical Shifting
    """
    When I open the url "http://localhost:3001/static/shift.html"
    When I execute javascript code:
    """
    document.getElementById('rectangle').style['margin-top']='1px'
    """

    Then I visually assert page as "Top - Down Shifting"
    When I stop VRS session

    Given I start VRS session with parameters:
    """
      testName: Down-Up
      suiteName: Vertical Shifting
    """
    When I open the url "http://localhost:3001/static/shift.html"

    Then I visually assert page as "Top - Down Shifting"
    When I stop VRS session

