# Vixio Worldbuilder - Section Implementation Template

Use this template when implementing sections incrementally.

---

## Section: [SECTION_NAME]

### Context

I'm implementing the [SECTION_NAME] section of Vixio Worldbuilder, a worldbuilding tool for filmmakers.

### Prerequisites

- React + TypeScript + Tailwind CSS v4 project is set up
- Supabase client is configured
- Application shell is implemented
- Design tokens are applied

### Your Task

Implement the [SECTION_NAME] section following the specification in `sections/[section-name]/spec.md`.

### Reference Files

- `sections/[section-name]/spec.md` - Requirements and user flows
- `sections/[section-name]/types.ts` - TypeScript interfaces
- `sections/[section-name]/data.json` - Sample data for testing
- `data-model/data-model.md` - Entity relationships

### Requirements

1. **List View**: Display all [elements] with search and filters
2. **Detail View**: Show full [element] information with tabs
3. **Create/Edit**: Form for adding and modifying [elements]
4. **Connections**: Show relationships to other elements
5. **Empty States**: Handle no data gracefully

### Design Guidelines

- Follow the design tokens (Sky primary, Teal secondary, Slate neutral)
- Use Space Grotesk for headings
- Support dark mode with `dark:` variants
- Mobile-responsive layout

### Deliverables

- `src/pages/[SectionName].tsx` - Main section page
- `src/components/[section]/` - Section-specific components
- Supabase queries for CRUD operations
- Connected to application shell navigation

---

Copy this template and replace [SECTION_NAME] with the section you're implementing.
