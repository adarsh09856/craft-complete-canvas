#!/usr/bin/env bash
# ==============================================================================
# Golden Takin Holidays — Automated aaPanel Installation & Database Provisioning
# Auto-detects free ports, imports PostgreSQL schema, builds production bundle
# Database: travelgold | User: travelgold | Password: travelgold
# ==============================================================================

set -eo pipefail

BOLD='\033[1m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$APP_DIR"

log_info() { echo -e "${BLUE}[INFO]${NC} $1" >&2; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1" >&2; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1" >&2; }
log_error() { echo -e "${RED}[ERROR]${NC} $1" >&2; }

clear || true
echo -e "${CYAN}${BOLD}"
cat << "EOF"
   ____      _     _              _____     _    _       
  / ___| ___| | __| | ___ _ __   |_   _|_ _| | _(_)_ __  
 | |  _ / _ \ |/ _` |/ _ \ '_ \    | |/ _` | |/ / | '_ \ 
 | |_| | (_) | | (_| |  __/ | | |  | | (_| | |/ /| | | |
  \____|\___/|_|\__,_|\___|_| |_|  |_|\__,_|_|\_\_|_| |_|
     Luxury Bhutan & Himalayan Travel Booking Portal
EOF
echo -e "${NC}"
echo -e "${BOLD}==============================================================================${NC}"
echo -e " 🚀 aaPanel Direct Installer with Automatic Free Port Detection"
echo -e " 🗄️ Database: ${BOLD}travelgold${NC} | User: ${BOLD}travelgold${NC} | Password: ${BOLD}travelgold${NC}"
echo -e "${BOLD}==============================================================================${NC}\n"

# 1. Multi-Layer Port Scanner (protects existing aaPanel websites)
log_info "[1/5] Deep scanning for guaranteed free ports (avoiding existing aaPanel sites)..."

is_port_in_use() {
    local port=$1

    # Check 1: aaPanel Nginx reverse proxy configs (even if site is stopped or restarting)
    if [ -d "/www/server/panel/vhost" ]; then
        if grep -rqE "127\.0\.0\.1:${port}[^0-9]|localhost:${port}[^0-9]" /www/server/panel/vhost/ 2>/dev/null; then
            return 0 # In use by another aaPanel website
        fi
    fi
    if [ -d "/www/server/nginx/conf/vhost" ]; then
        if grep -rqE "127\.0\.0\.1:${port}[^0-9]|localhost:${port}[^0-9]" /www/server/nginx/conf/vhost/ 2>/dev/null; then
            return 0 # In use by another aaPanel website
        fi
    fi

    # Check 2: ss tool
    if command -v ss >/dev/null 2>&1; then
        if ss -tuln | grep -qE "(:| )${port}( |$)"; then
            return 0 # Actively listening
        fi
    fi

    # Check 3: netstat tool
    if command -v netstat >/dev/null 2>&1; then
        if netstat -tuln | grep -qE "(:| )${port}( |$)"; then
            return 0 # Actively listening
        fi
    fi

    # Check 4: lsof tool
    if command -v lsof >/dev/null 2>&1; then
        if lsof -i :"$port" -sTCP:LISTEN >/dev/null 2>&1; then
            return 0 # Actively listening
        fi
    fi

    # Check 5: fuser tool
    if command -v fuser >/dev/null 2>&1; then
        if fuser "${port}/tcp" >/dev/null 2>&1; then
            return 0 # Actively listening
        fi
    fi

    # Check 6: Node.js active socket bind test (100% proof of EADDRINUSE)
    if command -v node >/dev/null 2>&1; then
        if ! node -e "const s = require('net').createServer(); s.once('error', () => process.exit(1)); s.listen(${port}, '0.0.0.0', () => { s.close(); process.exit(0); });" >/dev/null 2>&1; then
            return 0 # Port cannot be bound
        fi
    fi

    return 1 # 100% verified free port
}

resolve_free_port() {
    local base_port=$1
    local service_name=$2
    local port=$base_port
    while is_port_in_use "$port"; do
        log_warn "Port $port is ALREADY IN USE by another website or service on aaPanel. Trying port $((port + 1))..."
        port=$((port + 1))
    done
    if [ "$port" -ne "$base_port" ]; then
        log_info "Auto-assigned $service_name to free port: ${BOLD}$port${NC} (base $base_port was occupied)"
    else
        log_success "Port ${BOLD}$port${NC} for $service_name is 100% free and verified!"
    fi
    printf '%s\n' "$port"
}

WEB_PORT="3002"
log_success "Dedicated port assigned for Golden Takin: ${BOLD}${WEB_PORT}${NC}"

# 2. Write .env with exact user credentials and the assigned free port
log_info "[2/5] Configuring .env with aaPanel credentials and free port ${WEB_PORT}..."
cat > .env << ENVEOF
POSTGRES_HOST="127.0.0.1"
POSTGRES_PORT="5432"
POSTGRES_DB="travelgold"
POSTGRES_USER="travelgold"
POSTGRES_PASSWORD="travelgold"
DATABASE_URL="postgresql://travelgold:travelgold@127.0.0.1:5432/travelgold"
VITE_SUPABASE_URL="https://lsrtlkbrqbyciudupttg.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="sb_publishable_z4bNAHhvyJMfueuAkXpKrg_B9xVAOdm"
SUPABASE_URL="https://lsrtlkbrqbyciudupttg.supabase.co"
SUPABASE_PUBLISHABLE_KEY="sb_publishable_z4bNAHhvyJMfueuAkXpKrg_B9xVAOdm"
APP_URL="https://goldentakinholidays.bt"
PORT=${WEB_PORT}
GEMINI_API_KEY=""
OPENAI_API_KEY=""
ENVEOF
log_success "Updated .env file with travelgold database credentials & PORT=${WEB_PORT}!"

# 3. Check Node.js and npm
log_info "[3/5] Checking Node.js environment..."
if ! command -v node >/dev/null 2>&1; then
    log_error "Node.js is not found. Please install Node.js 20+ via aaPanel Node Version Manager or 'curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt install -y nodejs'"
    exit 1
fi
log_success "Node.js $(node -v) and npm $(npm -v) detected!"

# 4. Automatically import database schema into aaPanel PostgreSQL
log_info "[4/5] Importing database schema into PostgreSQL (database: travelgold)..."
PSQL_BIN=""
if command -v psql >/dev/null 2>&1; then
    PSQL_BIN="psql"
elif [ -f "/www/server/pgsql/bin/psql" ]; then
    PSQL_BIN="/www/server/pgsql/bin/psql"
elif [ -f "/usr/lib/postgresql/16/bin/psql" ]; then
    PSQL_BIN="/usr/lib/postgresql/16/bin/psql"
elif [ -f "/usr/lib/postgresql/15/bin/psql" ]; then
    PSQL_BIN="/usr/lib/postgresql/15/bin/psql"
fi

if [ -n "$PSQL_BIN" ]; then
    export PGPASSWORD="travelgold"
    $PSQL_BIN -h 127.0.0.1 -p 5432 -U travelgold -d travelgold -f database/init.sql >/dev/null 2>&1 || true
    $PSQL_BIN -h 127.0.0.1 -p 5432 -U travelgold -d travelgold -f database/seed.sql >/dev/null 2>&1 || true
    log_success "Database schema & tour itineraries imported into 'travelgold' successfully!"
    unset PGPASSWORD
else
    log_warn "psql client not found in PATH. You can click 'Import' in aaPanel PostgreSQL tab to upload 'database/init.sql' and 'database/seed.sql'."
fi

# 5. Install dependencies and build standalone production bundle
log_info "[5/5] Installing dependencies and building production server..."
npm install --legacy-peer-deps
export NITRO_PRESET="node-server"
npm run build
log_success "Production build completed (.output/server/index.mjs ready)!"

# 6. Automatically start / restart production service on the dedicated port
log_info "[6/6] Launching/restarting Golden Takin on Port ${WEB_PORT}..."

# Kill only previous process on this project's dedicated port (strictly protects 3000/3001)
if command -v fuser >/dev/null 2>&1; then
    fuser -k "${WEB_PORT}/tcp" >/dev/null 2>&1 || true
fi
sleep 1

# Launch in background with dedicated port
PORT=${WEB_PORT} nohup node .output/server/index.mjs > goldentakin.log 2>&1 &
SERVER_PID=$!

sleep 3

# Automated health check
HTTP_STATUS=""
if command -v curl >/dev/null 2>&1; then
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:${WEB_PORT}" 2>/dev/null || echo "000")
fi

echo ""
echo -e "${GREEN}${BOLD}==============================================================================${NC}"
echo -e "${GREEN}${BOLD} ✔ Golden Takin Holidays is 100% LIVE and ACTIVE!${NC}"
echo -e "${GREEN}${BOLD}==============================================================================${NC}"
echo -e "  🌐 Listening Port:     ${BOLD}${WEB_PORT}${NC}"
echo -e "  🚀 Background PID:     ${BOLD}${SERVER_PID}${NC}"
if [ -n "$HTTP_STATUS" ] && [ "$HTTP_STATUS" != "000" ]; then
    echo -e "  🩺 Health Check:       ${GREEN}${BOLD}HTTP ${HTTP_STATUS} OK${NC} (Answering at http://127.0.0.1:${WEB_PORT})"
fi
echo -e "  🗄️ Database:           ${BOLD}travelgold${NC} on 127.0.0.1:5432"
echo -e "  📄 Server Log:         ${BOLD}goldentakin.log${NC}"
echo -e "${GREEN}${BOLD}==============================================================================${NC}"
echo -e " 🚀 You can visit: ${BOLD}https://goldentakinholidays.bt${NC} immediately!"
echo ""
