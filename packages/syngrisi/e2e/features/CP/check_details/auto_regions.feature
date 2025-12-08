@smoke @fast-server
Feature: Check details - Auto Regions from Diff

    Background:
        When I open the app
        When I clear local storage

    Scenario: Auto regions - create ignore regions from diff areas
        # Create test with baseline
        Given I create "1" tests with:
            """
            testName: AutoRegionTest
            checks:
                - checkName: CheckWithDiff
                  filePath: files/A.png
            """
        When I accept via http the 1st check with name "CheckWithDiff"

        # Create second check with different image to produce diff
        Given I create "1" tests with:
            """
            testName: AutoRegionTest
            checks:
                - checkName: CheckWithDiff
                  filePath: files/B.png
            """

        # Open check details
        When I go to "main" page
        When I wait for test "AutoRegionTest" to appear in table
        When I unfold the test "AutoRegionTest"
        When I click element with locator "[data-test-preview-image='CheckWithDiff']"
        When I wait 10 seconds for the element with locator "[data-check-header-name='CheckWithDiff']" to be visible

        # Verify auto region button is enabled (has diff and baseline)
        When I wait 10 seconds for the element with locator "[data-check='auto-ignore-region']" to be visible
        Then the element with locator "[data-check='auto-ignore-region']" should be enabled

        # Wait for canvas to be ready
        When I repeat javascript code until stored "js" string equals "ready":
            """
            if (typeof mainView === 'undefined' || !mainView.canvas || !mainView.diffImage) return "loading";
            return "ready";
            """

        # Verify no regions exist initially
        When I execute javascript code:
            """
            return mainView.allRects.length.toString();
            """
        Then I expect the stored "js" string is equal:
            """
            0
            """

        # Click auto region button (or press R)
        When I press the "r" key
        When I wait 2 seconds

        # Verify regions were created (at least 1 region for the diff area)
        When I repeat javascript code until stored "js" string matches "^[1-9]":
            """
            if (typeof mainView === 'undefined' || !mainView.allRects) return "0";
            return mainView.allRects.length.toString();
            """

        # Verify all created regions are ignore_rect type
        When I execute javascript code:
            """
            const regions = mainView.allRects;
            const allIgnoreRects = regions.every(r => r.name === 'ignore_rect');
            return allIgnoreRects ? 'true' : 'false';
            """
        Then I expect the stored "js" string is equal:
            """
            true
            """

    Scenario: Auto regions - button disabled without diff
        # Create test with matching images (no diff)
        Given I create "1" tests with:
            """
            testName: NoDiffTest
            checks:
                - checkName: CheckNoDiff
                  filePath: files/A.png
            """
        When I accept via http the 1st check with name "CheckNoDiff"

        # Create second check with same image (will pass, no diff)
        Given I create "1" tests with:
            """
            testName: NoDiffTest
            checks:
                - checkName: CheckNoDiff
                  filePath: files/A.png
            """

        # Open check details
        When I go to "main" page
        When I wait for test "NoDiffTest" to appear in table
        When I unfold the test "NoDiffTest"
        When I click element with locator "[data-test-preview-image='CheckNoDiff']"
        When I wait 10 seconds for the element with locator "[data-check-header-name='CheckNoDiff']" to be visible

        # Wait for canvas to be ready
        When I repeat javascript code until stored "js" string equals "ready":
            """
            if (typeof mainView === 'undefined' || !mainView.canvas) return "loading";
            return "ready";
            """

        # Auto region button should be disabled (no diff image for passed check)
        Then the element with locator "[data-check='auto-ignore-region']" should be disabled

    Scenario: Auto regions - save and verify persistence
        # Create test with baseline
        Given I create "1" tests with:
            """
            testName: SaveRegionTest
            checks:
                - checkName: CheckToSave
                  filePath: files/A.png
            """
        When I accept via http the 1st check with name "CheckToSave"

        # Create second check with different image to produce diff
        Given I create "1" tests with:
            """
            testName: SaveRegionTest
            checks:
                - checkName: CheckToSave
                  filePath: files/B.png
            """

        # Open check details
        When I go to "main" page
        When I wait for test "SaveRegionTest" to appear in table
        When I unfold the test "SaveRegionTest"
        When I click element with locator "[data-test-preview-image='CheckToSave']"
        When I wait 10 seconds for the element with locator "[data-check-header-name='CheckToSave']" to be visible

        # Wait for canvas to be ready with diff
        When I repeat javascript code until stored "js" string equals "ready":
            """
            if (typeof mainView === 'undefined' || !mainView.canvas || !mainView.diffImage) return "loading";
            return "ready";
            """

        # Verify no regions exist initially
        When I execute javascript code:
            """
            return mainView.allRects.length.toString();
            """
        Then I expect the stored "js" string is equal:
            """
            0
            """

        # Create auto regions
        When I press the "r" key

        # Wait for regions to be created
        When I repeat javascript code until stored "js" string matches "^[1-9]":
            """
            if (typeof mainView === 'undefined' || !mainView.allRects) return "0";
            return mainView.allRects.length.toString();
            """

        # Save regions (Alt+S)
        When I press "Alt+s"
        When I wait 2 seconds

        # Verify success notification appeared
        Then the element with locator "[class*='mantine-Notification']" should have contains text "Regions saved"

        # Close the check details modal
        When I press the "Escape" key
        When I wait 1 second

        # Re-open the check details
        When I click element with locator "[data-test-preview-image='CheckToSave']"
        When I wait 10 seconds for the element with locator "[data-check-header-name='CheckToSave']" to be visible

        # Wait for canvas to be ready
        When I repeat javascript code until stored "js" string equals "ready":
            """
            if (typeof mainView === 'undefined' || !mainView.canvas) return "loading";
            return "ready";
            """

        # Wait for regions to load from server
        When I repeat javascript code until stored "js" string matches "^[1-9]":
            """
            if (typeof mainView === 'undefined' || !mainView.allRects) return "0";
            return mainView.allRects.length.toString();
            """

        # Verify at least one region was loaded (proves persistence after modal reopen)
        When I execute javascript code:
            """
            const count = mainView.allRects.length;
            return count > 0 ? 'persisted' : 'not_persisted';
            """
        Then I expect the stored "js" string is equal:
            """
            persisted
            """

        # Close modal before page refresh
        When I press the "Escape" key
        When I wait 1 second

        # Refresh the page to verify persistence across page reload
        When I refresh page
        When I wait for test "SaveRegionTest" to appear in table
        When I unfold the test "SaveRegionTest"
        When I click element with locator "[data-test-preview-image='CheckToSave']"
        When I wait 10 seconds for the element with locator "[data-check-header-name='CheckToSave']" to be visible

        # Wait for canvas to be ready after refresh
        When I repeat javascript code until stored "js" string equals "ready":
            """
            if (typeof mainView === 'undefined' || !mainView.canvas) return "loading";
            return "ready";
            """

        # Wait for regions to load from server after page refresh
        When I repeat javascript code until stored "js" string matches "^[1-9]":
            """
            if (typeof mainView === 'undefined' || !mainView.allRects) return "0";
            return mainView.allRects.length.toString();
            """

        # Verify regions persisted after full page refresh
        When I execute javascript code:
            """
            const count = mainView.allRects.length;
            return count > 0 ? 'persisted_after_refresh' : 'lost_after_refresh';
            """
        Then I expect the stored "js" string is equal:
            """
            persisted_after_refresh
            """
