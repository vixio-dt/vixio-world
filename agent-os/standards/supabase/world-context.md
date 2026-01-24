# World Context

## Purpose

All app data is scoped to a "world". Users can have multiple worlds and switch between them.

## Usage

```tsx
import { useWorld } from '@/contexts/WorldContext'

function MyComponent() {
  const { 
    worlds,          // All user's worlds
    currentWorld,    // Currently selected world
    setCurrentWorld, // Switch worlds
    loading,
    refreshWorlds,
    createWorld 
  } = useWorld()
}
```

## World Switching

- Sidebar has WorldSwitcher component
- Selecting a world updates `currentWorld`
- All CRUD hooks re-fetch when world changes
- First world auto-selected if none selected

## Creating Worlds

```tsx
const newWorld = await createWorld('My World', 'Sci-Fi', 'Dark')
// Args: name (required), genre (optional), tone (optional)
```

## Guard Pattern

Components that need a world should handle the no-world state:

```tsx
if (!currentWorld) {
  return <EmptyState message="Select a world to continue" />
}
```

The `useSupabaseCRUD` hook returns empty data when no world is selected (when `worldScoped: true`).
