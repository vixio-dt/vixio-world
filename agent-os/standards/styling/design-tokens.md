# Design Tokens

## Colors

| Role | Light | Dark | Usage |
|------|-------|------|-------|
| Primary | `sky-500` | `sky-500` | Buttons, links, active states |
| Primary Hover | `sky-600` | `sky-400` | Button hover |
| Secondary | `amber-100` | `amber-200` | Highlights, accents |
| Neutral | `slate-*` | `slate-*` | Text, backgrounds, borders |

## Text Colors

```tsx
// Headings
className="text-slate-900 dark:text-white"

// Body text
className="text-slate-600 dark:text-slate-300"

// Muted/secondary
className="text-slate-500 dark:text-slate-400"
```

## Backgrounds

```tsx
// Page background
className="bg-slate-50 dark:bg-slate-900"

// Card/surface
className="bg-white dark:bg-slate-800"

// Hover states
className="hover:bg-slate-100 dark:hover:bg-slate-800"
```

## Borders

```tsx
className="border border-slate-200 dark:border-slate-700"
```

## Typography

| Role | Font | Class |
|------|------|-------|
| Headings | Space Grotesk | `font-display` |
| Body | Inter | `font-body` (default) |
| Code | JetBrains Mono | `font-mono` |

Fonts loaded via Google Fonts in `index.css`.
