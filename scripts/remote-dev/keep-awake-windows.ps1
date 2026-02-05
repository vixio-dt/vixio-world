# keep-awake-windows.ps1
# Prevents Windows from sleeping while Cursor is running for remote development
#
# Usage: Right-click → Run with PowerShell
# Or: powershell -ExecutionPolicy Bypass -File keep-awake-windows.ps1

param(
    [switch]$Silent,
    [int]$IntervalMinutes = 2
)

$ErrorActionPreference = "Stop"

# Check if running as script or dot-sourced
$scriptName = "Cursor Keep-Awake"

function Write-Status {
    param([string]$Message, [string]$Color = "White")
    if (-not $Silent) {
        Write-Host $Message -ForegroundColor $Color
    }
}

Write-Status "`n========================================" "Cyan"
Write-Status "  $scriptName" "Cyan"
Write-Status "========================================`n" "Cyan"

# Method 1: Use Windows API to prevent sleep
Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;

public class PowerManager {
    [DllImport("kernel32.dll", CharSet = CharSet.Auto, SetLastError = true)]
    public static extern uint SetThreadExecutionState(uint esFlags);
    
    public const uint ES_CONTINUOUS = 0x80000000;
    public const uint ES_SYSTEM_REQUIRED = 0x00000001;
    public const uint ES_DISPLAY_REQUIRED = 0x00000002;
}
"@

function Set-AwakeState {
    param([bool]$Awake)
    
    if ($Awake) {
        # Prevent sleep, keep display on
        $result = [PowerManager]::SetThreadExecutionState(
            [PowerManager]::ES_CONTINUOUS -bor 
            [PowerManager]::ES_SYSTEM_REQUIRED -bor 
            [PowerManager]::ES_DISPLAY_REQUIRED
        )
    } else {
        # Allow normal sleep behavior
        $result = [PowerManager]::SetThreadExecutionState([PowerManager]::ES_CONTINUOUS)
    }
    
    return $result -ne 0
}

function Test-CursorRunning {
    $cursor = Get-Process -Name "Cursor" -ErrorAction SilentlyContinue
    return $null -ne $cursor
}

# Initial state
if (-not (Test-CursorRunning)) {
    Write-Status "Warning: Cursor is not currently running." "Yellow"
    Write-Status "This script will keep your PC awake regardless.`n" "Yellow"
}

Write-Status "Starting keep-awake mode..." "Green"
Write-Status "Press Ctrl+C to stop`n" "Gray"

$keepRunning = $true
$lastStatus = $null

# Handle Ctrl+C gracefully
$null = Register-EngineEvent -SourceIdentifier PowerShell.Exiting -Action {
    Set-AwakeState -Awake $false
    Write-Host "`nSleep prevention disabled. Goodbye!" -ForegroundColor Cyan
}

try {
    while ($keepRunning) {
        $cursorRunning = Test-CursorRunning
        
        if ($cursorRunning) {
            $success = Set-AwakeState -Awake $true
            
            if ($lastStatus -ne "awake") {
                $timestamp = Get-Date -Format "HH:mm:ss"
                Write-Status "[$timestamp] Cursor detected - PC will stay awake" "Green"
                $lastStatus = "awake"
            }
        } else {
            # Still keep awake even without Cursor (user may be restarting it)
            $success = Set-AwakeState -Awake $true
            
            if ($lastStatus -ne "waiting") {
                $timestamp = Get-Date -Format "HH:mm:ss"
                Write-Status "[$timestamp] Cursor not running - still keeping awake" "Yellow"
                $lastStatus = "waiting"
            }
        }
        
        # Sleep for interval
        Start-Sleep -Seconds ($IntervalMinutes * 60)
    }
}
catch {
    Write-Status "`nError: $_" "Red"
}
finally {
    Set-AwakeState -Awake $false
    Write-Status "`nSleep prevention disabled." "Cyan"
}
