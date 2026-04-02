# UI and Backend Data Flow Architecture

## Purpose

This document explains how the main Syngrisi application moves data between the backend and frontend, how the main tests grid works, how check details are loaded and updated, how frontend queues and polling behave, and how state is stored across the application.

The scope here is the main application under:

- `packages/syngrisi/src/server`
- `packages/syngrisi/src/ui-app/index2`

It does not try to describe every feature in the repository. It focuses on the runtime path used by the main tests/checks UI.

## High-Level Architecture

Syngrisi uses a fairly direct request/response architecture:

1. The React UI triggers a query or mutation.
2. A frontend service builds an HTTP request.
3. The Express backend routes the request.
4. A controller parses request parameters and applies request-level rules.
5. A domain service performs business logic.
6. Mongoose models and plugins query MongoDB.
7. The backend returns paginated JSON data.
8. React Query caches the result and updates the UI.

The main pattern is:

`Component -> shared service -> http wrapper -> Express route -> controller -> service -> Mongoose model/plugin -> MongoDB`

## Main Runtime Entry Points

### Frontend

The main React application is bootstrapped in `src/ui-app/index2/main.tsx`.

Important responsibilities:

- creates the global React Query client
- enables `react-router`
- enables `use-query-params`
- wraps the app in an error boundary

This means three major state layers are present from the start:

- URL state
- React Query server state
- local component state

### Backend

The Express application is configured in `src/server/app.ts`.

Important responsibilities:

- security and compression middleware
- JSON and file upload parsing
- session and Passport authentication
- static file serving for screenshot assets
- `/v1` API mounting
- root UI route mounting

The screenshot files are served from `/snapshoots`, guarded by regular authentication, API key access, or share token access.

## Backend Layering

The backend is intentionally simple and follows a conventional structure:

- `routes/`: HTTP route declarations
- `controllers/`: request parsing and response formatting
- `services/`: business logic
- `models/`: MongoDB schemas and Mongoose plugins

For example, checks flow through:

- `src/server/routes/v1/checks.route.ts`
- `src/server/controllers/check.controller.ts`
- `src/server/services/check.service.ts`

Tests flow through:

- `src/server/routes/v1/tests.route.ts`
- `src/server/controllers/test.controller.ts`
- `src/server/services/test.service.ts`

## Frontend Layering

The main UI in `index2` is also layered in a straightforward way:

- `components/`: page and feature UI
- `shared/services/`: HTTP-facing service helpers
- `shared/hooks/`: reusable query and UI behavior
- `hooks/useParams.tsx`: URL query parameter state wrapper

Important frontend service pieces:

- `shared/lib/http.ts`: fetch wrapper with timeout, retry, credentials, and share token injection
- `shared/services/generic.service.ts`: generic paginated GET interface
- `shared/services/checks.service.ts`: check mutations
- `shared/services/tests.service.ts`: test mutations

## Data Exchange Between Backend and Frontend

### Generic GET Contract

Most list and detail reads use `GenericService.get(resource, filter, options, queryID)`.

The request shape is:

- URL path: `/v1/{resource}`
- query params:
  - pagination (`page`, `limit`)
  - sort (`sortBy`)
  - populate
  - serialized `filter`
  - `queryID` for debugging and tracing

The standard paginated response contains:

- `results`
- `page`
- `limit`
- `totalPages`
- `totalResults`
- `timestamp`

This response structure is important because the frontend grid and infinite scroll logic depend on `timestamp`, `page`, and `totalPages`.

### Authentication and Share Mode

The frontend HTTP wrapper automatically sends browser cookies and also injects the share token from the URL into the `x-share-token` header when present.

As a result, the same frontend query code can work in:

- regular signed-in mode
- API key mode
- anonymous share mode

The backend then decides whether a request is regular authenticated access or share-token access.

## Main Tests Grid Architecture

## Layout

The main page layout is driven by `IndexLayout.tsx`.

It renders:

