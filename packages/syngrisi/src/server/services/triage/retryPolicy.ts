// Given how many attempts have already failed and the max, decide whether to
// re-queue for another background attempt (true) or give up and stamp the
// failed verdict (false).
//
// Arithmetic: `priorAttempts` counts attempts that have already failed (0 before
// the very first try). The attempt that just failed is number `priorAttempts + 1`.
// Retry while that count is still below `maxAttempts`, so exactly `maxAttempts`
// total attempts happen before giving up. E.g. maxAttempts=3:
//   attempt 1 fails (priorAttempts=0) -> 0+1=1 < 3 -> retry
//   attempt 2 fails (priorAttempts=1) -> 1+1=2 < 3 -> retry
//   attempt 3 fails (priorAttempts=2) -> 2+1=3 < 3 is false -> give up (3 attempts made)
export function shouldRetryTriage(priorAttempts: number, maxAttempts: number): boolean {
    return priorAttempts + 1 < maxAttempts;
}

// The retry path re-queues a check for the background scheduler, which only drains
// checks when global triage is enabled AND the check's project has per-project triage on.
// If neither, a re-queued check would never be processed — so only retry when drainable.
export function canBackgroundDrain(globalEnabled: boolean, appTriageEnabled: boolean): boolean {
    return globalEnabled && appTriageEnabled;
}
