# Remote Headless Development Center

> **Use your Cursor Ultra plan remotely without paying for extra API keys.** Stream the "Brain" of your desktop Cursor instance to your phone browser.

This guide enables you to control your full development environment from a mobile device, effectively creating a "development team" that you can orchestrate from anywhere.

## Overview

```
┌─────────────────┐         ┌─────────────────┐
│   Your Desktop  │ ◄─────► │   Your Phone    │
│   (The Host)    │ Tunnel  │ (The Controller)│
│                 │         │                 │
│  ┌───────────┐  │         │  ┌───────────┐  │
│  │  Cursor   │  │         │  │  PWA App  │  │
│  │  Ultra    │  │         │  │  Browser  │  │
│  │  + AI     │  │         │  │           │  │
│  └───────────┘  │         │  └───────────┘  │
└─────────────────┘         └─────────────────┘
```

## Prerequisites

- **Desktop:** Cursor IDE with Ultra subscription
- **Mobile:** Modern smartphone with Chrome (Android) or Safari (iOS)
- **Network:** Both devices connected to the internet
- **Account:** GitHub account for authentication

---

## Phase 1: Desktop Setup (The Host)

Your computer acts as the server. It must remain **on** and connected to the internet.

### Step 1: Enable Remote Tunnel Access

1. **Open Cursor** on your desktop
2. **Open the Command Palette:**
   - Windows/Linux: `Ctrl + Shift + P`
   - macOS: `Cmd + Shift + P`
3. **Type and select:** `Remote Tunnels: Turn on Remote Tunnel Access...`

### Step 2: Authenticate with GitHub

1. A dialog will appear asking you to sign in with GitHub
2. Click **"Allow"** to open the authentication page
3. Complete the GitHub OAuth flow
4. Return to Cursor once authenticated

### Step 3: Name Your Machine

1. Enter a short, memorable name (e.g., `DevBase`, `WorkStation`, `HomePC`)
2. This name will be part of your access URL

### Step 4: Get Your Access Link

Once active, the output terminal will display:

```
*
* Visual Studio Code Server
*
* By using the software, you agree to
* the Visual Studio Code Server License Terms (https://aka.ms/vscode-server-license) and
* the Microsoft Privacy Statement (https://privacy.microsoft.com/en-US/privacystatement).
*
* Server started on: https://vscode.dev/tunnel/DevBase
*
```

**Copy this URL** - this is your remote access point.

> **Note:** Cursor uses the underlying VS Code tunnel technology. The `vscode.dev` domain is expected.

---

## Phase 2: Mobile Setup (The Controller)

Transform the browser experience into an "App" to maximize screen real estate.

### Step 1: Access the Tunnel

1. Open the tunnel URL on your phone's browser
2. Use **Chrome** on Android or **Safari** on iOS for best PWA support
3. Authenticate with the same GitHub account used on desktop

### Step 2: Install as Progressive Web App (Crucial)

#### iOS (Safari)

1. Tap the **Share** button (square with upward arrow)
2. Scroll down in the share sheet
3. Tap **"Add to Home Screen"**
4. Name it (e.g., "Dev Center")
5. Tap **"Add"**

#### Android (Chrome)

1. Tap the **three-dot menu** (⋮) in the top right
2. Tap **"Install App"** or **"Add to Home Screen"**
3. Confirm the installation

### Step 3: Launch the PWA

1. Close the browser completely
2. Find the new icon on your home screen
3. Open it - you now have a full-screen IDE without browser chrome

---

## Phase 3: Orchestrating Your "Team" (Mobile Workflow)

The mobile interface is compact. Here's how to effectively control the AI.

### Accessing the Command Palette Without a Keyboard

Since you don't have physical keys:

1. Tap the **Hamburger Menu** (☰) at the top left
2. Navigate to **View** → **Command Palette**
3. Or use the keyboard shortcut `F1` if you have a virtual keyboard

### The "Manager" Workflow

Once the Composer pane is open, treat it as your "Employee":

#### 1. Dictate, Don't Type

Use your phone's microphone button on the keyboard for efficient input:

```
Example prompts:

"Scan the project. Create a new API endpoint for user login in auth.ts. 
Handle errors gracefully."

"Review the code in components/Header.tsx and suggest performance 
improvements."

"Write unit tests for the utils/validation.ts module."
```

#### 2. Reviewing Generated Code

