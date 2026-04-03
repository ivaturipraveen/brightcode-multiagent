#!/usr/bin/env bash
# ============================================================
#  BrightCode MOTD Banner — EC2-style startup art
# ============================================================

# ANSI color codes
RESET='\033[0m'
BOLD='\033[1m'
DIM='\033[2m'

# Palette
CYAN='\033[0;36m'
BCYAN='\033[1;36m'
BLUE='\033[0;34m'
BBLUE='\033[1;34m'
GREEN='\033[0;32m'
BGREEN='\033[1;32m'
YELLOW='\033[0;33m'
BYELLOW='\033[1;33m'
MAGENTA='\033[0;35m'
BMAGENTA='\033[1;35m'
WHITE='\033[1;37m'
RED='\033[0;31m'
BRED='\033[1;31m'

# ── Top divider ──────────────────────────────────────────────
echo ""
printf "${BCYAN}╔══════════════════════════════════════════════════════════════════════╗${RESET}\n"

# ── ASCII Art (figlet slant) ─────────────────────────────────
printf "${BCYAN}║${RESET}                                                                      ${BCYAN}║${RESET}\n"

figlet -f slant "  BrightCode" 2>/dev/null | while IFS= read -r line; do
  printf "${BCYAN}║${RESET}  ${BBLUE}%-68s${RESET}${BCYAN}║${RESET}\n" "$line"
done

printf "${BCYAN}║${RESET}                                                                      ${BCYAN}║${RESET}\n"

# ── Tagline ──────────────────────────────────────────────────
printf "${BCYAN}║${RESET}  ${DIM}${WHITE}  Multi-Agent HR & Productivity Platform  •  Powered by Brightcone${RESET}           ${BCYAN}║${RESET}\n"
printf "${BCYAN}║${RESET}                                                                      ${BCYAN}║${RESET}\n"
printf "${BCYAN}╠══════════════════════════════════════════════════════════════════════╣${RESET}\n"

# ── System Info ──────────────────────────────────────────────
HOSTNAME_VAL=$(hostname 2>/dev/null || echo "unknown")
UPTIME_VAL=$(uptime -p 2>/dev/null | sed 's/up //' || echo "unknown")
LOAD_VAL=$(uptime 2>/dev/null | awk -F'load average:' '{print $2}' | xargs || echo "unknown")
MEM_USED=$(free -m 2>/dev/null | awk 'NR==2{printf "%dMB / %dMB", $3, $2}' || echo "unknown")
DISK_USED=$(df -h / 2>/dev/null | awk 'NR==2{printf "%s / %s (%s used)", $3, $2, $5}' || echo "unknown")
IP_PUB=$(curl -s --max-time 2 ifconfig.me 2>/dev/null || hostname -I 2>/dev/null | awk '{print $1}' || echo "unknown")
DATE_NOW=$(date '+%A, %d %B %Y  •  %H:%M UTC')

printf "${BCYAN}║${RESET}  ${BYELLOW}🖥  System${RESET}                                                            ${BCYAN}║${RESET}\n"
printf "${BCYAN}║${RESET}  ${DIM}  Host   :${RESET} ${WHITE}%-59s${RESET}${BCYAN}║${RESET}\n" "$HOSTNAME_VAL"
printf "${BCYAN}║${RESET}  ${DIM}  Time   :${RESET} ${WHITE}%-59s${RESET}${BCYAN}║${RESET}\n" "$DATE_NOW"
printf "${BCYAN}║${RESET}  ${DIM}  Uptime :${RESET} ${GREEN}%-59s${RESET}${BCYAN}║${RESET}\n" "$UPTIME_VAL"
printf "${BCYAN}║${RESET}  ${DIM}  Load   :${RESET} ${WHITE}%-59s${RESET}${BCYAN}║${RESET}\n" "$LOAD_VAL"
printf "${BCYAN}║${RESET}  ${DIM}  Memory :${RESET} ${WHITE}%-59s${RESET}${BCYAN}║${RESET}\n" "$MEM_USED"
printf "${BCYAN}║${RESET}  ${DIM}  Disk   :${RESET} ${WHITE}%-59s${RESET}${BCYAN}║${RESET}\n" "$DISK_USED"
printf "${BCYAN}║${RESET}  ${DIM}  IP     :${RESET} ${CYAN}%-59s${RESET}${BCYAN}║${RESET}\n" "$IP_PUB"
printf "${BCYAN}║${RESET}                                                                      ${BCYAN}║${RESET}\n"
printf "${BCYAN}╠══════════════════════════════════════════════════════════════════════╣${RESET}\n"

# ── Services ─────────────────────────────────────────────────
printf "${BCYAN}║${RESET}  ${BMAGENTA}🚀  BrightCode Services${RESET}                                               ${BCYAN}║${RESET}\n"
printf "${BCYAN}║${RESET}                                                                      ${BCYAN}║${RESET}\n"

