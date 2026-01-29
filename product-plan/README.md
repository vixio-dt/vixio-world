# Vixio Worldbuilder - Product Documentation

This folder contains product vision, strategy, and implementation specs for Vixio Worldbuilder.

## Core Concept

**Visual Asset-Driven Creative Platform**

> Assets are not attachments. Assets are the organizing metaphor.

---

## Start Here

1. **[product-overview.md](./product-overview.md)** - What the product is and does
2. **[vision.md](./vision.md)** - Company vision and how Worldbuilder fits
3. **[product-philosophy.md](./product-philosophy.md)** - Soft vs hard worldbuilding approach

## Strategy & Research

- **[mission.md](./mission.md)** - Problem, target users, solution
- **[competitive-analysis.md](./competitive-analysis.md)** - Market research, pain points to exploit
- **[roadmap.md](./roadmap.md)** - Development phases and priorities

## Regional Markets

- **[markets/apac-regional.md](./markets/apac-regional.md)** - China, Japan, Korea (data residency, localization, integrations)

## Feature Designs

- **[features/import-design.md](./features/import-design.md)** - Import feature (central)
- **[features/visualization-design.md](./features/visualization-design.md)** - Node-based visualization
- **[features/export-design.md](./features/export-design.md)** - Production export (differentiator)

## Implementation Specs

Located in `sections/`, `shell/`, `data-model/` folders.

---

## Quick Reference

### Core Differentiator

| Other Tools | Vixio |
|-------------|-------|
| Text-first (wiki entries) | Visual asset-first |
| Script-first (production) | Asset-driven production |
| Isolated files (storyboards) | Connected assets |

### Target Markets

| Market | Status |
|--------|--------|
| Worldbuilding (writers) | Primary |
| Live-action production | Secondary |
| APAC Animation | Emerging |

### Phase Summary

| Phase | Focus |
|-------|-------|
| 1 | Foundation - Asset management, basic AI |
| 2 | Import & Soft worldbuilding |
| 3 | Visualization - Node maps, timeline |
| 4 | Production Export - Screenplay, shot lists |
| 5 | AI Storyboard Generation |
| 6+ | Animation exports, localization, collaboration |

---

## Folder Structure

```
product-plan/
├── README.md                    # This file
├── product-overview.md          # What it is
├── vision.md                    # Company vision
├── mission.md                   # Problem/solution
├── product-philosophy.md        # Soft/hard approach
├── competitive-analysis.md      # Market research
├── roadmap.md                   # Phases
├── markets/
│   └── apac-regional.md         # China, Japan, Korea regional
├── features/
│   ├── import-design.md         # Import spec
│   ├── visualization-design.md  # Node visualization spec
│   └── export-design.md         # Production export spec
├── sections/                    # Implementation specs per section
├── shell/                       # Shell/navigation specs
└── data-model/                  # Database schema
```

---

## Status

**Draft** - 2026-01-28

This documentation captures the product vision after brainstorming sessions. Ready for implementation planning.
