# UI Component Patterns

## File Location

UI components live in `src/components/ui/`. Export via `index.ts`.

## Component Structure

```tsx
interface ComponentProps {
  children: ReactNode
  className?: string
  // other props
}

export function Component({ children, className, ...props }: ComponentProps) {
  return (
    <div className={cn('base-classes', className)}>
      {children}
    </div>
  )
}
```

## Key Rules

- Always accept `className` prop for customization
- Use `cn()` from `@/lib/utils` to merge classes
- Define props interface above component
- Export named functions, not default

## Compound Components

Group related components in one file:

```tsx
// Card.tsx
export function Card({ ... }) { }
export function CardHeader({ ... }) { }
export function CardContent({ ... }) { }
export function CardFooter({ ... }) { }
```

## Import Pattern

```tsx
import { Card, CardHeader, CardContent, Button } from '@/components/ui'
```

## Dark Mode

Include dark variants for all color classes:

```tsx
className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
```
