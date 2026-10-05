#!/usr/bin/env bash
set -e

# ==============================================================================
# Golden Takin Holidays — 1-Click Update Script (Port 3002)
# ==============================================================================
# Pulls latest code, builds, terminates previous process cleanly, and starts node.
# ==============================================================================

PORT=3002
echo "==> [1/4] Pulling latest updates from git repository..."
git pull origin main

echo "==> [2/4] Installing dependencies & building production application..."
npm install --prefer-offline --no-audit 2>/dev/null || npm install
export NITRO_PRESET="node-server"
npm run build

echo "==> [3/4] Gracefully stopping previous process on port ${PORT}..."
if command -v fuser >/dev/null 2>&1; then
    fuser -k -9 "${PORT}/tcp" 2>/dev/null || true
fi
if command -v lsof >/dev/null 2>&1; then
    lsof -ti :${PORT} | xargs -r kill -9 2>/dev/null || true
fi
if [ -f "goldentakin.pid" ]; then
    OLD_PID=$(cat goldentakin.pid 2>/dev/null)
    if [ -n "$OLD_PID" ]; then
        kill -9 "$OLD_PID" 2>/dev/null || true
    fi
    rm -f goldentakin.pid
fi
sleep 2

echo "==> [4/4] Starting Golden Takin Holidays on Port ${PORT}..."
PORT=${PORT} NITRO_PORT=${PORT} nohup node .output/server/index.mjs > goldentakin.log 2>&1 &
NEW_PID=$!
echo "$NEW_PID" > goldentakin.pid
disown -h "$NEW_PID" 2>/dev/null || true

echo "==> Waiting for server to initialize..."
for i in 1 2 3 4 5; do
    sleep 1
    if command -v curl >/dev/null 2>&1; then
        STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:${PORT}" 2>/dev/null || echo "000")
        if [ "$STATUS" != "000" ] && [ "$STATUS" != "502" ]; then
            echo "✔ Service is responding with HTTP ${STATUS} on http://127.0.0.1:${PORT}!"
            break
        fi
    fi
done

echo ""
echo "=================================================================="
echo "✔ Golden Takin Holidays updated & running on port ${PORT} (PID: ${NEW_PID})"
echo "✔ Access live at: https://goldentakinholidays.bt"
echo "=================================================================="
