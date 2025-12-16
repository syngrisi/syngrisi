#!/bin/bash

# Staging TUI Launcher
# Wrapper script to run Ink-based React TUI

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TUI_SCRIPT="${SCRIPT_DIR}/staging-tui.tsx"

# Check if tsx is available
if ! command -v npx &> /dev/null; then
    echo "Error: npx not found. Please install Node.js first."
    exit 1
fi

# Run the TUI using tsx
exec npx tsx "${TUI_SCRIPT}"
