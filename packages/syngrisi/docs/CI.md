# Running Syngrisi in CI

There is no dedicated Syngrisi CI server component — everything below hangs off
two existing pieces of the API:

1. **Server-side commit status.** When you pass a git `commit` SHA into
   `startTestSession`, and the Syngrisi server has `SYNGRISI_GITHUB_TOKEN` /
   `SYNGRISI_GITHUB_REPO` configured, the server automatically posts a
   `syngrisi/visual` [commit status](https://docs.github.com/en/rest/commits/statuses)
   for that SHA (pending while the run is open, success/failure once it's
   resolved). This is what shows up as a check on your PR.
2. **CI-side poll-and-gate.** A CI job that started the run polls
   `GET /v1/tests?filter={"run":"<runId>"}` until every test in the run has
   left the `Running` state, then fails the job if anything failed. The
   [`syngrisi-status`](../../../.github/actions/syngrisi-status/action.yml)
   composite action does this for you.

## 1. Attach the commit SHA when starting a session

```ts
const session = await driver.startTestSession({
  params: {
    app: 'My App',
    test: 'Homepage',
    run: 'ci-run',
    branch: process.env.GITHUB_REF_NAME,
    // The PR head SHA for pull_request events, otherwise the pushed SHA.
    commit: process.env.GITHUB_SHA,
  },
});
```

`commit` must be a 7-40 character hex string (short or full SHA). The SDK
forwards it as-is; the server does nothing with it unless the commit-status
env vars below are set.

### Required server-side env vars

| Variable | Description |
|---|---|
| `SYNGRISI_GITHUB_TOKEN` | Personal/fine-grained GitHub token with `repo:status` scope. Never logged or persisted. |
| `SYNGRISI_GITHUB_REPO` | The `<owner>/<name>` repository to post commit statuses to. |
| `SYNGRISI_PUBLIC_URL` | Public base URL of this Syngrisi instance, used to build the `target_url` deep link on the commit status (points at the run's grid). |
| `SYNGRISI_GITHUB_API_URL` | Optional. Override for the GitHub API base (GitHub Enterprise, or a stub in tests). Default: `https://api.github.com`. |

This feature is dormant (zero requests) unless `SYNGRISI_GITHUB_TOKEN`,
`SYNGRISI_GITHUB_REPO`, and the session's `commit` param are all present. See
[`environment_variables.md`](environment_variables.md) for the full list.

## 2. Gate the job on the run's outcome

Copy [`.github/workflows/syngrisi-example.yml`](../../../.github/workflows/syngrisi-example.yml)
and [`.github/actions/syngrisi-status/`](../../../.github/actions/syngrisi-status/)
into your own repository, then reference the action from your workflow after
your test step:

```yaml
- name: Run visual tests
  id: visual-tests
  run: yarn test:visual # your test command; exposes `run-id` as a step output

- name: Gate on Syngrisi result
  uses: ./.github/actions/syngrisi-status
  with:
    syngrisi-url: ${{ secrets.SYNGRISI_URL }}
    api-key: ${{ secrets.SYNGRISI_API_KEY }}
    run-id: ${{ steps.visual-tests.outputs.run-id }}
```

Your test step needs to expose the `run` value used in `startTestSession` as a
step output (e.g. via `core.setOutput('run-id', session.run)` or
`echo "run-id=$RUN" >> "$GITHUB_OUTPUT"`), so the gating step knows which run
to poll for.

### Action inputs

| Input | Required | Default | Description |
|---|---|---|---|
| `syngrisi-url` | yes | — | Base URL of the Syngrisi server. |
| `api-key` | yes | — | Syngrisi API key, sent as the raw `apikey` header. |
| `run-id` | yes | — | The run id (the `run` value passed to `startTestSession`) to poll for. |
| `fail-on-new` | no | `'false'` | Fail the job if any test in the run is still `New` (no accepted baseline). |
| `timeout-seconds` | no | `'300'` | Max time to wait for all tests in the run to leave `Running`. |
| `poll-interval-seconds` | no | `'5'` | Delay between polls. |

### Action outputs

| Output | Description |
|---|---|
| `state` | `success`, `failure`, or `pending` (timed out while tests were still `Running`). |
| `passed` | Count of tests with status `Passed`. |
| `failed` | Count of tests with status `Failed`. |
| `new` | Count of tests with status `New`. |
| `total` | Total number of tests found for the run. |

The action requires only `curl` and `jq`, both preinstalled on GitHub-hosted
runners.

## The poll API

```
GET $SYNGRISI_URL/v1/tests?filter={"run":"<runId>"}
Header: apikey: <raw api key>
```

`/v1/tests` accepts API-key auth (no session cookie required), which is what
makes it usable from CI. The response is a paginated list; the fields that
matter here are each item's `status`.

`Test.status` vocabulary:

| Status | Meaning |
|---|---|
| `Running` | The test session is still open — keep polling. |
| `Passed` | The check(s) matched the accepted baseline. |
| `Failed` | At least one check differed from the accepted baseline. |
| `New` | No baseline exists yet for this check (nothing to compare against). |

A run is "done" once no test in the filtered set has `status: "Running"`.
