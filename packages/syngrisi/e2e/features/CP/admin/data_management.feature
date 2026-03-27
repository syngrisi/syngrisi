@admin @settings @no-app-start
Feature: Admin Data Management
  As an administrator
  I want to manage backups and restores through the admin UI
  So that I can export and import application data without shell access

  Background:
    When I set env variables:
      """
          SYNGRISI_TEST_MODE: true
          SYNGRISI_AUTH: false
      """
    Given I start Server
    And I go to "admin/data" page
    Then the current url contains "/admin/data"
    Then the button "Start Database Backup" should be visible
    Then the button "Upload and Restore Database" should be visible
    Then the button "Start Screenshots Backup" should be visible
    Then the button "Upload and Restore Screenshots" should be visible

  Scenario: Admin can back up and restore the database through the UI
    When I click the 1st button "Start Database Backup"
    When I wait until element "body" contains text "Database backup completed"
    When I download the latest "Database Backup" archive and store it as "dbBackupDownload"
    Then the stored file "dbBackupDownload" should exist
    Then the stored tar.gz file "dbBackupDownload" should contain entries:
      """
      - manifest.json
      """
    When I upload stored file "dbBackupDownload" into file input "Database archive"
    When I click the 1st button "Upload and Restore Database"
    When I wait until element "body" contains text "Database restore completed"

  Scenario: Admin can back up screenshots through the UI
    When I create screenshot file "existing-one.png" with content "ONE"
    And I create screenshot file "nested/existing-two.png" with content "TWO"
    And I click the 1st button "Start Screenshots Backup"
    When I wait until element "body" contains text "Screenshots backup completed"
    When I download the latest "Screenshots Backup" archive and store it as "screenshotsBackupDownload"
    Then the stored file "screenshotsBackupDownload" should exist
    Then the stored tar.gz file "screenshotsBackupDownload" should contain entries:
      """
      - existing-one.png
      - nested/existing-two.png
      """

  Scenario: Admin can restore screenshots without overwriting existing files
    When I create screenshot file "existing.png" with content "OLD"
    And I create a screenshots restore archive stored as "screenshotsRestoreArchive":
      """
      existing.png: NEW
      imported/new-file.png: IMPORTED
      """
    And I upload stored file "screenshotsRestoreArchive" into file input "Screenshots archive"
    And I click the 1st button "Upload and Restore Screenshots"
    When I wait until element "body" contains text "Screenshots restore completed"
    Then the screenshot file "existing.png" should contain "OLD"
    Then the screenshot file "imported/new-file.png" should contain "IMPORTED"
