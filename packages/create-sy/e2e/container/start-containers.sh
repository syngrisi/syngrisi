#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

check_container_cli() {
    if ! command -v container &> /dev/null; then
        log_error "Apple container CLI not found"
        echo "See: https://github.com/apple/container"
        exit 1
    fi
    log_info "Apple container CLI found"
}

start_container_system() {
    log_info "Starting container system service..."
    # This fixes XPC connection errors
    # See: https://github.com/apple/container/issues/699
    container system start 2>/dev/null || true
    log_info "Container system service started"
}

build_images() {
    log_info "Building container images..."

    log_info "Building Node 18 image..."
    container build -t create-sy-node18 -f "$SCRIPT_DIR/Dockerfile.node18" "$SCRIPT_DIR"

    log_info "Building Node 20 image..."
    container build -t create-sy-node20 -f "$SCRIPT_DIR/Dockerfile.node20" "$SCRIPT_DIR"

    log_info "Building Node 22 image..."
    container build -t create-sy-node22 -f "$SCRIPT_DIR/Dockerfile.node22" "$SCRIPT_DIR"

    log_info "All images built successfully"
}

main() {
    check_container_cli
    start_container_system

    if [ "$1" = "--build" ] || [ "$1" = "-b" ]; then
        build_images
    else
        log_info "Skipping image build. Use --build to build images."
    fi

    log_info "============================================"
    log_info "E2E Infrastructure Ready!"
    log_info "Available images:"
    log_info "  - create-sy-node18"
    log_info "  - create-sy-node20"
    log_info "  - create-sy-node22"
    log_info "============================================"
}

main "$@"
