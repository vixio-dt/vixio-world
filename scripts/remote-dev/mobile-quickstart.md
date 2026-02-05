# Mobile Quickstart Guide

Set up your phone/tablet to control Cursor remotely in 5 minutes.

## iOS Setup (iPhone/iPad)

### Install PWA (Recommended)

1. Open **Safari** (must be Safari, not Chrome)
2. Go to `https://vscode.dev`
3. Sign in with GitHub
4. Tap Share button (box with arrow)
5. Tap **"Add to Home Screen"**
6. Name it "Cursor Remote" or similar
7. Tap **Add**

You now have an app icon that opens directly to VS Code web.

### Connect to Your Desktop

1. Open the PWA (or vscode.dev in browser)
2. Click the green button bottom-left (Remote indicator)
3. Select **"Connect to Tunnel..."**
4. Choose your desktop machine from the list
5. Wait for connection (10-30 seconds first time)

## Android Setup

### Install PWA

1. Open **Chrome**
2. Go to `https://vscode.dev`
3. Sign in with GitHub
4. Tap the three-dot menu (top right)
5. Tap **"Add to Home screen"** or **"Install app"**
6. Confirm the installation

### Connect to Your Desktop

Same as iOS - use the green Remote button bottom-left.

## Tips for Mobile Coding

### Keyboard

- **Voice typing**: Tap microphone on keyboard for prompts
- **External keyboard**: Bluetooth keyboards work great on tablets
- **Landscape mode**: More screen real estate for code

### Navigation

- **File explorer**: Swipe from left edge
- **Search**: Cmd/Ctrl+Shift+F works with external keyboard
- **Terminal**: Drag up from bottom panel

### Agent Mode

1. Open Composer (Cmd+I or click chat icon)
2. Type your prompt naturally
3. Agent mode works exactly like desktop
4. Long tasks: Enable notifications to know when done

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't find machine | Desktop tunnel may be off - check `keep-awake` script |
| Slow/laggy | Switch to WiFi, reduce open files |
| Keyboard issues | Try external Bluetooth keyboard |
| Session expired | Re-authenticate GitHub |
| PWA won't install | Must use Safari (iOS) or Chrome (Android) |

## Best Practices

1. **Charge your device** - Remote sessions use battery
2. **Use WiFi** - Cellular works but WiFi is more stable
3. **Bookmark projects** - Star frequently-used repos
4. **Enable notifications** - Know when long tasks complete
5. **Landscape for coding** - Portrait for chat/prompts
