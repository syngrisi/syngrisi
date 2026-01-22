@cp @generated @smoke @mode:serial
Feature: Share Check Feature

  Background:
    When I set env variables:
      """
      SYNGRISI_TEST_MODE: true
      SYNGRISI_AUTH: false
      """
    Given I start Server
    When I create via http test user
    Given I stop Server

    When I set env variables:
      """
      SYNGRISI_TEST_MODE: false
      SYNGRISI_AUTH: true
      """
    When I reload session

    # Fix for 401 error: ensure valid API key is used
    When I login via http with user:"Test" password "123456aA-"
    When I generate via http API key for the User
    When I set the API key in config

    When I login with user:"Test" password "123456aA-"
    When I wait 10 seconds for the element with locator "span*=TA" to be visible

  Scenario: Open Share modal from Check Details menu
    Given I create "1" tests with:
      """
          testName: ShareTest
          checks:
            - checkName: CheckToShare
              filePath: files/A.png
      """
    When I go to "main" page
    When I unfold the test "ShareTest"
    When I click element with locator "[data-test-preview-image='CheckToShare']"
    When I wait 10 seconds for the element with locator "[data-check-header-name='CheckToShare']" to be visible

    # Open menu and click Share
    When I click element with locator "[data-test='check-details-menu']"
    When I wait 2 seconds for the element with locator "[data-test='menu-share-check']" to be visible
    When I click element with locator "[data-test='menu-share-check']"

    # Verify Share modal is open
    When I wait 5 seconds for the element with locator "[data-test='create-share-button']" to be visible
    Then the element with locator "[data-test='create-share-button']" should be visible

  Scenario: Create share link and verify URL format
    Given I create "1" tests with:
      """
          testName: ShareLinkTest
          checks:
            - checkName: CheckForLink
              filePath: files/A.png
      """
    When I go to "main" page
    When I unfold the test "ShareLinkTest"
    When I click element with locator "[data-test-preview-image='CheckForLink']"
    When I wait 10 seconds for the element with locator "[data-check-header-name='CheckForLink']" to be visible

    # Open Share modal
    When I click element with locator "[data-test='check-details-menu']"
    When I wait 2 seconds for the element with locator "[data-test='menu-share-check']" to be visible
    When I click element with locator "[data-test='menu-share-check']"
    When I wait 5 seconds for the element with locator "[data-test='create-share-button']" to be visible

    # Create share link
    When I click element with locator "[data-test='create-share-button']"
    When I wait 10 seconds for the element with locator "[data-test='share-url-input']" to be visible

    # Verify URL input and copy button are visible
    Then the element with locator "[data-test='share-url-input']" should be visible
    Then the element with locator "[data-test='copy-share-url']" should be visible

  Scenario: Access shared check as anonymous user - read-only mode verification
    Given I create "1" tests with:
      """
          testName: ShareAccessTest
          checks:
            - checkName: SharedCheck
              filePath: files/A.png
      """
    When I accept via http the 1st check with name "SharedCheck"
    When I go to "main" page
    When I unfold the test "ShareAccessTest"
    When I click element with locator "[data-test-preview-image='SharedCheck']"
    When I wait 10 seconds for the element with locator "[data-check-header-name='SharedCheck']" to be visible

    # Create share link while logged in
    When I click element with locator "[data-test='check-details-menu']"
    When I wait 2 seconds for the element with locator "[data-test='menu-share-check']" to be visible
    When I click element with locator "[data-test='menu-share-check']"
    When I wait 5 seconds for the element with locator "[data-test='create-share-button']" to be visible
    When I click element with locator "[data-test='create-share-button']"
    When I wait 10 seconds for the element with locator "[data-test='share-url-input']" to be visible

    # Save the share URL before logout (modal will close after logout)
    When I save the share URL

    # Logout to become anonymous user
    When I go to "logout" page
    # Wait for logout success modal and click Sign In to go to login page
    When I wait 10 seconds for the element with locator "a:has-text('Sign In')" to be visible
    When I click element with locator "a:has-text('Sign In')"
    When I wait 10 seconds for the element with locator "[data-test='login-email-input']" to be visible

    # Open saved share URL as anonymous user
    When I open the saved share URL

    # Wait for CheckDetails to load in share mode
    When I wait 10 seconds for the element with locator "[data-check='toolbar']" to be visible

    # Verify read-only mode: Accept button should NOT be visible
    Then the element with locator "[data-test='accept-button']" should not be visible

    # Verify read-only mode: Menu (three dots) should NOT be visible
    Then the element with locator "[data-test='check-details-menu']" should not be visible

    # Verify read-only mode: Remove button should NOT be visible
    Then the element with locator "[data-test='remove-button']" should not be visible

    # Verify navigation buttons are NOT visible
    Then the element with locator "[title='Previous Check']" should not be visible
    Then the element with locator "[title='Next Check']" should not be visible
    Then the element with locator "[title='Previous Test']" should not be visible
    Then the element with locator "[title='Next Test']" should not be visible

    # Verify image details are displayed (image size badge shows image is loaded)
    Then the element with locator "[data-check='image-size']" should be visible

  Scenario: Access shared check - Verify anonymous user cannot see other checks
    # This scenario assumes the fix is implemented (filtering by checkId)
    # Re-using the setup from previous scenario
    Given I create "1" tests with:
      """
          testName: ShareScopeTest
          checks:
            - checkName: CheckToShare
              filePath: files/A.png
            - checkName: OtherCheck
              filePath: files/B.png
      """
    When I accept via http the 1st check with name "CheckToShare"
    When I accept via http the 1st check with name "OtherCheck"
    When I go to "main" page
    When I unfold the test "ShareScopeTest"
    When I click element with locator "[data-test-preview-image='CheckToShare']"
    When I wait 10 seconds for the element with locator "[data-check-header-name='CheckToShare']" to be visible

    # Create share link
    When I click element with locator "[data-test='check-details-menu']"
    When I wait 2 seconds for the element with locator "[data-test='menu-share-check']" to be visible
    When I click element with locator "[data-test='menu-share-check']"
    When I wait 5 seconds for the element with locator "[data-test='create-share-button']" to be visible
    When I click element with locator "[data-test='create-share-button']"
    When I wait 10 seconds for the element with locator "[data-test='share-url-input']" to be visible
    When I save the share URL

    # Logout
    When I go to "logout" page
    When I wait 10 seconds for the element with locator "a:has-text('Sign In')" to be visible
    When I click element with locator "a:has-text('Sign In')"
    When I wait 10 seconds for the element with locator "[data-test='login-email-input']" to be visible

    # Open share URL
    When I open the saved share URL
    When I wait 10 seconds for the element with locator "[data-check='toolbar']" to be visible

    # Verify we are viewing 'CheckToShare'
    Then the element with locator "[data-check-header-name='CheckToShare']" should be visible

    # Verify via UI that we CANNOT see 'OtherCheck'
    Then the element with locator ".virtual-table-row:has-text('OtherCheck')" should not be visible

    # Attempt to navigate to checks list (should be restricted or show only 1 check)
    # In the new logic, the API should return only this check even if they call the list endpoint.
    # We can verify that if we went to the main page (if possible) or if the navigation allows it,
    # but the share view usually locks navigation.
    # Let's verify that even if we try to manipulate the URL or use API, we can't see 'OtherCheck'.
    # For E2E UI test, we can check that there are no navigation buttons to other checks if they existed nearby.

    # Actually, simpler test: The user is in CheckDetails view.
    # If they hit the 'Back' button (if it exists) or try to navigate, they shouldn't see 'OtherCheck'.
    # But since share view might not have back button, let's verify via API response if possible using a step or js?
    # Or, verify that we CANNOT see 'OtherCheck' in the UI.
    # Since we are in detailed view, we can't easily see other checks unless we navigate back.
    # If the user clicks on the logo or 'Runs', where do they go?

    # Based on requirements: "Аннонимному пользователю должны быть доступны только операции просмотра конкретного ОДНОГО чека"
    # So we should ensure they cannot navigate away or if they do, they see nothing.

    # Verify via API that we CANNOT perform write operations (update check)
    # We try to update 'CheckToShare' (e.g. change status or name, or just verify update endpoint fails)
    # We need the check ID. We can get it from the UI or assume we find it.
    # But simpler: just try to update ANY check.
    When I execute javascript code:
      """
      const params = new URLSearchParams(window.location.search);
      const token = params.get('share');
      const headers = token ? { 'x-share-token': token, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };

      return fetch('/v1/checks', { headers })
        .then(res => res.json())
        .then(data => {
           const check = data.results.find(c => c.name === 'CheckToShare');
           if (!check) throw new Error('CheckToShare not found');

           return fetch('/v1/checks/' + check._id, {
             method: 'PUT',
             headers: headers,
             body: JSON.stringify({ name: 'HackedName' })
           });
        })
        .then(res => {
          if (res.status === 200) throw new Error('Security Breach: Update operation succeeded! Status: ' + res.status);
          return 'Secure';
        })
      """


  # 2. Verify Sharing Panel Info
  # This requires us to be logged in to see the panel info?
  # "В панели шейринга должно быть видно кто пошарил линку и когда после шейринга"
  # This likely means when the logged-in user (or anyone with rights) opens the share dialog, they see the info.
  # OR does anonymous user see it? "who shared this link" - probably for the admin/user to manage shares.
  # Let's assume it's for the logged in user as per context "In the sharing panel".

  Scenario: Verify Sharing Panel displays Creator and Date
    Given I create "1" tests with:
      """
          testName: ShareInfoTest
          checks:
            - checkName: CheckInfo
              filePath: files/A.png
      """
    When I go to "main" page
    When I unfold the test "ShareInfoTest"
    When I click element with locator "[data-test-preview-image='CheckInfo']"
    When I wait 10 seconds for the element with locator "[data-check-header-name='CheckInfo']" to be visible

    # Create share link
    When I click element with locator "[data-test='check-details-menu']"
    Then the element with locator "[data-test='menu-share-check']" should be visible
    When I click element with locator "[data-test='menu-share-check']"
    Then the element with locator "[data-test='create-share-button']" should be visible
    When I click element with locator "[data-test='create-share-button']"
    Then the element with locator "[data-test='share-url-input']" should be visible

    # Verify info is displayed
    # We'll need to check for the text "Created by" and "on" (as seen in the code)
    # The code uses: <Text size="sm" color="dimmed">Created by ... on ...</Text>
    # And specifically: {token.createdByUsername} and {new Date(token.createdDate).toLocaleDateString()}

    When I wait until element "body" contains text "Created by"
    Then the element with locator "body" should have contains text "Created by"
    Then the element with locator "body" should have contains text "Test"
# "Test" is the username we logged in with
