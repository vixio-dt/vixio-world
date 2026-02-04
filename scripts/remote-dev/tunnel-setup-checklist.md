# Remote Tunnel Setup Checklist

Use this checklist to ensure your remote development environment is properly configured.

## Desktop Setup

### Prerequisites

- [ ] Cursor IDE installed
- [ ] Cursor Ultra subscription active
- [ ] Stable internet connection
- [ ] GitHub account ready

### Tunnel Configuration

- [ ] Open Cursor
- [ ] Open Command Palette (`Ctrl/Cmd + Shift + P`)
- [ ] Search: `Remote Tunnels: Turn on Remote Tunnel Access...`
- [ ] Authenticate with GitHub when prompted
- [ ] Choose a memorable machine name
- [ ] Copy the generated URL: `https://vscode.dev/tunnel/[your-machine-name]`

### Keep-Awake Setup

- [ ] Choose your OS script from `/scripts/remote-dev/`
- [ ] Make script executable (if needed): `chmod +x keep-awake-*.sh`
- [ ] Run the keep-awake script in a terminal window
- [ ] Verify script is running (you'll see periodic status messages)

### Alternative Keep-Awake (GUI Apps)

- [ ] **macOS**: Install [Amphetamine](https://apps.apple.com/app/amphetamine/id937984704)
- [ ] **Windows**: Install [PowerToys](https://github.com/microsoft/PowerToys) and use Awake
- [ ] **Linux**: Use your desktop environment's power settings

## Mobile Setup

### Browser Configuration

- [ ] Open tunnel URL in browser (Chrome for Android, Safari for iOS)
- [ ] Sign in with same GitHub account
- [ ] Wait for connection to establish

### PWA Installation

**iOS:**
- [ ] Tap Share button (square with arrow)
- [ ] Scroll down to "Add to Home Screen"
- [ ] Tap "Add"

**Android:**
- [ ] Tap three-dot menu (⋮)
- [ ] Tap "Install App" or "Add to Home Screen"
- [ ] Confirm installation

### Verification

- [ ] Close browser completely
- [ ] Open the PWA from home screen
- [ ] Verify full-screen experience (no browser chrome)
- [ ] Open Command Palette (Menu → View → Command Palette)
- [ ] Test: Search for "Cursor: Open Composer"

## Workflow Verification

### Basic Checks

- [ ] Can open files in Explorer
- [ ] Can edit code
- [ ] Can open Terminal (Menu → Terminal → New Terminal)
- [ ] Can run commands in terminal

### AI Features

- [ ] Can open Composer
- [ ] Can send prompts to AI
- [ ] Can accept/reject AI suggestions
- [ ] Can use Chat sidebar (if available)

## Troubleshooting Reference

| Issue | Solution |
|-------|----------|
| Can't connect to tunnel | Verify Cursor is running on desktop |
| Tunnel URL not working | Re-enable tunnel in Command Palette |
| AI features not available | Verify Cursor Ultra subscription is active |
| Desktop went to sleep | Restart keep-awake script, reconnect |
| Mobile keyboard issues | Use floating modifier keys |
| Blurry/broken UI | Use Command Palette instead |

## Quick Commands Reference

| Action | How to Access |
|--------|---------------|
| Command Palette | ☰ → View → Command Palette |
| Open Composer | Command Palette → "Cursor: Open Composer" |
| Open Chat | Command Palette → "Cursor: Open Chat" |
| New Terminal | ☰ → Terminal → New Terminal |
| File Explorer | ☰ → View → Explorer |
| Source Control | ☰ → View → Source Control |

## Daily Workflow

```
1. [Desktop] Verify tunnel is active (check Cursor status bar)
2. [Desktop] Ensure keep-awake is running
3. [Mobile] Open PWA
4. [Mobile] Start Composer
5. [Mobile] Begin voice-dictated development
6. [Mobile] Review and accept changes
7. [Mobile] Run tests in terminal
8. [Both] Commit changes via Source Control
```

---

**Setup Date:** _______________

**Machine Name:** _______________

**Tunnel URL:** _______________
