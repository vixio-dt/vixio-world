# Vixio Worldbuilder - Implementation Handoff

This package contains everything needed to implement the Vixio Worldbuilder application.

## Quick Start

1. Review `product-overview.md` for product context
2. Choose implementation approach:
   - **One-shot**: Use `prompts/one-shot-prompt.md` for full implementation
   - **Incremental**: Use `prompts/section-prompt.md` with instructions in `instructions/incremental/`

## Package Contents

```
product-plan/
├── README.md                 # This file
├── product-overview.md       # Product summary and vision
├── prompts/
│   ├── one-shot-prompt.md    # Full implementation prompt
│   └── section-prompt.md     # Section-by-section template
├── instructions/
│   ├── one-shot-instructions.md
│   └── incremental/
│       ├── 01-foundation.md
│       ├── 02-shell.md
│       ├── 03-dashboard.md
│       └── ...
├── design-system/
│   ├── colors.json
│   └── typography.json
├── data-model/
│   └── data-model.md
├── shell/
│   └── spec.md
└── sections/
    └── [section-name]/
        ├── spec.md
        ├── data.json
        └── types.ts
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19 + TypeScript + Tailwind CSS v4 |
| Backend | Supabase (PostgreSQL, Auth, Realtime, Storage) |
| Deployment | Railway.app |

## Brand

- **Logo**: `vixio-logo.svg` (cyan-to-cream gradient)
- **Primary Color**: Sky (`#48BBF1`)
- **Secondary Color**: Teal
- **Fonts**: Space Grotesk (headings), Inter (body), JetBrains Mono (code)

## Implementation Order

1. Foundation (Supabase setup, auth, base layout)
2. Shell (navigation, world switcher)
3. Dashboard
4. Characters
5. Locations
6. Rules
7. Stories/Scenes/Shots
8. Chat (AI integration)
9. Remaining sections (Organizations, Timeline, Items, Export)
