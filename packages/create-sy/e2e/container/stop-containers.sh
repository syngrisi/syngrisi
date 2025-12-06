#!/bin/bash
set -e

# Colors
GREEN='\033[0;32m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }

if ! command -v container &> /dev/null; then
    log_info "Apple container CLI not found, skipping cleanup"
    exit 0
fi

log_info "Stopping any running test containers..."

# Stop containers matching our naming pattern
for container_id in $(container list -q 2>/dev/null | grep -E "create-sy-test-" || true); do
    log_info "Stopping container: $container_id"
    container stop "$container_id" 2>/dev/null || true
    container delete -f "$container_id" 2>/dev/null || true
done

log_info "Cleanup complete"
