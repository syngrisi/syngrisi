Feature: Ident flow
When app perform the check it select the check baseline using the ident fields (ident):
['name', 'viewport', 'browserName', 'os', 'app', 'branch'], if we have two checks with same name but different ident
we should use different baselines for each checks.

  Background:
    Given I clear Database and stop Server
    Given I start Server and start Driver

  Scenario: Ident flow, same ident [accepted, passed]
    # first check
    Given I create "1" tests with:
    """
      testName: IdentTest
      project: IdentApp
      branch: IdentBranch
      checks:
          - checkName: IdentCheck
            viewport: 500x500
            browserName: safari
            os: Windows
            browserVersion: 1.0
            browserFullVersion: 1.0.111.1
            filePath: files/A.png
    """
    When I accept via http the 1st check with name "IdentCheck"

    Then I expect via http 1st check filtered as "name=IdentCheck" matched:
    """
      name: IdentCheck
      viewport: 500x500
      browserName: safari
      os: Windows
      branch: IdentBranch
      markedAs: accepted
      status: [new]
    """

    Then I expect via http 1st baseline filtered as "name=IdentCheck" matched:
    """
      name: IdentCheck
      viewport: 500x500
      browserName: safari
      os: Windows
      branch: IdentBranch
    """

    # second check
    # pay attention that only ident fields are identical, 'browserVersion' and 'browserFullVersion' are different
    Given I create "1" tests with:
    """
      testName: IdentTest
      project: IdentApp
      branch: IdentBranch
      checks:
          - checkName: IdentCheck
            viewport: 500x500
            browserName: safari
            os: Windows
            browserVersion: 2.0
            browserFullVersion: 2.0.222.2
            filePath: files/A.png
    """

    Then I expect via http 1st check filtered as "name=IdentCheck" matched:
    """
      name: IdentCheck
      viewport: 500x500
      browserName: safari
      os: Windows
      branch: IdentBranch
      markedAs: accepted
      status: [passed]
    """

  Scenario: Ident flow, different ident all tests are new
    # first check
    Given I create "1" tests with:
    """
      testName: IdentTest_0
      branch: IdentBranch
      project: IdentApp
      checks:
          - checkName: IdentCheck
            viewport: 500x500
            browserName: safari
            os: Windows
            filePath: files/A.png
    """
    When I accept via http the 1st check with name "IdentCheck"

    Given I create "1" tests with:
    """
      testName: IdentTest_viewport
      branch: IdentBranch
      project: IdentApp
      checks:
          - checkName: IdentCheck
            viewport: 500x1000
            browserName: safari
            os: Windows
            filePath: files/A.png
    """

    Given I create "1" tests with:
    """
      testName: IdentTest_browser
      branch: IdentBranch
      project: IdentApp
      checks:
          - checkName: IdentCheck
            viewport: 500x500
            browserName: chrome
            os: Windows
            filePath: files/A.png
    """

    Given I create "1" tests with:
    """
      testName: IdentTest_os
      branch: IdentBranch
      project: IdentApp
      checks:
          - checkName: IdentCheck
            viewport: 500x500
            browserName: safari
            os: macOs
            filePath: files/A.png
    """

    Given I create "1" tests with:
    """
      testName: IdentTest_branch
      branch: IdentBranch_1
      project: IdentApp
      checks:
          - checkName: IdentCheck
            viewport: 500x500
            browserName: safari
            os: Windows
            filePath: files/A.png
    """
    Given I create "1" tests with:
    """
      testName: IdentTest_project
      branch: IdentBranch
      project: IdentApp_1
      checks:
          - checkName: IdentCheck
            viewport: 500x500
            browserName: safari
            os: Windows
            filePath: files/A.png
    """

    Then I expect via http 6st check filtered as "name=IdentCheck" matched:
    """
      name: IdentCheck
      viewport: 500x500
      browserName: safari
      os: Windows
      status: [new]
    """

    Then I expect via http 5st check filtered as "name=IdentCheck" matched:
    """
      name: IdentCheck
      viewport: 500x1000
      status: [new]
    """

    Then I expect via http 4st check filtered as "name=IdentCheck" matched:
    """
      name: IdentCheck
      browserName: chrome
      status: [new]
    """

    Then I expect via http 3st check filtered as "name=IdentCheck" matched:
    """
      name: IdentCheck
      os: macOs
      status: [new]
    """

    Then I expect via http 2st check filtered as "name=IdentCheck" matched:
    """
      name: IdentCheck
      branch: IdentBranch_1
      status: [new]
    """

    Then I expect via http 2st check filtered as "name=IdentCheck" matched:
    """
      name: IdentCheck
      status: [new]
    """

  Scenario: Ident flow, same ident [unaccepted, failed]
    # first check
    Given I create "1" tests with:
    """
      testName: IdentTest
      project: IdentApp
      branch: IdentBranch
      checks:
          - checkName: IdentCheck
            viewport: 500x500
            browserName: safari
            os: Windows
            filePath: files/A.png
    """

    # second check
    Given I create "1" tests with:
    """
      testName: IdentTest
      project: IdentApp
      branch: IdentBranch
      checks:
          - checkName: IdentCheck
            viewport: 500x500
            browserName: safari
            os: Windows
            filePath: files/A.png
    """

    Then I expect via http 1st check filtered as "name=IdentCheck" matched:
    """
      name: IdentCheck
      viewport: 500x500
      browserName: safari
      os: Windows
      branch: IdentBranch
      status: [failed]
      failReasons: [not_accepted]
    """

  Scenario: Ident flow, same ident [accepted, failed]
    # first check
    Given I create "1" tests with:
    """
      testName: IdentTest
      project: IdentApp
      branch: IdentBranch
      checks:
          - checkName: IdentCheck
            viewport: 500x500
            browserName: safari
            os: Windows
            filePath: files/A.png
    """
    When I accept via http the 1st check with name "IdentCheck"

    # second check
    Given I create "1" tests with:
    """
      testName: IdentTest
      project: IdentApp
      branch: IdentBranch
      checks:
          - checkName: IdentCheck
            viewport: 500x500
            browserName: safari
            os: Windows
            filePath: files/B.png
    """

    Then I expect via http 1st check filtered as "name=IdentCheck" matched:
    """
      name: IdentCheck
      viewport: 500x500
      browserName: safari
      os: Windows
      branch: IdentBranch
      status: [failed]
      failReasons: [different_images]
    """

