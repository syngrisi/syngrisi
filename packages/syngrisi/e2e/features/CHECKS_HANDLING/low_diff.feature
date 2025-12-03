@fast-server
Feature: Low images difference
      This feature checks if images with a low difference (rawMisMatchPercentage, e.q.: 0.001) are properly compared

      Background:
      #         Given I start Server and start Driver

      Scenario: Low images difference
            Given I create "1" tests with:
                  """
                  testName: TestName
                  checks:
                    - checkName: CheckName
                      filePath: files/low_diff_0.png
                  """
            When I accept via http the 1st check with name "CheckName"

            Given I create "1" tests with:
                  """
                  testName: TestName
                  checks:
                    - checkName: CheckName
                      filePath: files/low_diff_1.png
                  """

            Then I expect via http 2st check filtered as "name=CheckName" matched:
                  """
          name: CheckName
          status: [new]
                  """
            Then I expect via http 1st check filtered as "name=CheckName" matched:
                  """
          name: CheckName
          status: [failed]
          markedAs: accepted
          failReasons: [different_images]
                  """