- the app shell
- the header
- the navigation bar
- either the Tests page or the Baselines page

When the URL contains a share token, the layout switches to a dedicated shared check layout instead of the normal shell.

## Why the Main Grid Is Not a Library Grid

The main tests grid is not built with AG Grid or another full grid framework. It is a custom composition built from:

- Mantine `Table`
- Mantine `ScrollArea`
- custom infinite-scroll behavior
- custom filter and settings side panels
- expandable rows

This matters because many behaviors that would normally come from a grid library are implemented manually:

- visible columns
- row selection
- row expansion
- infinite paging
- new-data detection
- modal navigation

## Main Grid Components

The main tests grid is composed roughly like this:

- `Tests.tsx`
  - owns filters/settings drawers and page-level toolbar actions
  - builds the list query
- `TestsTable.tsx`
  - renders the table
  - manages selected rows
  - mounts the modal
- `Rows.tsx`
  - manages expanded row IDs
- `Row.tsx`
  - renders one test row
  - expands into a checks container
- `Checks.tsx`
  - fetches checks for a single test on demand

## How the Grid Loads Data

The tests page uses `useInfinityScroll`.

This hook intentionally separates the list into three concepts:

### 1. First-page anchor query

The first request loads page 1 with limit 1.

It serves two roles:

- obtains pagination metadata
- creates a stable timestamp boundary for the current list snapshot

This prevents the visible list from shifting while the user is scrolling.

### 2. Infinite pages query

The main infinite query fetches test pages using a filter that includes:

- base filter from URL
- active filter and quick filter from URL
- a "newest items must be older than or equal to the first-page boundary" clause

This gives the user a stable scrollable snapshot.

### 3. Newest-items query

A separate polling query checks whether items newer than the snapshot boundary now exist.

This query does not mutate the visible list directly. Instead, it is used to indicate that fresh data is available and a refresh action can be triggered.

### Why This Split Exists

Without this split, new tests arriving while the user is scrolling would reorder pages and create a poor user experience.

The current approach trades a little complexity for a more stable grid.

## How Grid Filtering and Sorting Work

The tests page treats the URL as the main source of truth for grid state.

The following values live in query params:

- `groupBy`
- `sortBy`
- `sortByNavbar`
- `app`
- `filter`
- `base_filter`
- `quick_filter`
- `checkId`
- `modalIsOpen`
- `share`

Because the grid state lives in the URL:

- links are reproducible
- refresh preserves the current view
- opening a modal is deep-linkable
- other components can react to the same state without an extra global store

## How Expanded Rows Work

Each test row is clickable and expands into a nested checks area.

The important design decision is that checks are not eagerly loaded together with all tests. Instead:

- the tests list is loaded first
- checks for a given test are loaded only when that test row is expanded

This keeps the top-level list lighter and avoids expensive nested payloads.

## How the Check Preview List Works

Inside an expanded row, `Checks.tsx` loads the list of checks for that test using:

- resource: `checks`
- filter: `{ test: item._id }`
- populate: `baselineId,actualSnapshotId,diffId`

This gives enough information to render:

- the check preview image
- the current status
- viewport label
- accept/remove actions

The checks panel also starts image preloading for the first batch of checks.

## Check Details Architecture

## Opening Check Details

Check details are controlled by URL state:

- `checkId`
- `modalIsOpen`

Clicking a check preview does not only open a local modal. It also updates the URL. That means:

- the check details modal is deep-linkable
- the same check can be opened directly
- the shared layout can reuse the same detail logic

## Modal Data Loading

`CheckModal.tsx` loads the selected check through React Query using resource `checks` with:

- `_id` filter
- population of `baselineId,actualSnapshotId,diffId,test,suite,app`

This produces the minimum detail bundle needed to render the full check details view.

## Polling While a Check Is Still Processing

The modal query uses adaptive polling.

It continues refetching while:

- the check exists
- `diffId` is still missing
- the status is not clearly final in the "new/passed" sense used by the UI

