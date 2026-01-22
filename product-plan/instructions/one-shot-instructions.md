# Vixio Worldbuilder - Full Implementation Instructions

## Milestone 1: Foundation

### 1.1 Project Setup
```bash
npm create vite@latest vixio-app -- --template react-ts
cd vixio-app
npm install
npm install @supabase/supabase-js
npm install react-router-dom
npm install lucide-react
npm install tailwindcss @tailwindcss/vite
npm install clsx tailwind-merge
npm install class-variance-authority
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-tabs @radix-ui/react-avatar
```

### 1.2 Tailwind CSS v4 Configuration
Configure `index.css` with:
- Design tokens from `design-system/colors.json`
- Typography from `design-system/typography.json`
- Light and dark mode variables

### 1.3 Supabase Setup
1. Create Supabase project
2. Configure auth (email/password)
3. Create database schema from `data-model/data-model.md`
4. Set up Row Level Security policies
5. Create `src/lib/supabase.ts` client

---

## Milestone 2: Application Shell

### 2.1 Layout Components
- `AppShell.tsx` - Main wrapper with auth check
- `Sidebar.tsx` - Navigation with logo
- `WorldSwitcher.tsx` - World selection dropdown
- `UserMenu.tsx` - Profile and sign out
- `MobileNav.tsx` - Mobile sheet navigation

### 2.2 Routing
Set up React Router with routes:
- `/` - Dashboard
- `/characters`, `/characters/:id`
- `/locations`, `/locations/:id`
- `/organizations`, `/organizations/:id`
- `/timeline`, `/timeline/:id`
- `/items`, `/items/:id`
- `/rules`, `/rules/:id`
- `/stories`, `/stories/:id`
- `/chat`
- `/export`
- `/auth/login`, `/auth/signup`

### 2.3 Auth Flow
- Protected routes require authentication
- Redirect to login if not authenticated
- Persist session in localStorage

---

## Milestone 3: Dashboard

Implement from `sections/dashboard/spec.md`:
- World header with name and genre
- Stats grid with element counts
- Consistency warnings card
- Recent activity feed
- Quick add dropdown

---

## Milestone 4: Characters

Implement from `sections/characters/spec.md`:
- Character list with filters (role, species)
- Character card component
- Character detail with tabs (Overview, Background, Relationships, Production)
- Character form for create/edit
- Relationship management

---

## Milestone 5: Locations

Implement from `sections/locations/spec.md`:
- Location tree view (hierarchical)
- Location list view (flat)
- View toggle (tree/list)
- Location detail with sub-locations
- Location form with parent selector

---

## Milestone 6: Rules

Implement from `sections/rules/spec.md`:
- Rules grouped by category
- Rule card with code badge
- Rule detail with exceptions and examples
- Rule form with category selector

---

## Milestone 7: Stories

Implement from `sections/stories/spec.md`:
- Story list with status filters
- Story detail with scene list
- Scene detail with shot list
- Shot detail with visual prompt
- Nested create/edit forms

---

## Milestone 8: Chat

Implement from `sections/chat/spec.md`:
- Chat interface with message history
- Quick action buttons
- AI integration (can use Claude API or similar)
- Commands: /check, /suggest, /gaps, /connections

---

## Milestone 9: Remaining Sections

### Organizations
- Organization list and detail
- Member roster with character links
- Alliance/enemy relationships

### Timeline
- Chronological event display
- Event filtering by date range
- Causal chain visualization

### Items
- Item list with type filters
- Ownership history
- Production specs

### Export
- Export type selector
- Preview functionality
- Download handlers (JSON, MD, PDF)

---

## Testing Checklist

For each section:
- [ ] List view loads and displays data
- [ ] Filters work correctly
- [ ] Detail view shows all information
- [ ] Create form adds new records
- [ ] Edit form updates existing records
- [ ] Delete removes records
- [ ] Empty states display correctly
- [ ] Mobile responsive
- [ ] Dark mode works
