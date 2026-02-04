#!/bin/bash
# =============================================================================
# macOS Keep Awake Script for Remote Development
# =============================================================================
# This script prevents your Mac from sleeping while running a remote tunnel.
# 
# Usage:
#   ./keep-awake-macos.sh         # Keeps Mac awake until Ctrl+C
#   ./keep-awake-macos.sh 8       # Keeps Mac awake for 8 hours
#
# Requirements:
#   - macOS (uses built-in caffeinate command)
# =============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${BLUE}"
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║          macOS Keep Awake for Remote Development           ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

cleanup() {
    echo ""
    print_warning "Received interrupt signal. Allowing Mac to sleep again..."
    exit 0
}

trap cleanup SIGINT SIGTERM

print_header

# Check if running on macOS
if [[ "$(uname)" != "Darwin" ]]; then
    print_error "This script is for macOS only."
    echo "For Windows, use: keep-awake-windows.ps1"
    echo "For Linux, use: keep-awake-linux.sh"
    exit 1
fi

# Parse duration argument (in hours)
DURATION_HOURS=${1:-0}

if [[ $DURATION_HOURS -gt 0 ]]; then
    DURATION_SECONDS=$((DURATION_HOURS * 3600))
    print_status "Will keep Mac awake for ${DURATION_HOURS} hour(s)"
    echo ""
    echo -e "  ${BLUE}Started at:${NC} $(date '+%Y-%m-%d %H:%M:%S')"
    echo -e "  ${BLUE}Will stop at:${NC} $(date -v+${DURATION_HOURS}H '+%Y-%m-%d %H:%M:%S')"
    echo ""
    print_warning "Press Ctrl+C to stop early"
    echo ""
    
    # caffeinate flags:
    # -d: Prevent the display from sleeping
    # -i: Prevent the system from idle sleeping
    # -s: Prevent the system from sleeping (on AC power)
    # -t: Timeout in seconds
    caffeinate -d -i -s -t $DURATION_SECONDS
    
    print_status "Duration complete. Mac can now sleep."
else
    print_status "Keeping Mac awake indefinitely"
    echo ""
    echo -e "  ${BLUE}Started at:${NC} $(date '+%Y-%m-%d %H:%M:%S')"
    echo ""
    print_warning "Press Ctrl+C to stop and allow Mac to sleep"
    echo ""
    
    # Keep awake indefinitely (until Ctrl+C)
    caffeinate -d -i -s
fi