The polling interval uses backoff:

- starts at 2 seconds
- grows gradually
- caps at 10 seconds

This is not a true task queue. It is a client-side polling loop driven by React Query.

The shared check page uses a similar polling strategy, but its condition is simpler.

## Why Check Details Needs Extra Baseline Loading

One of the most important domain-model details in the app is this:

- `check.baselineId` points to a snapshot document
- some features, especially RCA and baseline management, need the actual baseline document

Because of this, `CheckDetails.tsx` performs an extra baseline lookup using:

- resource: `baselines`
- filter: `{ snapshootId: currentCheck.baselineId._id }`

This lookup is used to compute:

- actual baseline document ID
- baseline usage count
- baseline tolerance threshold

This is one of the places where the application model is subtle: "baseline used by a check" and "baseline document record" are related but not identical concepts.

## What Check Details Owns

`CheckDetails.tsx` acts as a local feature root and coordinates several sub-features:

- screenshot canvas
- header metadata
- toolbar actions
- related checks side panel
- RCA panel
- sibling-check navigation
- cross-test navigation
- image loading and cache reuse

It is effectively a mini-screen mounted inside a modal or share page.

## Canvas and Image Loading

The details screen uses `fabric` for the screenshot canvas view.

The view loads:

- expected image
- actual image
- diff image if available

Before loading them directly from the network, the details view checks the shared image preload cache. If an image is already preloaded, the details view reuses it.

This reduces the perceived delay when a user opens a check after hovering it or after expanding a checks list that already started preloading.

## Check Navigation Inside Details

Check details supports two navigation types:

### Navigation inside the current test

It loads sibling checks for the current test and sorts them by creation timestamp.

This allows previous/next navigation between checks in the same test.

### Navigation across tests from the current grid

The modal receives the flat list of currently visible tests from `TestsTable`.

When navigating to another test:

1. it finds the next or previous test in the already loaded grid snapshot
2. it requests the first check for that target test
3. it updates `checkId` in the URL

This means cross-test navigation follows the currently loaded grid order, not a separate global ordering in the backend.

## Frontend Queues and Polling

The application has multiple queue-like mechanisms on the frontend. They are different in nature and should not be confused.

## 1. React Query Polling Loops

These are query-level loops used for:

- waiting for a check to finish processing
- detecting whether newer tests appeared above the current grid snapshot
- refreshing long-running admin job status

These are not job queues. They are polling intervals attached to cached queries.

## 2. Image Preload Queue

This is a real in-memory frontend queue implemented in `imagePreload.service.ts`.

Its responsibilities are:

- keep a cache of already loaded images
- avoid duplicate in-flight requests
- cap concurrent image loads
- prioritize hover-driven requests over background preloads

### How It Works

The service stores:

- `preloadedImages`: completed cache
- `preloadQueue`: pending requests
- `loadingPromises`: deduplicated in-flight requests
- `activePreloads`: current active count

### Priorities

The queue supports:

- `high`
- `medium`
- `low`

Priority rules:

- `high` is inserted at the front
- `medium` is inserted before low-priority items
- `low` goes to the end

### Concurrency and Cache

Default behavior:

- maximum concurrent preloads: 6
- cache size: 100 images
- cache age: 5 minutes

### Where It Is Used

- batch preloading when checks are loaded in an expanded test row
- high-priority preloading when the user hovers a specific check preview
- cache reuse in the full check details view

This queue is one of the key performance mechanisms in the frontend.

## State Management Strategy

Syngrisi does not use Redux, Zustand, or another central client-state store for the main app.

Instead, state is intentionally split by responsibility.

## 1. URL State

Used for:

- grid filters
- sorting
- selected app
- selected check
- modal open state
- share mode

This is handled through `use-query-params`.

Reason:

- deep-linking
- refresh safety
- debuggability
- consistency across components

## 2. Server State

Used for:

- tests list
- checks list
- check details
- baselines
- settings
- related checks
- users and admin data elsewhere

