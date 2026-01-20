# Vixio Worldbuilder

Pre-production worldbuilding tool for virtual production using Unreal Engine.

## Vision

Vixio is a world-first creative assistant that helps filmmakers and storytellers:
- Build consistent, detailed worlds as a creative "bible"
- Transform world elements into stories, screenplays, and storyboards
- Export production-ready specs for Unreal Engine virtual production

## Pipeline

```
World → Story → Storyboard → Screenplay → Unreal Production
```

## Core Categories

| Category | Purpose | Unreal Output |
|----------|---------|---------------|
| Characters | People, creatures, entities | MetaHuman specs |
| Locations | Places, environments, settings | Environment briefs |
| Props/Vehicles | Objects, transportation | Asset requirements |
| Events/Timeline | History, plot events | Story continuity |
| Rules/Constraints | World laws, magic systems | Consistency checking |
| Stories | Narrative containers | Treatment/outline |
| Scenes | Story breakdowns | Scene specs |
| Shots | Visual frames | Camera/shot list |

## AI Assistant Capabilities

1. **Chat with World** - Query your world like a database
2. **Story Suggestions** - Discover connections between elements
3. **Storyboard Prompts** - Generate image prompts for visualization
4. **Screenplay Generation** - Transform beats into dialogue
5. **Fill Gaps** - Flesh out underdeveloped areas
6. **Consistency Checking** - Catch contradictions and plotholes
7. **Shot Suggestions** - Cinematography recommendations

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Supabase (planned)
- **Deployment**: Railway.app (planned)
- **Production Target**: Unreal Engine 5

## Design OS Framework

This project uses the [Design OS](https://github.com/buildermethods/design-os) framework for product planning and UI design.

### Commands

| Command | Purpose |
|---------|---------|
| `/product-vision` | Define product vision |
| `/product-roadmap` | Break into sections |
| `/data-model` | Define entities |
| `/design-tokens` | Colors & typography |
| `/design-shell` | Navigation & layout |
| `/shape-section` | Section requirements |
| `/sample-data` | Generate test data |
| `/design-screen` | Create UI components |
| `/export-product` | Generate handoff |

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Open in browser
open http://localhost:5173
```

## Project Status

Currently in Design Phase - defining product vision and UI structure.

## Future Roadmap

- **Phase 1**: Personal tool for pilot short film production
- **Phase 2**: SaaS launch for global creator community
- **Phase 3**: Integrations with industry tools (Unreal Engine, Final Draft, Celtx, etc.)
- **Phase 4**: 3D asset generation and previz capabilities

---

*Built for filmmakers, writers, and worldbuilders worldwide.*
