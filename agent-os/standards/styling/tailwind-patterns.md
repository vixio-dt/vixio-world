# Tailwind Patterns

## Class Merging

Always use `cn()` for conditional classes:

```tsx
import { cn } from '@/lib/utils'

className={cn(
  'base-classes',
  condition && 'conditional-classes',
  className  // Allow override
)}
```

## Spacing Scale

- `p-3`, `p-4` — Standard padding
- `gap-3`, `gap-4` — Grid/flex gaps
- `space-y-4`, `space-y-6` — Vertical stacking
- `mb-6` — Section margins

## Border Radius

- `rounded-xl` — Cards, modals
- `rounded-lg` — Buttons, inputs
- `rounded-full` — Avatars, badges

## Common Patterns

### Card

```tsx
className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
```

### Hoverable Card

```tsx
className="hover:border-sky-500 dark:hover:border-sky-500 cursor-pointer transition-colors"
```

### Button Primary

```tsx
className="bg-sky-500 hover:bg-sky-600 text-white rounded-lg px-4 py-2"
```

### Input

```tsx
className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700"
```

## Responsive Breakpoints

- `lg:` — Desktop sidebar (1024px+)
- `md:` — Tablet grid changes (768px+)
- Mobile-first: base styles are mobile

## Transitions

```tsx
className="transition-colors"  // Color changes
className="transition-all duration-200"  // Multiple properties
```
