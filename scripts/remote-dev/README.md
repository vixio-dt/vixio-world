# Remote Development Helper Scripts

This directory contains helper scripts for maintaining a stable remote development environment using Cursor's Remote Tunnel feature.

## Scripts

### Keep-Awake Scripts

These scripts prevent your computer from sleeping, ensuring your remote tunnel stays active.

| Script | Platform | Description |
|--------|----------|-------------|
| `keep-awake-macos.sh` | macOS | Uses `caffeinate` to prevent sleep |
| `keep-awake-windows.ps1` | Windows | Uses PowerShell to simulate activity |
| `keep-awake-linux.sh` | Linux | Uses systemd-inhibit or alternatives |

### Usage

#### macOS

```bash
# Make executable (first time only)
chmod +x keep-awake-macos.sh

# Keep awake indefinitely
./keep-awake-macos.sh

# Keep awake for 8 hours
./keep-awake-macos.sh 8
```

#### Windows

```powershell
# You may need to allow script execution first
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Keep awake indefinitely
.\keep-awake-windows.ps1

# Keep awake for 8 hours
.\keep-awake-windows.ps1 -Hours 8
```

#### Linux

```bash
# Make executable (first time only)
chmod +x keep-awake-linux.sh

# Keep awake indefinitely
./keep-awake-linux.sh

# Keep awake for 8 hours
./keep-awake-linux.sh 8
```

## How They Work

### macOS (`caffeinate`)

Uses the built-in `caffeinate` command with flags:
- `-d`: Prevent display from sleeping
- `-i`: Prevent system from idle sleeping  
- `-s`: Prevent system from sleeping (on AC power)

### Windows (PowerShell)

Simulates pressing the F15 key every 60 seconds. F15 is used because:
- It prevents sleep/screensaver activation
- It doesn't interfere with normal usage
- Most keyboards don't have F15, so it's essentially a "no-op" key

### Linux

Attempts multiple methods in order of preference:
1. **systemd-inhibit** (preferred) - Blocks idle/sleep system-wide
2. **xdg-screensaver** - Resets screensaver timer periodically
3. **xdotool** - Simulates minor mouse movement
4. **caffeine-ng** - GUI app that inhibits sleep

## Quick Start Workflow

1. **Start your tunnel** in Cursor:
   ```
   Command Palette → Remote Tunnels: Turn on Remote Tunnel Access...
   ```

2. **Run the keep-awake script** for your OS:
   ```bash
   # macOS
   ./keep-awake-macos.sh
   
   # Leave terminal running in background
   ```

3. **Connect from your phone** using the tunnel URL

4. **When done**, press `Ctrl+C` in the terminal to stop the script

## Troubleshooting

### macOS: "Permission denied"

```bash
chmod +x keep-awake-macos.sh
```

### Windows: "Scripts are disabled"

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Linux: "No suitable method found"

Install one of the supported tools:

```bash
# Debian/Ubuntu
sudo apt install xdg-utils   # For xdg-screensaver
sudo apt install xdotool     # For xdotool method

# Fedora
sudo dnf install xdg-utils
sudo dnf install xdotool

# Arch
sudo pacman -S xdg-utils
sudo pacman -S xdotool
```

## Notes

- These scripts need to run in a terminal/PowerShell window
- Closing the terminal will stop the keep-awake effect
- For permanent solutions, consider:
  - **macOS**: [Amphetamine](https://apps.apple.com/app/amphetamine/id937984704) from App Store
  - **Windows**: [PowerToys Awake](https://learn.microsoft.com/en-us/windows/powertoys/awake)
  - **Linux**: Configure power settings in your desktop environment
