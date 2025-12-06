#!/bin/bash
# Запуск read-only тестов staging
# Предусловие: staging сервер уже запущен вручную

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  STAGING READ-ONLY TESTS                                       ║"
echo "║  Тесты только чтения - не модифицируют данные                  ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

echo "=== Resetting staging database ==="
"${SCRIPT_DIR}/reset-staging.sh"

echo ""
echo "=== Running read-only tests ==="
cd "${REPO_ROOT}/e2e-staging"
export SKIP_DEMO_TESTS=true
npx bddgen
npx playwright test --grep "@readonly"

echo ""
echo "✅ Read-only tests completed"
