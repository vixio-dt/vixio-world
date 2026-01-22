# Application Shell Specification

## Overview

The Vixio Worldbuilder shell provides a collapsible sidebar navigation pattern optimized for a complex worldbuilding tool with 10 sections. It includes a world switcher for multi-world support, grouped navigation items, a user menu with Supabase auth, and a floating World Chat button for AI assistance.

## Navigation Structure

### Primary Navigation (Sidebar)

- **World Switcher** (top) - Dropdown to switch between user's worlds
- **Dashboard** - World overview and stats

**World Elements Group:**
- Characters - People, creatures, entities
- Locations - Places and environments
- Organizations - Factions and groups
- Timeline - Events, history, and node-based graph view for time loops/paradoxes
- Items - Props and artifacts
- Rules - World laws and constraints

**Storytelling Group:**
- Stories - Narratives with scenes and shots
- Export - Production outputs

**Footer:**
- Settings (optional)
- User Menu - Avatar, name, sign out (Supabase auth)

### World Chat (Floating)

- Floating action button in bottom-right corner
- Opens slide-up chat panel when clicked
- Persists across all sections
- Can be minimized back to button

## Layout Pattern

**Collapsible Sidebar Navigation:**

| State | Width | Behavior |
|-------|-------|----------|
| Expanded | 256px | Full labels + icons |
| Collapsed | 64px | Icons only with tooltips |
| Mobile | Hidden | Hamburger opens slide-out drawer |

## Responsive Behavior

- **Desktop (>1024px):** Sidebar visible, user can toggle collapsed/expanded
- **Tablet (768-1024px):** Sidebar collapsed by default, expandable
- **Mobile (<768px):** Sidebar hidden, hamburger menu in header, opens as sheet overlay

## Design Tokens

### Colors (from colors.json)
- **Primary (sky):** Active nav items, World Chat button, focus rings
- **Secondary (cream):** Hover states, subtle highlights, badges
- **Neutral (slate):** Text colors, borders
- **Background:** White (light mode), slate-900 (dark mode)

### Typography (from typography.json)
- **Space Grotesk:** Nav item labels, section headers
- **Inter:** Body text, descriptions, buttons
- **JetBrains Mono:** IDs, technical content

## Component Structure

```
AppShell
+-- Sidebar
|   +-- WorldSwitcher
|   +-- NavGroup (World Elements)
|   |   +-- NavItem (x6)
|   +-- NavGroup (Storytelling)
|   |   +-- NavItem (x2)
|   +-- UserMenu
+-- MobileNav (hamburger + sheet)
+-- MainContent (children)
+-- WorldChatButton (floating)
```

## Interaction Details

### Sidebar Toggle
- Toggle button at bottom of sidebar
- Keyboard shortcut: Cmd/Ctrl + B
- State persisted in localStorage

### World Switcher
- Dropdown showing all user's worlds
- Current world highlighted
- "Create New World" option at bottom
- Shows world icon/avatar if available

### World Chat Button
- Fixed position: bottom-right, 24px from edges
- Primary (sky) background color
- Pulse animation when AI has suggestions
- Opens chat panel (400px wide, 60vh height)

### Navigation Items
- Active state: sky-500 background, white text
- Hover state: slate-100 background (light), slate-800 (dark)
- Icons from lucide-react
- Tooltips shown when sidebar collapsed

## Accessibility

- Full keyboard navigation
- ARIA labels on all interactive elements
- Focus visible indicators
- Screen reader announcements for state changes
- Reduced motion support

## Dark Mode

- Sidebar: slate-900 background
- Nav items: slate-50 text
- Active items: sky-500 background
- Borders: slate-700
