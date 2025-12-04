#!/bin/bash

# Staging Environment TUI (Text User Interface)
# Interactive menu for managing staging environment

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONTROL_SCRIPT="${SCRIPT_DIR}/staging-control.sh"

# ANSI Colors
readonly COLOR_RESET='\033[0m'
readonly COLOR_BOLD='\033[1m'
readonly COLOR_DIM='\033[2m'
readonly COLOR_RED='\033[0;31m'
readonly COLOR_GREEN='\033[0;32m'
readonly COLOR_YELLOW='\033[0;33m'
readonly COLOR_BLUE='\033[0;34m'
readonly COLOR_MAGENTA='\033[0;35m'
readonly COLOR_CYAN='\033[0;36m'
readonly COLOR_WHITE='\033[0;37m'
readonly COLOR_BG_BLUE='\033[44m'
readonly COLOR_BG_GREEN='\033[42m'
readonly COLOR_BG_RED='\033[41m'

# Box drawing characters
readonly BOX_TL='╔'
readonly BOX_TR='╗'
readonly BOX_BL='╚'
readonly BOX_BR='╝'
readonly BOX_H='═'
readonly BOX_V='║'
readonly BOX_VR='╠'
readonly BOX_VL='╣'
readonly ARROW='→'

# Terminal control
clear_screen() {
    clear
    tput cup 0 0
}

move_cursor() {
    tput cup "$1" "$2"
}

hide_cursor() {
    tput civis
}

show_cursor() {
    tput cnorm
}

get_terminal_size() {
    TERM_ROWS=$(tput lines)
    TERM_COLS=$(tput cols)
}