This is stored in React Query.

Reason:

- caching
- refetch control
- polling support
- query invalidation after mutations

## 3. Local UI State

Used for:

- expanded rows
- selected rows
- drawer open/closed state
- panel resizing
- hover behavior
- temporary interaction state

This is normal React component state.

## 4. Persistent UI Preferences

Used for:

- visible grid columns
- checks view mode
- checks preview size
- theme

This is mostly stored in local storage through Mantine hooks.

## Why This Split Works

This split keeps each state type close to its real owner:

- navigation state belongs in the URL
- backend data belongs in query cache
- transient interactions belong in component state
- user preferences belong in local storage

It avoids a large global store without losing predictability.

## Mutation and Invalidation Strategy

Most write operations are handled through React Query mutations plus targeted invalidation.

Examples:

- accepting a check invalidates preview checks, modal check data, and baseline lookup data
- removing a check invalidates preview checks and modal check data
- accepting a test invalidates the checks preview list for that test

This means the application usually prefers refetching authoritative backend data after mutations instead of trying to manually reconcile all affected local objects.

That choice is simpler and safer for this codebase, especially because one mutation may affect multiple derived states:

- check status
- test status
- baseline linkage
- acceptance flags

## Important Backend Domain Details

## Check Acceptance Is Derived, Not Only Stored

The backend does not rely only on `markedAs === 'accepted'`.

It enriches checks with current acceptance flags by comparing:

- the check actual snapshot
- the check baseline snapshot
- the latest baseline snapshot for the same logical ident

That is why the frontend can show:

- currently accepted
- accepted earlier but not current anymore

This logic lives in `checkService.enrichChecksWithCurrentAcceptance`.

## Baseline Identity Is Composite

The effective logical identity of a baseline is based on fields such as:

- name
- viewport
- browserName
- os
- app
- branch

This is used when looking up the latest baseline for a check and when creating or reusing baselines during accept flows.

## Test State Is Aggregated from Checks

The test layer is not fully independent from checks. Actions on checks can cascade into changes in test-level meaning.

For example:

- accepting checks can affect the effective test state
- deleting checks changes the contents of a test

This is one reason the frontend often invalidates and refetches higher-level queries after check mutations.

## Practical Reading Order for New Contributors

If you want to understand the runtime behavior of the main application quickly, read in this order:

1. `src/ui-app/index2/main.tsx`
2. `src/ui-app/index2/IndexLayout.tsx`
3. `src/ui-app/index2/components/Tests/Tests.tsx`
4. `src/ui-app/shared/hooks/useInfinityScroll.tsx`
5. `src/ui-app/index2/components/Tests/Table/TestsTable.tsx`
6. `src/ui-app/index2/components/Tests/Table/Row.tsx`
7. `src/ui-app/index2/components/Tests/Table/Checks/Checks.tsx`
8. `src/ui-app/index2/components/Tests/Table/Checks/CheckModal.tsx`
9. `src/ui-app/index2/components/Tests/Table/Checks/CheckDetails/CheckDetails.tsx`
10. `src/ui-app/shared/services/imagePreload.service.ts`
11. `src/server/routes/v1/checks.route.ts`
12. `src/server/controllers/check.controller.ts`
13. `src/server/services/check.service.ts`
14. `src/server/models/plugins/paginate.plugin.ts`

## Summary

The main Syngrisi application is built around a pragmatic architecture:

- a direct backend service stack
- React Query for server state
- URL query params as the main navigation and filtering state
- a custom table implementation instead of a heavyweight grid framework
- lazy loading of nested checks
- a rich check-details screen that acts like a mini-application
- adaptive polling and an explicit image preload queue for responsiveness

The most important mental model is this:

- the tests page is a stable snapshot-oriented grid
- checks are loaded lazily per expanded test
- check details enrich and coordinate several related data sources
- acceptance and baseline state are domain-derived, not only UI-derived
