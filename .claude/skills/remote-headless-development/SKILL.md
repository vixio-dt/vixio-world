---
name: remote-headless-development
description: "Use when setting up remote development access, controlling Cursor from a mobile device, or troubleshooting tunnel connectivity issues"
---

# Remote Headless Development

## Overview

Control your Cursor IDE remotely from a mobile device using VS Code Remote Tunnels. Stream the "brain" of your desktop to your phone—use your Cursor Ultra plan without extra API keys.

## When to Use

- Setting up remote access to development environment
- Working away from primary machine
- Orchestrating AI tasks from mobile
- Troubleshooting tunnel connection issues

## Architecture

```
Desktop (Host)          Mobile (Controller)
┌─────────────┐         ┌─────────────┐
│   Cursor    │◄───────►│  PWA/Browser│
│   + Ultra   │ HTTPS   │             │
│   + Tunnel  │         │  Voice +    │
│             │         │  Touch UI   │
└─────────────┘         └─────────────┘
```

## Quick Setup

### 1. Enable Tunnel (Desktop)

```
Command Palette (Ctrl/Cmd + Shift + P)
→ Remote Tunnels: Turn on Remote Tunnel Access...
→ Authenticate with GitHub
→ Name machine (e.g., "DevBase")
→ Copy URL: https://vscode.dev/tunnel/[name]
```

### 2. Install PWA (Mobile)

| Platform | Steps |
|----------|-------|
| iOS | Share → Add to Home Screen |
| Android | Menu (⋮) → Install App |

### 3. Navigate Without Keyboard

```
☰ (Hamburger Menu)
→ View → Command Palette
→ "Cursor: Open Composer"
```

## Mobile Workflow

| Action | How |
|--------|-----|
| Open Composer | Command Palette → "Cursor: Open Composer" |
| Run Terminal | ☰ → Terminal → New Terminal |
| Input Commands | Use voice dictation (microphone button) |
| Accept Changes | Tap "Accept All" in Composer |

## Keeping Desktop Awake

**The tunnel dies if desktop sleeps.**

| OS | Solution |
|----|----------|
| macOS | `caffeinate -d -i -s` or Amphetamine app |
| Windows | PowerToys Awake or Power Settings → Never |
| Linux | `systemd-inhibit --what=idle sleep infinity` |

Helper scripts available: `scripts/remote-dev/keep-awake-*.sh`

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Can't connect | Verify Cursor running; restart tunnel |
| Missing modifier keys | Tap floating circle at screen bottom |
| Blurry UI | Use Command Palette instead of sidebar |
| Auth expired | Command Palette → Remote Tunnels: Sign In |

## Security Notes

- Tunnels use HTTPS encryption
- GitHub OAuth provides authentication
- Stop when not in use: `Remote Tunnels: Turn off Remote Tunnel Access`

## Related Documentation

- [Full Setup Guide](/docs/remote-headless-development.md)
- [Helper Scripts](/scripts/remote-dev/README.md)