# Draw functions
draw_box() {
    local width=$1
    local title=$2

    # Top border
    echo -ne "${COLOR_CYAN}${COLOR_BOLD}"
    echo -n "${BOX_TL}"
    printf "${BOX_H}%.0s" $(seq 1 $((width - 2)))
    echo -e "${BOX_TR}${COLOR_RESET}"

    # Title
    if [ -n "$title" ]; then
        local title_len=${#title}
        local padding_total=$((width - title_len - 2))
        local padding_left=$((padding_total / 2))
        local padding_right=$((padding_total - padding_left))

        echo -ne "${COLOR_CYAN}${BOX_V}${COLOR_RESET}"
        printf " %.0s" $(seq 1 $padding_left)
        echo -ne "${COLOR_BOLD}${COLOR_WHITE}${title}${COLOR_RESET}"
        printf " %.0s" $(seq 1 $padding_right)
        echo -e "${COLOR_CYAN}${BOX_V}${COLOR_RESET}"

        # Separator
        echo -ne "${COLOR_CYAN}${BOX_VR}"
        printf "${BOX_H}%.0s" $(seq 1 $((width - 2)))
        echo -e "${BOX_VL}${COLOR_RESET}"
    fi
}

draw_box_bottom() {
    local width=$1
    echo -ne "${COLOR_CYAN}${BOX_BL}"
    printf "${BOX_H}%.0s" $(seq 1 $((width - 2)))
    echo -e "${BOX_BR}${COLOR_RESET}"
}

draw_menu_item() {
    local number=$1
    local label=$2
    local description=$3
    local selected=$4
    local width=$5

    echo -ne "${COLOR_CYAN}${BOX_V}${COLOR_RESET} "

    if [ "$selected" = "true" ]; then
        echo -ne "${COLOR_BG_BLUE}${COLOR_WHITE}${COLOR_BOLD}"
    fi

    printf "[%s] %-18s" "$number" "$label"

    if [ "$selected" = "true" ]; then
        echo -ne "${COLOR_RESET} "
    else
        echo -ne " "
    fi

    echo -ne "${COLOR_DIM}${description}${COLOR_RESET}"

    # Calculate padding to right edge
    local content_len=$((5 + 18 + ${#description}))
    local padding=$((width - content_len - 3))
    [ $padding -lt 0 ] && padding=0
    printf " %.0s" $(seq 1 $padding)

    echo -e "${COLOR_CYAN}${BOX_V}${COLOR_RESET}"
}

draw_info_line() {
    local label=$1
    local value=$2
    local color=$3
    local width=$4

    echo -ne "${COLOR_CYAN}${BOX_V}${COLOR_RESET}  "
    printf "${COLOR_BOLD}%-12s${COLOR_RESET} " "${label}:"
    echo -ne "${color}${value}${COLOR_RESET}"

    local content_len=$((14 + ${#value}))
    local padding=$((width - content_len - 3))
    [ $padding -lt 0 ] && padding=0
    printf " %.0s" $(seq 1 $padding)

    echo -e "${COLOR_CYAN}${BOX_V}${COLOR_RESET}"
}

draw_empty_line() {
    local width=$1
    echo -ne "${COLOR_CYAN}${BOX_V}${COLOR_RESET}"
    printf " %.0s" $(seq 1 $((width - 2)))
    echo -e "${COLOR_CYAN}${BOX_V}${COLOR_RESET}"
}

# Status checking functions
check_worktree_exists() {
    [ -d "/Users/a1/Projects/SYNGRISI_STAGE" ]
}

check_server_running() {
    lsof -Pi :5252 -sTCP:LISTEN -t >/dev/null 2>&1
}

get_server_pid() {
    lsof -ti :5252 2>/dev/null || echo ""
}

check_database_connected() {
    mongosh "mongodb://localhost:27017/VRSdb_stage" --eval "db.version()" &>/dev/null
}

get_database_stats() {
    if check_database_connected; then
        mongosh "mongodb://localhost:27017/VRSdb_stage" --quiet --eval "
            var checks = db.checks.countDocuments();
            var baselines = db.baselines.countDocuments();
            var tests = db.tests.countDocuments();
            print(checks + '|' + baselines + '|' + tests);
        " 2>/dev/null
    else
        echo "0|0|0"
    fi
}

# Main menu
draw_main_menu() {
    local selected_item=$1
    local box_width=80

    clear_screen

    # Header
    echo ""
    draw_box $box_width "STAGING ENVIRONMENT MANAGER"

    # Status section
    draw_empty_line $box_width

    if check_worktree_exists; then
        draw_info_line "Worktree" "EXISTS" "${COLOR_GREEN}" $box_width
    else
        draw_info_line "Worktree" "NOT FOUND" "${COLOR_RED}" $box_width
    fi

    if check_server_running; then
        local pid=$(get_server_pid)
        draw_info_line "Server" "RUNNING (PID: ${pid})" "${COLOR_GREEN}" $box_width
        draw_info_line "URL" "http://localhost:5252" "${COLOR_CYAN}" $box_width
    else
        draw_info_line "Server" "NOT RUNNING" "${COLOR_YELLOW}" $box_width
    fi

    if check_database_connected; then
        local stats=$(get_database_stats)
        local checks=$(echo "$stats" | cut -d'|' -f1)
        local baselines=$(echo "$stats" | cut -d'|' -f2)
        local tests=$(echo "$stats" | cut -d'|' -f3)
        draw_info_line "Database" "CONNECTED" "${COLOR_GREEN}" $box_width
        draw_info_line "  Checks" "${checks}" "${COLOR_WHITE}" $box_width
        draw_info_line "  Baselines" "${baselines}" "${COLOR_WHITE}" $box_width
        draw_info_line "  Tests" "${tests}" "${COLOR_WHITE}" $box_width
    else
        draw_info_line "Database" "NOT CONNECTED" "${COLOR_RED}" $box_width
    fi

    draw_empty_line $box_width

    # Separator
    echo -ne "${COLOR_CYAN}${BOX_VR}"
    printf "${BOX_H}%.0s" $(seq 1 $((box_width - 2)))
    echo -e "${BOX_VL}${COLOR_RESET}"

    # Menu items
    draw_empty_line $box_width

    [ "$selected_item" = "1" ] && sel="true" || sel="false"
    draw_menu_item "1" "Setup" "Initial staging environment setup" "$sel" $box_width

    [ "$selected_item" = "2" ] && sel="true" || sel="false"
    draw_menu_item "2" "Start" "Start staging server" "$sel" $box_width

    [ "$selected_item" = "3" ] && sel="true" || sel="false"
    draw_menu_item "3" "Stop" "Stop staging server" "$sel" $box_width

    [ "$selected_item" = "4" ] && sel="true" || sel="false"
    draw_menu_item "4" "Restart" "Restart staging server" "$sel" $box_width

    [ "$selected_item" = "5" ] && sel="true" || sel="false"
    draw_menu_item "5" "Reset" "Reset to production state" "$sel" $box_width

    [ "$selected_item" = "6" ] && sel="true" || sel="false"
    draw_menu_item "6" "Status" "Show detailed status" "$sel" $box_width

    [ "$selected_item" = "7" ] && sel="true" || sel="false"
    draw_menu_item "7" "Logs" "View server logs" "$sel" $box_width

    [ "$selected_item" = "8" ] && sel="true" || sel="false"
    draw_menu_item "8" "Open Browser" "Open staging in browser" "$sel" $box_width

    draw_empty_line $box_width

    [ "$selected_item" = "q" ] && sel="true" || sel="false"
    draw_menu_item "q" "Quit" "Exit TUI" "$sel" $box_width

    draw_empty_line $box_width
    draw_box_bottom $box_width

    echo ""
    echo -e "${COLOR_DIM}Use arrow keys (↑/↓) or numbers (1-8) to navigate, Enter to select, Q to quit${COLOR_RESET}"
    echo ""
}

# Execute command with feedback
execute_command() {
    local command=$1
    local title=$2

    clear_screen
    echo ""
    echo -e "${COLOR_BOLD}${COLOR_CYAN}╔════════════════════════════════════════════════════════════════════════════════╗${COLOR_RESET}"
    echo -e "${COLOR_BOLD}${COLOR_CYAN}║${COLOR_RESET} ${COLOR_BOLD}${title}${COLOR_RESET}"
    echo -e "${COLOR_BOLD}${COLOR_CYAN}╚════════════════════════════════════════════════════════════════════════════════╝${COLOR_RESET}"
    echo ""

    case "$command" in
        setup)
            "${CONTROL_SCRIPT}" setup
            ;;
        start)
            "${CONTROL_SCRIPT}" start &
            local pid=$!
            echo ""
            echo -e "${COLOR_GREEN}Server starting in background (PID: ${pid})...${COLOR_RESET}"
            sleep 2
            if check_server_running; then
                echo -e "${COLOR_GREEN}✓ Server started successfully${COLOR_RESET}"
            else
                echo -e "${COLOR_RED}✗ Server failed to start${COLOR_RESET}"
            fi
            ;;
        stop)
            "${CONTROL_SCRIPT}" stop
            ;;
        restart)
            "${CONTROL_SCRIPT}" restart &
            sleep 2
            ;;
        reset)
            echo -e "${COLOR_YELLOW}${COLOR_BOLD}WARNING: This will reset staging to initial production state!${COLOR_RESET}"
            echo -e "${COLOR_YELLOW}All changes will be lost.${COLOR_RESET}"
            echo ""
            read -p "Continue? (yes/no): " confirm
            if [ "$confirm" = "yes" ]; then
                "${CONTROL_SCRIPT}" reset
            else
                echo -e "${COLOR_YELLOW}Reset cancelled${COLOR_RESET}"
            fi
            ;;
        status)
            "${CONTROL_SCRIPT}" status
            ;;
        logs)
            echo -e "${COLOR_DIM}Press Ctrl+C to stop tailing logs${COLOR_RESET}"
            echo ""
            sleep 2
            "${CONTROL_SCRIPT}" logs
            ;;
        browser)
            if check_server_running; then
                echo "Opening http://localhost:5252 in browser..."
                open "http://localhost:5252" 2>/dev/null || \
                xdg-open "http://localhost:5252" 2>/dev/null || \
                echo -e "${COLOR_YELLOW}Could not open browser automatically. Please open: http://localhost:5252${COLOR_RESET}"
            else
                echo -e "${COLOR_RED}Server is not running. Please start it first.${COLOR_RESET}"
            fi
            ;;
    esac

    echo ""
    echo -e "${COLOR_DIM}Press Enter to continue...${COLOR_RESET}"
    read -r
}

