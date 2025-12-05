#!/bin/bash
# Полный цикл тестирования staging
# Запускает все тесты в правильном порядке с reset между прогонами
# Предусловие: staging сервер уже запущен вручную

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  STAGING TEST SUITE - FULL CYCLE                               ║"
echo "║                                                                ║"
echo "║  Порядок запуска:                                              ║"
echo "║  1. Read-only тесты (только чтение)                            ║"
echo "║  2. Read-write тесты (модификация с cleanup)                   ║"
echo "║  3. Polluting тесты (загрязняют базу)                          ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

START_TIME=$(date +%s)

echo "════════════════════════════════════════════════════════════════"
echo "  PHASE 1: Read-only tests"
echo "════════════════════════════════════════════════════════════════"
"${SCRIPT_DIR}/run-readonly-tests.sh"

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "  PHASE 2: Read-write tests"
echo "════════════════════════════════════════════════════════════════"
"${SCRIPT_DIR}/run-readwrite-tests.sh"

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "  PHASE 3: Polluting tests (last)"
echo "════════════════════════════════════════════════════════════════"
"${SCRIPT_DIR}/run-polluting-tests.sh"

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  🎉 ALL PHASES COMPLETE                                        ║"
echo "║                                                                ║"
echo "║  Total time: ${DURATION} seconds                                        ║"
echo "╚════════════════════════════════════════════════════════════════╝"
