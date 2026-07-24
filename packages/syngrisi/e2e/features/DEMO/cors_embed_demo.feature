@demo @fast-server
Feature: CORS and Embed Demo
    Admin walkthrough of credentialed cross-origin Accept for CI and Allure embeds.

    Background:
        When I set env variables:
            """
            SYNGRISI_AUTH: "false"
            SYNGRISI_TEST_MODE: "true"
            SYNGRISI_DISABLE_DEV_CORS: "false"
            SYNGRISI_DISABLE_FIRST_RUN: "true"
            """
        Given I start Server
        And I clear database

    @demo
    Scenario: Demo - CORS and Embed admin settings
        When I go to "cors" page
        When I wait 10 seconds for the element with locator "[data-test='cors-embed-enabled']" to be visible

        When I set demo step 1 of 7: "Introduction"
        When I announce: "Welcome to CORS and Embed — a new Admin feature that lets reviewers Accept baselines from Jenkins Allure while already logged into Syngrisi, without sharing an API key."
        Then I wait for "2" seconds

        When I set demo step 2 of 7: "How it works"
        When I announce: "The blue guidance panel explains the flow: allowlist the CI origin, use SameSite none for cross-site cookies, prepare the session, then call Accept with a CSRF token."
        When I highlight element ".mantine-Alert-root"
        Then I wait for "3" seconds
        When I clear highlight

        When I set demo step 3 of 7: "Enable the feature"
        When I announce: "First we enable the master switch for production credentialed CORS."
        When I highlight element "[data-test='cors-embed-enabled']"
        Then I wait for "2" seconds
        When I click element with locator "[data-test='cors-embed-enabled']"
        When I wait 10 seconds for the element with locator "[data-test='cors-embed-allowed-origins']:not([disabled])" to be visible
        When I clear highlight

        When I set demo step 4 of 7: "Allowed origins"
        When I announce: "Add exact browser origins for your CI host — scheme, host, and port, with no path."
        When I highlight element "[data-test='cors-embed-allowed-origins']"
        When I fill "https://ci.example.com" into element with locator "[data-test='cors-embed-allowed-origins']"
        Then I wait for "2" seconds
        When I clear highlight

        When I set demo step 5 of 7: "SameSite and CSRF"
        When I announce: "For cross-site fetch from Allure, set the session cookie SameSite to none. CSRF protection stays required automatically."
        When I highlight element "[data-test='cors-embed-same-site']"
        Then I wait for "2" seconds
        When I select dropdown option "none (cross-site cookies, HTTPS required)" by clicking div for element "[data-test='cors-embed-same-site']"
        Then I wait for "2" seconds
        When I clear highlight

        When I set demo step 6 of 7: "Save settings"
        When I announce: "Save the configuration. Only allowlisted origins can make credentialed cross-origin Accept calls, limited by role and check status."
        When I highlight element "[data-test='cors-embed-save']"
        Then I wait for "1" seconds
        When I click element with locator "[data-test='cors-embed-save']"
        When I wait 10 seconds for the element with locator "//*[@aria-label='notification-success']" to be visible
        When I clear highlight

        When I set demo step 7 of 7: "Prepare cookie"
        When I announce: "Reviewers can click Prepare session cookie so the browser re-issues the cookie for cross-site use, then Accept from the CI report with credentials and CSRF."
        When I highlight element "[data-test='cors-embed-prepare-cookie']"
        Then I wait for "3" seconds
        When I clear highlight

        When I announce: "That completes the CORS and Embed setup tour. Your CI origin is ready for secure, credentialed Accept."
        Then I wait for "2" seconds
        When I end the demo
