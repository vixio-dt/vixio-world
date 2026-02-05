# Tunnel Setup Checklist

One-time setup to enable remote access to your Cursor instance.

## Prerequisites

- [ ] Cursor installed and working
- [ ] GitHub account (for tunnel authentication)
- [ ] Desktop can stay powered on (not sleep)

## Desktop Setup (One Time)

### 1. Enable Remote Tunnels in Cursor

```
1. Open Cursor
2. Press Cmd+Shift+P (Mac) or Ctrl+Shift+P (Windows)
3. Type: "Remote Tunnels: Turn on Remote Tunnel Access"
4. Select it and press Enter
5. Sign in with GitHub when prompted
6. Authorize the tunnel access
```

### 2. Name Your Machine

When prompted, give your machine a memorable name like:
- `desktop-home`
- `dev-machine`
- `cursor-main`

This name appears when connecting from mobile.

### 3. Verify Tunnel is Active

Look for the tunnel indicator in Cursor's bottom-left status bar:
- **Green remote icon** = Tunnel active
- **No icon** = Tunnel not running

### 4. Set Up Keep-Awake Script

**Windows:**
```powershell
# Run in PowerShell (as Administrator recommended)
powershell -ExecutionPolicy Bypass -File scripts/remote-dev/keep-awake-windows.ps1
```

**Optional: Run at Startup**
1. Press `Win+R`, type `shell:startup`
2. Create shortcut to `keep-awake-windows.ps1`
3. Right-click shortcut → Properties → Target:
   ```
   powershell -ExecutionPolicy Bypass -WindowStyle Minimized -File "C:\path\to\keep-awake-windows.ps1" -Silent
   ```

## Network Requirements

| Direction | Port | Purpose |
|-----------|------|---------|
| Outbound | 443 | Tunnel connection to Microsoft |
| Outbound | 443 | GitHub authentication |

No inbound ports needed - tunnel uses outbound connections only.

## Security Notes

- Tunnel is encrypted end-to-end (HTTPS)
- Only you can connect (GitHub authentication)
- Tunnel access can be revoked anytime
- No ports opened on your firewall

## Verification Checklist

After setup, verify everything works:

- [ ] Tunnel shows as active in Cursor status bar
- [ ] Keep-awake script running (if needed)
- [ ] Can access vscode.dev from mobile
- [ ] Your machine appears in the tunnel list
- [ ] Can open files and use terminal remotely

## Revoking Access

If you need to disable remote access:

```
1. Cursor → Cmd+Shift+P
2. "Remote Tunnels: Turn off Remote Tunnel Access"
3. Or: Sign out of GitHub in tunnel settings
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Turn on" option missing | Update Cursor to latest version |
| GitHub auth fails | Try signing out/in of GitHub in Cursor |
| Machine not appearing | Restart tunnel (turn off then on) |
| Tunnel disconnects | Check internet, run keep-awake script |
| Firewall blocking | Allow Cursor outbound on port 443 |
