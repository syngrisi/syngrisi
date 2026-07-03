#!/usr/bin/env bash
#
# Start an isolated, fully-featured Syngrisi demo instance and seed it with a
# feature tour (see tests/demo-seed.spec.ts). Reuses REAL test-app fixtures.
#
# Usage:
#   seed-data/run-demo.sh                 # build if needed, start, seed
#   PORT=3010 seed-data/run-demo.sh       # custom port
#   SKIP_BUILD=1 seed-data/run-demo.sh    # skip the server/UI build
#   seed-data/run-demo.sh stop            # stop the running demo server
#
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SYN="$ROOT/packages/syngrisi"
PORT="${PORT:-3000}"
DB="${DB:-SyngrisiDemo}"
IMAGES="${IMAGES:-$SYN/.demo-images}"
PIDFILE="$ROOT/seed-data/.demo-server.pid"
LOG="$ROOT/seed-data/.demo-server.log"
URL="http://localhost:$PORT"

stop_server() {
    if [ -f "$PIDFILE" ] && kill -0 "$(cat "$PIDFILE")" 2>/dev/null; then
        kill "$(cat "$PIDFILE")" && echo "Stopped demo server (pid $(cat "$PIDFILE"))."
    else
        # fall back to whatever listens on the port
        pid=$(lsof -ti:"$PORT" 2>/dev/null || true)
        [ -n "$pid" ] && kill "$pid" && echo "Stopped process on port $PORT (pid $pid)." || echo "No demo server running."
    fi
    rm -f "$PIDFILE"
}

if [ "${1:-}" = "stop" ]; then stop_server; exit 0; fi

# 1. Build server + UI unless skipped
if [ "${SKIP_BUILD:-}" != "1" ]; then
    echo "==> Building server + UI..."
    (cd "$SYN" && yarn build:server && yarn build:ui)
fi

# 2. (Re)start the isolated server with every feature flag on.
#    Reset the DB *before* start so the server re-seeds default settings
#    (ai_triage_provider etc.) via createInitialSettings() on boot.
stop_server 2>/dev/null || true
echo "==> Resetting demo database ($DB) and images..."
mongosh "$DB" --quiet --eval "db.dropDatabase()" >/dev/null 2>&1 || true
rm -rf "$IMAGES" && mkdir -p "$IMAGES"
echo "==> Starting demo server on $URL (db=$DB)..."
cd "$SYN"
SYNGRISI_DB_URI="mongodb://127.0.0.1:27017/$DB" \
SYNGRISI_IMAGES_PATH="$IMAGES/" \
SYNGRISI_AUTH=false \
SYNGRISI_TEST_MODE=true \
SYNGRISI_APP_PORT="$PORT" \
SYNGRISI_RCA=true \
SYNGRISI_DISABLE_DOM_DATA=false \
SYNGRISI_AI_TRIAGE_ENABLED=true \
SYNGRISI_AI_TRIAGE_POLL_INTERVAL_MS=2000 \
nohup node ./dist/server/server.js > "$LOG" 2>&1 &
echo $! > "$PIDFILE"

# 3. Wait until it answers
echo -n "==> Waiting for server"
for _ in $(seq 1 60); do
    code=$(curl -s -o /dev/null -w "%{http_code}" "$URL/" 2>/dev/null || true)
    if [ "$code" = "200" ] || [ "$code" = "302" ]; then echo " ready."; break; fi
    echo -n "."; sleep 1
done

# 4. Make sure the seeder uses the CURRENT local playwright-sdk (with DOM/RCA
#    support), not the older npm copy that a `file:` install may have left behind.
cd "$ROOT/seed-data"
[ -d node_modules ] || yarn install
if [ "${SKIP_BUILD:-}" != "1" ]; then (cd "$ROOT/packages/playwright-sdk" && yarn build); fi
LINK="$ROOT/seed-data/node_modules/@syngrisi/playwright-sdk"
if [ ! -L "$LINK" ]; then
    echo "==> Linking local @syngrisi/playwright-sdk into seed-data..."
    rm -rf "$LINK"; mkdir -p "$(dirname "$LINK")"
    ln -s ../../../packages/playwright-sdk "$LINK"
fi

# 5. Seed the feature tour (SYNGRISI_DISABLE_DOM_DATA=false so RCA DOM is sent)
echo "==> Seeding demo data..."
SYNGRISI_URL="$URL" SYNGRISI_API_KEY=123 SYNGRISI_DISABLE_DOM_DATA=false yarn seed:demo

echo ""
echo "============================================================"
echo " Demo instance ready:  $URL"
echo " Server pid:           $(cat "$PIDFILE")   (log: $LOG)"
echo " Stop it with:         seed-data/run-demo.sh stop"
echo "============================================================"
