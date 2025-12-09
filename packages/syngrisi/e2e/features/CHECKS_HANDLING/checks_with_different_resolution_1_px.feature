@fast-server @smoke
Feature: Checks with different resolutions 1px
        The 1px difference resolution should be ignored
        But this is applicable only if image was cropped by 1px from the bottom
    #    ┌───────────┐   ┌───────────┐
    #    │xxxxxxxxxxx│   │xxxxxxxxxxx│
    #    │xxxxxxxxxxx│   │xxxxxxxxxxx│
    #    │xxxxxxxxxxx│   │xxxxxxxxxxx│
    #    │xxxxxxxxxxx│   │xxxxxxxxxxx│
    #    │xxxxxxxxxxx│   │ooooooooooo│
    #    └───────────┘   └───────────┘

    Background:

    @flaky
    Scenario: Two checks with identical image parts but different resolutions [1px, bottom]
        Given I create "1" tests with:
            """
            testName: Checks with different resolutions 1px - 1
            checks:
              - checkName: CheckName
                filePath: files/A_cropped_bottom_1_px.png
            """
        When I accept via http the 1st check with name "CheckName"

        Given I create "1" tests with:
            """
            testName: Checks with different resolutions 1px - 2
            checks:
              - checkName: CheckName
                filePath: files/A.png
            """

        When I expect via http 1st test filtered as "name=Checks with different resolutions 1px - 2" matched:
            """
      status: Passed
            """

        Then I expect via http 1st check filtered as "name=CheckName" matched:
            """
      status: [passed]
            """
        When I open the app
