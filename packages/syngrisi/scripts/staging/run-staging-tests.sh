#!/bin/bash
#
# Staging Test Runner
# Runs Playwright BDD tests against the staging environment (port 5252)
#
# Usage:
#   ./run-staging-tests.sh [suite] [options]
#
# Suites:
#   smoke       - Quick validation tests (login, basic operations)
#   extended    - Comprehensive tests (bulk operations, data integrity)
#   maintenance - Admin tasks tests (cleanup, consistency checks)
#   all         - Run all suites (default)
#
# Options:
#   --headed    - Run in headed mode (visible browser)
#   --debug     - Enable debug mode
#
set -e

# Fix nvm/fnm conflict
unset npm_config_prefix 2>/dev/null || true

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SYNGRISI_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
E2E_DIR="$SYNGRISI_ROOT/e2e"

# Default suite
SUITE="${1:-all}"
shift 2>/dev/null || true

# Parse additional options
HEADED=""
DEBUG=""
while [[ $# -gt 0 ]]; do
    case $1 in
        --headed)
            HEADED="true"
            shift
            ;;
        --debug)
            DEBUG="true"
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Load staging config
if [[ -f "$SYNGRISI_ROOT/.env.staging" ]]; then
    source "$SYNGRISI_ROOT/.env.staging"
fi

STAGING_PORT="${STAGING_PORT:-5252}"
STAGING_URL="http://localhost:$STAGING_PORT"

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║           Staging Test Runner                                  ║"
echo "╠════════════════════════════════════════════════════════════════╣"
echo "║  Suite:    $SUITE"
echo "║  URL:      $STAGING_URL"
echo "║  Headed:   ${HEADED:-false}"
echo "║  Debug:    ${DEBUG:-false}"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Check if staging server is running
echo "Checking staging server..."
if ! curl -s "$STAGING_URL/v1/health" > /dev/null 2>&1; then
    echo ""
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║  ERROR: Staging server is not running!                         ║"
    echo "║                                                                ║"
    echo "║  Start staging first:                                          ║"
    echo "║    npm run staging:start                                       ║"
    echo "║                                                                ║"
    echo "║  Or manually:                                                  ║"
    echo "║    bash scripts/staging/start-staging.sh                       ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    exit 1
fi
echo "✓ Staging server is running"
echo ""

# Change to e2e directory
cd "$E2E_DIR"

# Build environment variables
export E2E_BASE_URL="$STAGING_URL"
export E2E_SKIP_BUILD="true"
[[ -n "$HEADED" ]] && export PLAYWRIGHT_HEADED="true"
[[ -n "$DEBUG" ]] && export E2E_DEBUG="true"

# Generate step definitions
echo "Generating BDD step definitions..."
unset npm_config_prefix 2>/dev/null || true
npx bddgen --config playwright.staging.config.ts
echo ""

# Run tests based on suite
echo "Running $SUITE tests..."
echo ""

case $SUITE in
    smoke)
        npx playwright test --config playwright.staging.config.ts --project staging-smoke
        ;;
    extended)
        npx playwright test --config playwright.staging.config.ts --project staging-extended
        ;;
    maintenance)
        npx playwright test --config playwright.staging.config.ts --project staging-maintenance
        ;;
    all)
        npx playwright test --config playwright.staging.config.ts
        ;;
    *)
        echo "Unknown suite: $SUITE"
        echo "Available suites: smoke, extended, maintenance, all"
        exit 1
        ;;
esac

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  Tests completed!                                              ║"
echo "║  Report: $E2E_DIR/reports/staging-html/index.html"
echo "╚════════════════════════════════════════════════════════════════╝"
