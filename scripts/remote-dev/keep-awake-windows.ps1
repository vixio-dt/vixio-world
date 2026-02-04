# =============================================================================
# Windows Keep Awake Script for Remote Development
# =============================================================================
# This script prevents your Windows PC from sleeping while running a remote tunnel.
# 
# Usage:
#   .\keep-awake-windows.ps1          # Keeps PC awake until Ctrl+C
#   .\keep-awake-windows.ps1 -Hours 8 # Keeps PC awake for 8 hours
#
# Requirements:
#   - Windows PowerShell 5.1+ or PowerShell Core 6+
#   - Run with appropriate execution policy: Set-ExecutionPolicy RemoteSigned
# =============================================================================

param(
    [int]$Hours = 0,
    [switch]$Help
)

# ANSI color codes for PowerShell
$ESC = [char]27
$Red = "$ESC[31m"
$Green = "$ESC[32m"
$Yellow = "$ESC[33m"
$Blue = "$ESC[34m"
$Reset = "$ESC[0m"

function Show-Header {
    Write-Host ""
    Write-Host "${Blue}╔════════════════════════════════════════════════════════════╗${Reset}"
    Write-Host "${Blue}║        Windows Keep Awake for Remote Development           ║${Reset}"
    Write-Host "${Blue}╚════════════════════════════════════════════════════════════╝${Reset}"
    Write-Host ""
}

function Show-Status {
    param([string]$Message)
    Write-Host "${Green}[✓]${Reset} $Message"
}

function Show-Warning {
    param([string]$Message)
    Write-Host "${Yellow}[!]${Reset} $Message"
}

function Show-Error {
    param([string]$Message)
    Write-Host "${Red}[✗]${Reset} $Message"
}

function Show-Help {
    Show-Header
    Write-Host "Usage: .\keep-awake-windows.ps1 [-Hours <number>] [-Help]"
    Write-Host ""
    Write-Host "Parameters:"
    Write-Host "  -Hours   Number of hours to keep PC awake (0 = indefinite)"
    Write-Host "  -Help    Show this help message"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\keep-awake-windows.ps1           # Keep awake indefinitely"
    Write-Host "  .\keep-awake-windows.ps1 -Hours 8  # Keep awake for 8 hours"
    Write-Host ""
    exit 0
}

if ($Help) {
    Show-Help
}

Show-Header

# Check if running on Windows
if ($env:OS -ne "Windows_NT") {
    Show-Error "This script is for Windows only."
    Write-Host "For macOS, use: keep-awake-macos.sh"
    Write-Host "For Linux, use: keep-awake-linux.sh"
    exit 1
}

# Add the required .NET type for SendKeys
Add-Type -AssemblyName System.Windows.Forms

# Calculate end time if duration specified
$StartTime = Get-Date
$EndTime = if ($Hours -gt 0) { $StartTime.AddHours($Hours) } else { $null }

if ($Hours -gt 0) {
    Show-Status "Will keep PC awake for $Hours hour(s)"
    Write-Host ""
    Write-Host "  ${Blue}Started at:${Reset} $($StartTime.ToString('yyyy-MM-dd HH:mm:ss'))"
    Write-Host "  ${Blue}Will stop at:${Reset} $($EndTime.ToString('yyyy-MM-dd HH:mm:ss'))"
} else {
    Show-Status "Keeping PC awake indefinitely"
    Write-Host ""
    Write-Host "  ${Blue}Started at:${Reset} $($StartTime.ToString('yyyy-MM-dd HH:mm:ss'))"
}

Write-Host ""
Show-Warning "Press Ctrl+C to stop and allow PC to sleep"
Write-Host ""

# Main loop - sends F15 key every 60 seconds to prevent sleep
# F15 is chosen because it doesn't interfere with normal usage
$IterationCount = 0

try {
    while ($true) {
        # Check if we've exceeded the duration
        if ($EndTime -and (Get-Date) -gt $EndTime) {
            Write-Host ""
            Show-Status "Duration complete. PC can now sleep."
            break
        }
        
        # Send F15 key to prevent sleep
        [System.Windows.Forms.SendKeys]::SendWait("{F15}")
        
        $IterationCount++
        
        # Show periodic status (every 10 minutes)
        if ($IterationCount % 10 -eq 0) {
            $Elapsed = (Get-Date) - $StartTime
            $ElapsedFormatted = "{0:hh\:mm\:ss}" -f $Elapsed
            Write-Host "  [$(Get-Date -Format 'HH:mm:ss')] Still awake... (Elapsed: $ElapsedFormatted)"
        }
        
        # Sleep for 60 seconds
        Start-Sleep -Seconds 60
    }
}
catch {
    Write-Host ""
    Show-Warning "Script interrupted. PC can now sleep."
}
finally {
    # Cleanup code if needed
}
