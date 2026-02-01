#!/bin/bash
set -e

POSTGRES_CONTAINER="syngrisi-logto-db"
LOGTO_CONTAINER="syngrisi-logto-app"
LOGTO_NETWORK="syngrisi-logto-net"

echo "Stopping containers..."
container delete -f "$POSTGRES_CONTAINER" 2>/dev/null || true
container delete -f "$LOGTO_CONTAINER" 2>/dev/null || true
container network delete "$LOGTO_NETWORK" 2>/dev/null || true
echo "Cleanup complete."
