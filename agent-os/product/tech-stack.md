# Tech Stack

## Frontend

- React 19 with TypeScript
- Tailwind CSS v4 for styling
- Vite 6 for build tooling
- React Router v7 for routing
- Lucide React for icons
- Radix UI for accessible components

### Additional Frontend (to add)
- `ai` (Vercel AI SDK) - React hooks for streaming chat UI
- `@tiptap/react` - Rich text editor for screenplay/script editing
- `@react-pdf/renderer` - PDF export generation

## Backend

- Supabase (PostgreSQL, Auth, Realtime, Storage)
- Supabase Edge Functions (Deno) - Server-side AI API calls

### AI Integration
- **OpenRouter** - Unified API gateway to multiple AI models
- Called via Supabase Edge Functions (keeps API keys secure, bypasses geo-restrictions)

**Recommended Models**:
| Task | Model | Why |
|------|-------|-----|
| World Chat | Claude 3.5 Sonnet | Best creative writing, long context |
| Document Parsing | GPT-4o | Fast structured extraction |
| Consistency Check | Claude 3.5 Sonnet | Better reasoning for rules |
| Budget fallback | Llama 3.1 70B | 10x cheaper, decent quality |

### Document Processing (to add)
- `pdf-parse` - PDF text extraction
- `mammoth` - DOCX parsing

## Design System

- Primary: Sky (#0ea5e9)
- Secondary: Cream
- Neutral: Slate
- Fonts: Space Grotesk (headings), Inter (body), JetBrains Mono (code)

## Deployment

- Railway.app (frontend static hosting)
- Supabase (backend, edge functions, storage)

## Architecture

```
┌─────────────────┐     ┌──────────────────────┐     ┌─────────────┐
│  React Frontend │────▶│ Supabase             │────▶│ OpenRouter  │
│  (Vite/Railway) │     │ - PostgreSQL         │     │ (AI Models) │
│                 │◀────│ - Auth               │◀────│             │
│                 │     │ - Edge Functions     │     └─────────────┘
│                 │     │ - Storage            │
└─────────────────┘     └──────────────────────┘
```