- The Agent will generate code in the Composer view
- Tap **"Accept All"** or **"Apply"** to accept changes
- Files are saved to your desktop immediately (they're running there!)

#### 3. Running Terminal Commands

1. Menu → **Terminal** → **New Terminal**
2. Terminal appears at the bottom of the screen
3. Run commands to verify the Agent's work:

```bash
npm run test
npm run lint
npm run build
```

### Essential Command Palette Actions

| Action | Command |
|--------|---------|
| Open Composer | `Cursor: Open Composer` |
| Open Chat | `Cursor: Open Chat` |
| Edit Selection | `Cursor: Edit in Cursor` |
| Quick Fix | `Cursor: Quick Fix` |
| Generate Code | `Cursor: Generate` |

---

## Phase 4: Optimization & Troubleshooting

### Keeping the Desktop Awake

If your desktop sleeps, the connection dies.

#### macOS

**Option 1: Amphetamine (Recommended)**
- Free app from the Mac App Store
- Configure to keep awake indefinitely or on schedule

**Option 2: Terminal Command**
```bash
# Prevent sleep (run in terminal, keep terminal open)
caffeinate -d -i -s
```

**Option 3: System Settings**
- System Settings → Displays → Advanced → Never turn display off

#### Windows

**Option 1: PowerToys Awake (Recommended)**
- Install from Microsoft PowerToys
- Click the coffee cup icon in system tray
- Select "Keep awake indefinitely"

**Option 2: Power Settings**
1. Settings → System → Power & battery
2. Set "Screen and sleep" to **Never**

**Option 3: PowerShell Script**
```powershell
# Run this script to prevent sleep
Add-Type -AssemblyName System.Windows.Forms
while ($true) {
    [System.Windows.Forms.SendKeys]::SendWait("{F15}")
    Start-Sleep -Seconds 60
}
```

#### Linux

```bash
# Using systemd-inhibit
systemd-inhibit --what=idle --who="Remote Dev" --why="Tunnel Active" sleep infinity

# Or using xdg-screensaver
xdg-screensaver reset  # Run periodically via cron
```

### Fixing Blurry AI Panes

Sometimes Cursor-specific UI elements don't render perfectly on mobile web.

**Workaround:** If the sidebar Chat is buggy, rely on the **Command Palette** (`F1`) to trigger specific AI actions.

### The Emergency Keyboard

If you need `Esc`, `Ctrl`, or `Tab` and the mobile keyboard doesn't have them:

1. Look for a **floating circle** or small bar at the bottom of the interface
2. Tap it to reveal virtual modifier keys:
   - `Ctrl`
   - `Alt`
   - `Tab`
   - `Esc`
   - Arrow keys

### Connection Issues

| Problem | Solution |
|---------|----------|
| Tunnel disconnects frequently | Check desktop's internet stability; use wired connection if possible |
| "Cannot connect to tunnel" | Verify desktop Cursor is still running; restart tunnel if needed |
| Slow response | Close unused tabs on mobile; reduce background apps |
| Authentication expired | Re-authenticate via Command Palette: `Remote Tunnels: Sign In` |

---

## Phase 5: Advanced Workflows

### Multi-File Orchestration

Leverage the AI to work across multiple files:

```
"I need to implement a user authentication system. Create:
1. A login form component in components/auth/LoginForm.tsx
2. An auth service in lib/services/auth.ts  
3. API route handlers in app/api/auth/route.ts
4. Types in lib/types/auth.ts

Use best practices for security and error handling."
```

### Code Review Mode

Use your phone for reviewing PRs:

1. Open the Source Control view (Menu → View → Source Control)
2. Navigate to changed files
3. Ask the AI: "Review this diff and suggest improvements"

### Debugging Assistance

```
"I'm getting this error: [paste error message]. 
Analyze the stack trace and suggest fixes."
```

---

## Quick Reference Card

### Essential Shortcuts

| Action | Mobile Path |
|--------|-------------|
| Command Palette | ☰ → View → Command Palette |
| Open Composer | Command Palette → "Cursor: Open Composer" |
| New Terminal | ☰ → Terminal → New Terminal |
| File Explorer | ☰ → View → Explorer |
| Search Files | Command Palette → "Go to File" |

### Workflow Summary

```
1. Desktop: Leave running with Tunnel active
2. Phone: Open the PWA
3. Action: Open Command Palette → Open Composer
4. Command: "Build me a landing page"
5. Result: Cursor Ultra generates code on your desktop
```

---

## Security Considerations

- **GitHub Authentication:** The tunnel requires GitHub authentication, adding a layer of security
- **Network:** Traffic is encrypted via HTTPS
- **Session Timeout:** Consider manually stopping the tunnel when not in use
- **Shared Computers:** Don't enable tunnels on shared or public computers

To stop the tunnel:
```
Command Palette → Remote Tunnels: Turn off Remote Tunnel Access
```

---

## Related Resources

- [VS Code Remote Tunnels Documentation](https://code.visualstudio.com/docs/remote/tunnels)
- [Cursor Documentation](https://cursor.sh/docs)
- [PowerToys Awake](https://learn.microsoft.com/en-us/windows/powertoys/awake)
- [Amphetamine for macOS](https://apps.apple.com/app/amphetamine/id937984704)
