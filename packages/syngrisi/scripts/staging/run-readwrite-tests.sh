#!/bin/bash
# Запуск read-write тестов staging (с cleanup)
# Предусловие: staging сервер уже запущен вручную

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  STAGING READ-WRITE TESTS                                      ║"
echo "║  Тесты модификации данных с cleanup после каждого теста        ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

echo "=== Resetting staging database ==="
"${SCRIPT_DIR}/reset-staging.sh"

echo ""
echo "=== Running read-write tests ==="
cd "${REPO_ROOT}/e2e-staging"
export SKIP_DEMO_TESTS=true
npx bddgen
npx playwright test --grep "@readwrite"

echo ""
echo "✅ Read-write tests completed"
