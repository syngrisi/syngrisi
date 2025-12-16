#!/bin/bash
# Запуск polluting тестов staging (загрязняют базу)
# ⚠️ ЗАПУСКАТЬ ПОСЛЕДНИМИ! Эти тесты оставляют данные в базе.
# Предусловие: staging сервер уже запущен вручную

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  STAGING POLLUTING TESTS                                       ║"
echo "║  ⚠️  Тесты загрязняющие базу - запускать последними!           ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

echo "=== Resetting staging database ==="
"${SCRIPT_DIR}/reset-staging.sh"

echo ""
echo "=== Running polluting tests ==="
cd "${REPO_ROOT}/e2e-staging"
export SKIP_DEMO_TESTS=true
npx bddgen
npx playwright test --grep "@polluting"

echo ""
echo "✅ Polluting tests completed"
echo "⚠️  База данных содержит тестовые данные!"
