# Remote Headless Development

## Overview

This skill enables developers to control their full Cursor IDE environment remotely from a mobile device using VS Code Remote Tunnels. It transforms a phone into a command center for orchestrating AI-powered development workflows.

## When to Use

- Working away from your primary development machine
- Managing long-running AI tasks from your phone
- Quick code reviews or fixes while mobile
- Orchestrating complex multi-file changes via voice dictation
- Monitoring build/test processes remotely

## Core Concepts

### Architecture

```
Desktop (Host)          Mobile (Controller)
┌─────────────┐         ┌─────────────┐
│   Cursor    │◄───────►│  PWA/Browser│
│   + Ultra   │ HTTPS   │             │
│   + Tunnel  │ Tunnel  │  Voice +    │
│             │         │  Touch UI   │
└─────────────┘         └─────────────┘
```

### Key Components

1. **VS Code Remote Tunnels** - The underlying technology enabling secure remote access
2. **GitHub Authentication** - Security layer for tunnel access
3. **PWA Installation** - Transforms browser into full-screen app experience
4. **Composer/Agent** - The AI assistant for code generation and editing

## Setup Workflow

### Phase 1: Enable Tunnel (Desktop)

```
Command Palette (Ctrl/Cmd + Shift + P)
    → Remote Tunnels: Turn on Remote Tunnel Access...
    → Authenticate with GitHub
    → Name your machine (e.g., "DevBase")
    → Copy the generated URL (https://vscode.dev/tunnel/[name])
```

### Phase 2: Install PWA (Mobile)

```
iOS Safari:
    Share → Add to Home Screen → Add

Android Chrome:
    Menu (⋮) → Install App
```

### Phase 3: Mobile Navigation

Since physical keyboard shortcuts aren't available:

```
Hamburger Menu (☰)
    → View → Command Palette
    → Search: "Cursor: Open Composer"
```

## Best Practices

### Effective Mobile Prompts

Use voice dictation for complex prompts:

```
Good: "Create a REST API endpoint in app/api/users/route.ts 
       that handles GET and POST requests. Include validation 
       using zod and return appropriate error responses."

Bad:  "Make an API" (too vague for mobile context)
```

### Keep Desktop Alive

The tunnel dies if the desktop sleeps:

| OS | Solution |
|-----|----------|
| macOS | Amphetamine app or `caffeinate -d -i -s` |
| Windows | PowerToys Awake or Power Settings → Never Sleep |
| Linux | `systemd-inhibit --what=idle sleep infinity` |

### Workflow Optimization

1. **Batch operations** - Give comprehensive instructions in single prompts
2. **Use Accept All** - Review on desktop later for detailed inspection
3. **Terminal verification** - Run tests/lints after AI changes
4. **Commit frequently** - Use source control to checkpoint work

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Can't connect | Verify Cursor is running; restart tunnel |
| Blurry UI elements | Use Command Palette instead of sidebar |
| Missing modifier keys | Tap floating circle for virtual keys |
| Auth expired | Re-run tunnel authentication |

### Emergency Commands

```bash
# On desktop - restart tunnel
# Command Palette → Remote Tunnels: Turn off Remote Tunnel Access
# Command Palette → Remote Tunnels: Turn on Remote Tunnel Access...

# Check tunnel status
# Command Palette → Remote Tunnels: Show Log
```

## Integration with Other Skills

This skill complements:

- **dev-bot-agent** - Orchestrate dev-bot tasks remotely
- **verification-before-completion** - Run verification from mobile
- **test-driven-development** - Monitor test runs remotely

## Security Notes

- Tunnels use HTTPS encryption
- GitHub OAuth provides authentication
- Stop tunnel when not in use: `Remote Tunnels: Turn off Remote Tunnel Access`
- Never enable on shared/public computers

## Related Documentation

- [Full Setup Guide](/docs/remote-headless-development.md)
- [VS Code Tunnels Docs](https://code.visualstudio.com/docs/remote/tunnels)
