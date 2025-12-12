@fast-server
Feature: Image Preload on Test Expand

    Background:
        When I open the app
        When I clear local storage

    @smoke
    Scenario: Images are preloaded when test is expanded and cached for CheckDetails
        # Create test with multiple checks
        Given I create "1" tests with:
            """
            testName: PreloadTest
            checks:
              - checkName: Check1
                filePath: files/A.png
              - checkName: Check2
                filePath: files/B.png
            """

        # Start intercepting /snapshoots/ requests BEFORE loading page
        When I start intercepting image requests

        # Open main page
        When I go to "main" page
        When I wait 10 seconds for the element with locator "[data-table-test-name='PreloadTest']" to be visible

        # Expand test - this should trigger image loading (preview + preload)
        When I unfold the test "PreloadTest"



        # Verify images are requested during test expand
        # Each check has 1 actual image, so at least 2 image requests expected
        Then I expect at least 2 image requests were made
        When I log image request count

        # Reset counter before opening CheckDetails
        When I reset image request counter

        # Open CheckDetails - should use cached images (no new requests)
        When I open the 1st check "Check1"
        Then the element with locator "[data-check='toolbar']" should be visible



        # Verify canvas is rendered (image loaded successfully)
        Then the element with locator "canvas[id='2d']" should be visible

        # Verify cache was used - should have 0 or minimal new requests
        # (0 if fully cached, 1 if browser makes conditional request)
        When I log image request count
        Then I expect at most 1 new image requests were made
