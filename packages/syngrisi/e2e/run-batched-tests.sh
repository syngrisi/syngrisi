#!/bin/zsh

# Batch test runner - runs tests in batches of 5 files with 5 workers
# Timeout: 10 minutes per batch

BATCH_SIZE=5
WORKERS=5
TIMEOUT_MS=600000  # 10 minutes
RESULTS_FILE="batch-test-results.txt"

# Clear previous results
echo "Batch Test Results - $(date)" > "$RESULTS_FILE"
echo "========================================" >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"

# Get all feature files excluding SSO/SAML/DEMO
FILES=($(find features -name "*.feature" -type f | grep -v -E "sso|saml|DEMO" | sort))

TOTAL_FILES=${#FILES[@]}
TOTAL_BATCHES=$(( (TOTAL_FILES + BATCH_SIZE - 1) / BATCH_SIZE ))

echo "Total files: $TOTAL_FILES"
echo "Batch size: $BATCH_SIZE"
echo "Total batches: $TOTAL_BATCHES"
echo ""

TOTAL_PASSED=0
TOTAL_FAILED=0
TOTAL_FLAKY=0
TOTAL_TIME=0

for ((batch=0; batch<TOTAL_BATCHES; batch++)); do
    START_IDX=$((batch * BATCH_SIZE + 1))  # zsh arrays are 1-indexed
    END_IDX=$((START_IDX + BATCH_SIZE - 1))

    if [ $END_IDX -gt $TOTAL_FILES ]; then
        END_IDX=$TOTAL_FILES
    fi

    # Get batch files
    BATCH_FILES=("${FILES[@]:$START_IDX-1:$BATCH_SIZE}")

    BATCH_NUM=$((batch + 1))
    echo "========================================"
    echo "BATCH $BATCH_NUM / $TOTAL_BATCHES"
    echo "Files: ${BATCH_FILES[*]}"
    echo "========================================"

    # Run the batch
    BATCH_START=$(date +%s)

    # Run playwright test with timeout
    OUTPUT=$(gtimeout 600 npx playwright test ${BATCH_FILES[@]} \
        --grep-invert "@saml|@sso-external|@sso-logto|@demo|@flaky" \
        --workers=$WORKERS \
        --timeout=$TIMEOUT_MS \
        2>&1) || true

    EXIT_CODE=$?
    BATCH_END=$(date +%s)
    BATCH_DURATION=$((BATCH_END - BATCH_START))

    # Parse results using grep -o with extended regex
    PASSED=$(echo "$OUTPUT" | grep -oE '[0-9]+ passed' | grep -oE '[0-9]+' | tail -1)
    FAILED=$(echo "$OUTPUT" | grep -oE '[0-9]+ failed' | grep -oE '[0-9]+' | tail -1)
    FLAKY=$(echo "$OUTPUT" | grep -oE '[0-9]+ flaky' | grep -oE '[0-9]+' | tail -1)

    [ -z "$PASSED" ] && PASSED=0
    [ -z "$FAILED" ] && FAILED=0
    [ -z "$FLAKY" ] && FLAKY=0

    TOTAL_PASSED=$((TOTAL_PASSED + PASSED))
    TOTAL_FAILED=$((TOTAL_FAILED + FAILED))
    TOTAL_FLAKY=$((TOTAL_FLAKY + FLAKY))
    TOTAL_TIME=$((TOTAL_TIME + BATCH_DURATION))

    # Log results
    echo "" | tee -a "$RESULTS_FILE"
    echo "BATCH $BATCH_NUM Results:" | tee -a "$RESULTS_FILE"
    echo "  Files: ${BATCH_FILES[*]}" >> "$RESULTS_FILE"
    echo "  Duration: ${BATCH_DURATION}s" | tee -a "$RESULTS_FILE"
    echo "  Passed: $PASSED, Failed: $FAILED, Flaky: $FLAKY" | tee -a "$RESULTS_FILE"
    echo "  Exit code: $EXIT_CODE" | tee -a "$RESULTS_FILE"

    if [ $EXIT_CODE -eq 124 ]; then
        echo "  WARNING: Batch TIMED OUT after 10 minutes!" | tee -a "$RESULTS_FILE"
    fi

    # Show failed tests if any
    if [ "$FAILED" != "0" ] && [ "$FAILED" != "" ]; then
        echo "  Failed tests:" | tee -a "$RESULTS_FILE"
        echo "$OUTPUT" | grep -E "^\s+.*›.*failed" | head -10 | tee -a "$RESULTS_FILE"
    fi

    echo ""
done

echo "" | tee -a "$RESULTS_FILE"
echo "========================================" | tee -a "$RESULTS_FILE"
echo "FINAL SUMMARY" | tee -a "$RESULTS_FILE"
echo "========================================" | tee -a "$RESULTS_FILE"
echo "Total time: ${TOTAL_TIME}s ($(( TOTAL_TIME / 60 ))m $(( TOTAL_TIME % 60 ))s)" | tee -a "$RESULTS_FILE"
echo "Total passed: $TOTAL_PASSED" | tee -a "$RESULTS_FILE"
echo "Total failed: $TOTAL_FAILED" | tee -a "$RESULTS_FILE"
echo "Total flaky: $TOTAL_FLAKY" | tee -a "$RESULTS_FILE"
echo "" | tee -a "$RESULTS_FILE"
