# Deleting Baseline from Check Details

## Overview

Users can delete the baseline associated with a check directly from the Check Details modal. This feature streamlines the workflow for managing baselines when reviewing checks.

## UI Changes

-   **Toolbar Menu**: Added a "three dots" menu (kebab menu) to the Check Details toolbar, next to the existing action buttons.
-   **Delete Option**: The menu contains a "Delete Baseline" option with a trash icon.
-   **State**: The "Delete Baseline" option is disabled if no baseline is associated with the current check.

## Interaction Flow

1. **Open Check**: User opens a Check Details modal for a specific check.
2. **Open Menu**: User clicks the "three dots" menu in the toolbar.
3. **Select Delete**: User selects "Delete Baseline".
4. **Confirmation Modal**: A confirmation modal (`DeleteBaselineModal`) appears with the following content:
    - **Warning Message**: "Are you sure you want to delete this baseline?"
    - **Usage Information**: Displays the number of checks currently using this baseline (e.g., "Usage count: 5").
    - **Usage Link**: The usage count is a clickable link. Clicking it opens a new tab with the Checks view filtered by this baseline's snapshot ID, allowing the user to review affected checks before deletion.
5. **Confirm Deletion**: User clicks the "Delete" button.
6. **Processing**: The frontend sends a `DELETE` request to `/v1/baselines/:id`.
7. **Completion**:
    - A success notification is displayed.
    - The confirmation modal closes.
    - The Check Details modal closes (returning the user to the checks list), or the check data is refreshed to reflect the missing baseline.

## Implementation Details

-   **Frontend Components**:
    -   `Toolbar.tsx`: Handles the menu, modal state, and deletion logic using `useMutation`.
    -   `DeleteBaselineModal.tsx`: A reusable modal component for the confirmation dialog.
    -   `CheckDetails.tsx`: Fetches the baseline data (including `usageCount`) and passes the `baselineId` to the Toolbar.
-   **API Integration**:
    -   Uses `GenericService.delete('baselines', id)` to perform the deletion.
    -   The backend `remove` controller handles the deletion of the Baseline document.
-   **Data Fetching**:
    -   The `baseline_by_snapshot_id` query in `CheckDetails` now includes `includeUsage: 'true'` to fetch the usage count from the backend.

## Testing

-   **E2E Test**: `packages/syngrisi/e2e/features/CP/baselines/delete_baseline_via_check_details.feature`
    -   Verifies the presence and state of the "Delete Baseline" menu item.
    -   Verifies the confirmation modal content.
    -   Verifies the successful deletion of the baseline and the UI update.
