# Remote Development Helper Scripts

Scripts to prevent desktop sleep while running Cursor remote tunnels.

## Scripts

| Script | Platform | Method |
|--------|----------|--------|
| `keep-awake-macos.sh` | macOS | `caffeinate` command |
| `keep-awake-windows.ps1` | Windows | Simulates F15 key |
| `keep-awake-linux.sh` | Linux | systemd-inhibit or alternatives |

## Usage

### macOS
```bash
chmod +x keep-awake-macos.sh
./keep-awake-macos.sh        # Indefinite
./keep-awake-macos.sh 8      # 8 hours
```

### Windows
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\keep-awake-windows.ps1           # Indefinite
.\keep-awake-windows.ps1 -Hours 8  # 8 hours
```

### Linux
```bash
chmod +x keep-awake-linux.sh
./keep-awake-linux.sh        # Indefinite
./keep-awake-linux.sh 8      # 8 hours
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| macOS: Permission denied | `chmod +x keep-awake-macos.sh` |
| Windows: Scripts disabled | `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` |
| Linux: No method found | `sudo apt install xdg-utils` or `xdotool` |

## GUI Alternatives

For permanent solutions:
- **macOS**: [Amphetamine](https://apps.apple.com/app/amphetamine/id937984704)
- **Windows**: [PowerToys Awake](https://learn.microsoft.com/en-us/windows/powertoys/awake)
- **Linux**: Desktop environment power settings

## Related

- [Full Setup Guide](/docs/remote-headless-development.md)
- [Skill Reference](/.claude/skills/remote-headless-development/SKILL.md)
