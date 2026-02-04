#!/bin/bash
# =============================================================================
# Linux Keep Awake Script for Remote Development
# =============================================================================
# This script prevents your Linux system from sleeping while running a remote tunnel.
# 
# Usage:
#   ./keep-awake-linux.sh         # Keeps system awake until Ctrl+C
#   ./keep-awake-linux.sh 8       # Keeps system awake for 8 hours
#
# Requirements:
#   - Linux with systemd (most modern distributions)
#   - OR xdotool for X11 systems
#   - OR xdg-screensaver
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
    echo "║          Linux Keep Awake for Remote Development           ║"
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

print_info() {
    echo -e "${BLUE}[i]${NC} $1"
}

cleanup() {
    echo ""
    print_warning "Received interrupt signal. Allowing system to sleep again..."
    exit 0
}

trap cleanup SIGINT SIGTERM

print_header

# Check if running on Linux
if [[ "$(uname)" != "Linux" ]]; then
    print_error "This script is for Linux only."
    echo "For macOS, use: keep-awake-macos.sh"
    echo "For Windows, use: keep-awake-windows.ps1"
    exit 1
fi

# Parse duration argument (in hours)
DURATION_HOURS=${1:-0}

# Detect the best method to keep system awake
detect_method() {
    # Method 1: systemd-inhibit (preferred for modern Linux)
    if command -v systemd-inhibit &> /dev/null; then
        echo "systemd"
        return
    fi
    
    # Method 2: xdg-screensaver (for desktop environments)
    if command -v xdg-screensaver &> /dev/null; then
        echo "xdg"
        return
    fi
    
    # Method 3: xdotool (simulates activity)
    if command -v xdotool &> /dev/null; then
        echo "xdotool"
        return
    fi
    
    # Method 4: caffeine-ng (if installed)
    if command -v caffeine &> /dev/null; then
        echo "caffeine"
        return
    fi
    
    echo "none"
}

METHOD=$(detect_method)

case $METHOD in
    "systemd")
        print_status "Using systemd-inhibit (recommended)"
        ;;
    "xdg")
        print_status "Using xdg-screensaver"
        ;;
    "xdotool")
        print_status "Using xdotool (simulates mouse movement)"
        ;;
    "caffeine")
        print_status "Using caffeine-ng"
        ;;
    "none")
        print_error "No suitable keep-awake method found."
        echo ""
        echo "Please install one of the following:"
        echo "  - systemd (usually pre-installed on modern distros)"
        echo "  - xdg-utils: sudo apt install xdg-utils"
        echo "  - xdotool: sudo apt install xdotool"
        echo "  - caffeine-ng: sudo apt install caffeine-ng"
        exit 1
        ;;
esac

START_TIME=$(date '+%Y-%m-%d %H:%M:%S')

if [[ $DURATION_HOURS -gt 0 ]]; then
    END_TIME=$(date -d "+${DURATION_HOURS} hours" '+%Y-%m-%d %H:%M:%S')
    DURATION_SECONDS=$((DURATION_HOURS * 3600))
    print_status "Will keep system awake for ${DURATION_HOURS} hour(s)"
    echo ""
    echo -e "  ${BLUE}Started at:${NC} $START_TIME"
    echo -e "  ${BLUE}Will stop at:${NC} $END_TIME"
else
    print_status "Keeping system awake indefinitely"
    echo ""
    echo -e "  ${BLUE}Started at:${NC} $START_TIME"
fi

echo ""
print_warning "Press Ctrl+C to stop and allow system to sleep"
echo ""

# Execute the keep-awake method
case $METHOD in
    "systemd")
        if [[ $DURATION_HOURS -gt 0 ]]; then
            # Use timeout with systemd-inhibit
            timeout ${DURATION_SECONDS}s systemd-inhibit \
                --what=idle:sleep:handle-lid-switch \
                --who="Remote Development" \
                --why="Cursor Remote Tunnel Active" \
                --mode=block \
                sleep infinity
            print_status "Duration complete. System can now sleep."
        else
            # Run indefinitely
            systemd-inhibit \
                --what=idle:sleep:handle-lid-switch \
                --who="Remote Development" \
                --why="Cursor Remote Tunnel Active" \
                --mode=block \
                sleep infinity
        fi
        ;;
    
    "xdg")
        # xdg-screensaver needs periodic reset
        ITERATION=0
        END_EPOCH=$(date -d "+${DURATION_HOURS} hours" +%s 2>/dev/null || echo 0)
        
        while true; do
            # Check duration if specified
            if [[ $DURATION_HOURS -gt 0 ]]; then
                CURRENT_EPOCH=$(date +%s)
                if [[ $CURRENT_EPOCH -ge $END_EPOCH ]]; then
                    echo ""
                    print_status "Duration complete. System can now sleep."
                    break
                fi
            fi
            
            xdg-screensaver reset 2>/dev/null || true
            
            ITERATION=$((ITERATION + 1))
            if [[ $((ITERATION % 10)) -eq 0 ]]; then
                echo "  [$(date '+%H:%M:%S')] Still awake..."
            fi
            
            sleep 60
        done
        ;;
    
    "xdotool")
        # Simulate minor mouse movement
        ITERATION=0
        END_EPOCH=$(date -d "+${DURATION_HOURS} hours" +%s 2>/dev/null || echo 0)
        
        while true; do
            # Check duration if specified
            if [[ $DURATION_HOURS -gt 0 ]]; then
                CURRENT_EPOCH=$(date +%s)
                if [[ $CURRENT_EPOCH -ge $END_EPOCH ]]; then
                    echo ""
                    print_status "Duration complete. System can now sleep."
                    break
                fi
            fi
            
            # Move mouse 1 pixel and back (barely noticeable)
            xdotool mousemove_relative 1 0
            sleep 0.1
            xdotool mousemove_relative -- -1 0
            
            ITERATION=$((ITERATION + 1))
            if [[ $((ITERATION % 10)) -eq 0 ]]; then
                echo "  [$(date '+%H:%M:%S')] Still awake..."
            fi
            
            sleep 60
        done
        ;;
    
    "caffeine")
        print_info "Starting caffeine (you may see a system tray icon)"
        if [[ $DURATION_HOURS -gt 0 ]]; then
            timeout ${DURATION_SECONDS}s caffeine &
            CAFFEINE_PID=$!
            wait $CAFFEINE_PID
            print_status "Duration complete. System can now sleep."
        else
            caffeine
        fi
        ;;
esac
