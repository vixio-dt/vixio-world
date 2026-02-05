---
name: remote-headless-development
description: Use when you want to control Cursor from a mobile device, tablet, or remote machine without physical access to your desktop
---

# Remote Headless Development

## Overview

Control your full Cursor environment remotely using VS Code Remote Tunnels. Your desktop runs Cursor with tunnels enabled; you connect from any browser.

**Why this approach:** Keeps your Cursor subscription, MCP servers, skills, and codebase indexing intact. No extra API costs.

## Quick Start

```
1. Desktop: Run scripts/remote-dev/keep-awake-windows.ps1
2. Desktop: Cursor → Cmd+Shift+P → "Remote Tunnels: Turn on Remote Tunnel Access"
3. Mobile: Open vscode.dev → Sign in with GitHub → Select your machine
```

## Prerequisites

| Requirement | Why |
|-------------|-----|
| Cursor Pro subscription | Agent mode access |
| GitHub account | Tunnel authentication |
| Desktop always-on | Tunnel host |
| Mobile browser or PWA | Remote client |

## Architecture

```
Phone/Tablet ──HTTPS──► Your Desktop (Cursor + Tunnel + Keep-Awake)
```

All processing happens on your desktop. Mobile is just a thin client.

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/remote-dev/keep-awake-windows.ps1` | Prevents Windows sleep |
| `scripts/remote-dev/mobile-quickstart.md` | PWA setup for iOS/Android |
| `scripts/remote-dev/tunnel-setup-checklist.md` | One-time tunnel config |

## Workflow

1. **Start session**: Run keep-awake script, verify tunnel is active
2. **Connect**: Open vscode.dev on mobile, select your machine
3. **Work**: Use Cursor normally - chat, agent mode, terminal
4. **End session**: Close browser tab (tunnel stays active for next time)

## Tips

- **Install PWA**: On mobile, "Add to Home Screen" for app-like experience
- **Landscape mode**: Better for coding on tablets
- **Voice typing**: Use mobile keyboard voice input for prompts
- **Notifications**: Enable browser notifications for long-running tasks

## Limitations

- Requires stable internet on both ends
- Desktop must stay powered on
- Some keyboard shortcuts may conflict with mobile browser
- Large file previews may be slow on cellular

## Troubleshooting

| Issue | Fix |
|-------|-----|
| "Machine offline" | Check desktop isn't sleeping, restart tunnel |
| Lag/delay | Switch to WiFi, close other tabs |
| Can't connect | Re-authenticate GitHub in Cursor |
| Tunnel not showing | Cmd+Shift+P → "Remote Tunnels: Turn on..." |
