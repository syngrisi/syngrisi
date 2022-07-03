Feature: Resize checkview

    Background:
        Given I clear Database and stop Server
        Given I start Server and start Driver

    Scenario: High Image - resize by width and height [image height > canvas height, image height / canvas height < 10]
    ...┌──────────────┬─────┐
    ...│              │xxxxx│
    ...│              │xxxxx│
    ...│              │xxxxx│
    ...│              │xxxxx│
    ...│              │xxxxx│
    ...├──────────────┘xxxxx│
    ...│xxxxxxxxxxxxxxxxxxxx│
    ...│xxxxxxxxxxxxxxxxxxxx│
    ...└────────────────────┘
        Given I set window size: "1366x768"
        When I create "1" tests with params:
        """
          testName: "Test - High"
          checkName: Check - High
          filePath: files/high_image.png
        """
        When I open the app
        When I wait and refresh page on element "span=Test - High - 1" for "5" seconds to exist
        When I click on "Test - High - 1" VRS test
        When I wait for "2" seconds
        When I open "Check - High" view
        When I wait for "2" seconds
        When I execute javascript code:
        """
           return (parseInt(mainView.image.getScaledWidth()) === 397 // for headless mode
           || parseInt(mainView.image.getScaledWidth()) === 328).toString()
        """
        When I wait for "1" seconds
        Then I expect the stored "js" string is equal:
        """
          true
        """

    Scenario: Extra High Image - resize only by width [image height > canvas height, image height / canvas height > 10]
    ...┌──────────────┬──┐
    ...│              │xx│
    ...│              │xx│
    ...│              │xx│
    ...│              │xx│
    ...│              │xx│
    ...│              │xx│
    ...├──────────────┘xx│
    ...│xxxxxxxxxxxxxxxxx│
    ...│xxxxxxxxxxxxxxxxx│
    ...│xxxxxxxxxxxxxxxxx│
    ...│xxxxxxxxxxxxxxxxx│
    ...│xxxxxxxxxxxxxxxxx│
    ...│xxxxxxxxxxxxxxxxx│
    ...│xxxxxxxxxxxxxxxxx│
    ...│xxxxxxxxxxxxxxxxx│
    ...└─────────────────┘
        Given I set window size: "1366x768"
        When I create "1" tests with params:
        """
          testName: "Test - Extra High"
          checkName: Check - Extra High
          filePath: files/extra_heigh_image.png
        """
        When I open the app
        When I wait and refresh page on element "span=Test - Extra High - 1" for "5" seconds to exist
        When I click on "Test - Extra High - 1" VRS test
        When I wait for "2" seconds
        When I open "Check - Extra High" view
        When I wait for "2" seconds
        When I execute javascript code:
        """
           return (parseInt(mainView.image.getScaledWidth()) === 1008 // for headless mode
           || parseInt(mainView.image.getScaledWidth()) === 1008).toString()
        """
        When I wait for "1" seconds
        Then I expect the stored "js" string is equal:
        """
          true
        """

    Scenario: Low High Image with normal width - no resize [image width < canvas width]
    ...┌──────────────┐
    ...│              │
    ...│ ┌───────┐    │
    ...│ │xxxxxxx│    │
    ...│ └───────┘    │
    ...│              │
    ...│              │
    ...└──────────────┘
        Given I set window size: "1366x768"
        When I create "1" tests with params:
        """
          testName: "Test - Low High"
          checkName: Check - Low High
          filePath: files/low_high_image_with_normal_width.png
        """
        When I open the app
        When I wait and refresh page on element "span=Test - Low High - 1" for "5" seconds to exist
        When I click on "Test - Low High - 1" VRS test
        When I wait for "2" seconds
        When I open "Check - Low High" view
        When I wait for "2" seconds
        When I execute javascript code:
        """
           return (parseInt(mainView.image.getScaledWidth()) === parseInt(mainView.image.width)).toString()
        """
        When I wait for "1" seconds
        Then I expect the stored "js" string is equal:
        """
          true
        """

    Scenario: Low High Image with wide width - resize by width  [image width > canvas width]
    ...┌──────────────┐
    ...│              │
    ...│ ┌────────────┴─────┐
    ...│ │xxxxxxxxxxxxxxxxxx│
    ...│ └────────────┬─────┘
    ...│              │
    ...│              │
    ...└──────────────┘
        Given I set window size: "1366x768"
        # 3524 x 114
        When I create "1" tests with params:
        """
          testName: "Test - Low High Wide"
          checkName: Check - Low High Wide
          filePath: files/low_high_mage_with_wide_width.png
        """
        When I open the app
        When I wait and refresh page on element "span=Test - Low High Wide - 1" for "5" seconds to exist
        When I click on "Test - Low High Wide - 1" VRS test
        When I wait for "2" seconds
        When I open "Check - Low High Wide" view
        When I wait for "2" seconds
        When I execute javascript code:
        """
           return (parseInt(mainView.image.getScaledWidth()) === 1008 // for headless mode
           || parseInt(mainView.image.getScaledWidth()) === 1008).toString()
        """
        When I wait for "1" seconds
        Then I expect the stored "js" string is equal:
        """
          true
        """

    Scenario: Extra Low High Image - resize height 2 times [image height < 50px]
    ...┌──────────────┐
    ...│              │
    ...│ ┌─┐          │
    ...│ │x│          │
    ...│ └─┘          │
    ...│              │
    ...│              │
    ...└──────────────┘
        Given I set window size: "1366x768"
        # 160 x 48
        When I create "1" tests with params:
        """
          testName: "Test - Extra Low High"
          checkName: Check - Extra Low High
          filePath: files/extra_low_high_image.png
        """
        When I open the app
        When I wait and refresh page on element "span=Test - Extra Low High - 1" for "5" seconds to exist
        When I click on "Test - Extra Low High - 1" VRS test
        When I wait for "2" seconds
        When I open "Check - Extra Low High" view
        When I wait for "2" seconds
        When I execute javascript code:
        """
           return parseInt(mainView.image.getScaledHeight()).toString() // for headless mode
        """
        When I wait for "1" seconds
        Then I expect the stored "js" string is equal:
        """
          96
        """

    Scenario: Extra Low High Image with wide width - resize by width [image width > canvas width, image height < 50px]
    ...┌──────────────┐
    ...│              │
    ...│ ┌────────────┴──────┐
    ...│ │xxxxxxxxxxxxxxxxxxx│
    ...│ └────────────┬──────┘
    ...│              │
    ...│              │
    ...└──────────────┘
        Given I set window size: "1366x768"
        # 3564 x 48
        When I create "1" tests with params:
        """
          testName: "Test - Extra Low High Wide"
          checkName: Check - Extra Low High Wide
          filePath: files/extra_low_high_image_with_wide_width.png
        """
        When I open the app
        When I wait and refresh page on element "span=Test - Extra Low High Wide - 1" for "5" seconds to exist
        When I click on "Test - Extra Low High Wide - 1" VRS test
        When I wait for "2" seconds
        When I open "Check - Extra Low High Wide" view
        When I wait for "2" seconds
        When I execute javascript code:
        """
           return (parseInt(mainView.image.getScaledWidth()) === 1008 // for headless mode
           || parseInt(mainView.image.getScaledWidth()) === 1008).toString()
        """
        When I wait for "1" seconds
        Then I expect the stored "js" string is equal:
        """
          true
        """