# Main loop
main() {
    local selected=1
    local running=true

    # Setup terminal
    hide_cursor
    trap "show_cursor; clear; exit" EXIT INT TERM

    while $running; do
        draw_main_menu "$selected"

        # Read single character
        read -rsn1 key

        # Handle special keys (arrow keys send 3 characters: ^[[A or ^[[B)
        if [[ $key == $'\x1b' ]]; then
            read -rsn2 key 2>/dev/null || true
        fi

        case "$key" in
            '[A'|'k') # Up arrow or k
                ((selected--))
                [ $selected -lt 1 ] && selected=8
                ;;
            '[B'|'j') # Down arrow or j
                ((selected++))
                [ $selected -gt 8 ] && selected=1
                ;;
            '1')
                selected=1
                execute_command "setup" "SETUP STAGING ENVIRONMENT"
                ;;
            '2')
                selected=2
                execute_command "start" "START STAGING SERVER"
                ;;
            '3')
                selected=3
                execute_command "stop" "STOP STAGING SERVER"
                ;;
            '4')
                selected=4
                execute_command "restart" "RESTART STAGING SERVER"
                ;;
            '5')
                selected=5
                execute_command "reset" "RESET STAGING ENVIRONMENT"
                ;;
            '6')
                selected=6
                execute_command "status" "STAGING STATUS"
                ;;
            '7')
                selected=7
                execute_command "logs" "STAGING LOGS"
                ;;
            '8')
                selected=8
                execute_command "browser" "OPEN IN BROWSER"
                ;;
            'q'|'Q')
                running=false
                ;;
            '') # Enter key
                case "$selected" in
                    1) execute_command "setup" "SETUP STAGING ENVIRONMENT" ;;
                    2) execute_command "start" "START STAGING SERVER" ;;
                    3) execute_command "stop" "STOP STAGING SERVER" ;;
                    4) execute_command "restart" "RESTART STAGING SERVER" ;;
                    5) execute_command "reset" "RESET STAGING ENVIRONMENT" ;;
                    6) execute_command "status" "STAGING STATUS" ;;
                    7) execute_command "logs" "STAGING LOGS" ;;
                    8) execute_command "browser" "OPEN IN BROWSER" ;;
                esac
                ;;
        esac
    done

    show_cursor
    clear_screen
    echo -e "${COLOR_GREEN}Thank you for using Staging Environment Manager!${COLOR_RESET}"
    echo ""
}

# Entry point
if [ ! -x "${CONTROL_SCRIPT}" ]; then
    echo "Error: Control script not found or not executable: ${CONTROL_SCRIPT}"
    exit 1
fi

main "$@"