check_url() {
  local label="$1"
  local url="$2"
  local status
  status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 4 "$url" 2>/dev/null)
  if [[ "$status" =~ ^[23] ]]; then
    printf "${BCYAN}║${RESET}  ${BGREEN}  ●  %-12s${RESET} ${DIM}%-43s${RESET} ${BGREEN}[  UP  ]${RESET}   ${BCYAN}║${RESET}\n" "$label" "$url"
  else
    printf "${BCYAN}║${RESET}  ${BRED}  ●  %-12s${RESET} ${DIM}%-43s${RESET} ${BRED}[ DOWN ]${RESET}   ${BCYAN}║${RESET}\n" "$label" "$url"
  fi
}

check_url "Frontend"  "https://code-ui.brightcone.ai"
check_url "Backend"   "https://code-api.brightcone.ai/health"
check_url "HR Portal" "https://code-ui.brightcone.ai/hr"

printf "${BCYAN}║${RESET}                                                                      ${BCYAN}║${RESET}\n"
printf "${BCYAN}╠══════════════════════════════════════════════════════════════════════╣${RESET}\n"

# ── Quick Links ──────────────────────────────────────────────
printf "${BCYAN}║${RESET}  ${BYELLOW}🔗  Quick Links${RESET}                                                       ${BCYAN}║${RESET}\n"
printf "${BCYAN}║${RESET}  ${DIM}  UI  →${RESET}  ${CYAN}https://code-ui.brightcone.ai${RESET}                               ${BCYAN}║${RESET}\n"
printf "${BCYAN}║${RESET}  ${DIM}  API →${RESET}  ${CYAN}https://code-api.brightcone.ai/docs${RESET}                         ${BCYAN}║${RESET}\n"
printf "${BCYAN}║${RESET}  ${DIM}  HR  →${RESET}  ${CYAN}https://code-ui.brightcone.ai/hr${RESET}                            ${BCYAN}║${RESET}\n"
printf "${BCYAN}║${RESET}  ${DIM}  Git →${RESET}  ${CYAN}git@github.com:ivaturipraveen/brightcode-multiagent.git${RESET}     ${BCYAN}║${RESET}\n"
printf "${BCYAN}║${RESET}                                                                      ${BCYAN}║${RESET}\n"
printf "${BCYAN}╠══════════════════════════════════════════════════════════════════════╣${RESET}\n"

# ── Git status ───────────────────────────────────────────────
REPO_DIR="/home/ubuntu/openclaw-multiagent"
if [ -d "$REPO_DIR/.git" ]; then
  BRANCH=$(git -C "$REPO_DIR" rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
  LAST_COMMIT=$(git -C "$REPO_DIR" log -1 --format="%h  %s" 2>/dev/null | cut -c1-65 || echo "unknown")
  COMMIT_TIME=$(git -C "$REPO_DIR" log -1 --format="%ar" 2>/dev/null || echo "unknown")
  printf "${BCYAN}║${RESET}  ${BYELLOW}📦  Repository${RESET}                                                       ${BCYAN}║${RESET}\n"
  printf "${BCYAN}║${RESET}  ${DIM}  Branch :${RESET} ${WHITE}%-59s${RESET}${BCYAN}║${RESET}\n" "$BRANCH"
  printf "${BCYAN}║${RESET}  ${DIM}  Commit :${RESET} ${WHITE}%-59s${RESET}${BCYAN}║${RESET}\n" "$LAST_COMMIT"
  printf "${BCYAN}║${RESET}  ${DIM}  When   :${RESET} ${DIM}%-59s${RESET}${BCYAN}║${RESET}\n" "$COMMIT_TIME"
  printf "${BCYAN}║${RESET}                                                                      ${BCYAN}║${RESET}\n"
  printf "${BCYAN}╠══════════════════════════════════════════════════════════════════════╣${RESET}\n"
fi

# ── HR Credentials reminder ──────────────────────────────────
printf "${BCYAN}║${RESET}  ${BGREEN}👤  HR Portal Test Accounts${RESET}                                           ${BCYAN}║${RESET}\n"
printf "${BCYAN}║${RESET}  ${DIM}  Admin  :${RESET} ${WHITE}admin@yanthraa.com${RESET}   ${DIM}/ pass:${RESET} ${YELLOW}Admin@1234${RESET}                   ${BCYAN}║${RESET}\n"
printf "${BCYAN}║${RESET}  ${DIM}  Emp    :${RESET} ${WHITE}sunil@yanthraa.com${RESET}   ${DIM}/ pass:${RESET} ${YELLOW}Sunil@1234${RESET}                   ${BCYAN}║${RESET}\n"
printf "${BCYAN}║${RESET}                                                                      ${BCYAN}║${RESET}\n"

# ── Bottom divider ───────────────────────────────────────────
printf "${BCYAN}╚══════════════════════════════════════════════════════════════════════╝${RESET}\n"
echo ""
