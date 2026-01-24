# Database Types

## Location

All database types in `src/types/database.ts`.

## Entity Structure

Every entity follows this pattern:

```tsx
export interface Entity {
  id: string
  world_id: string
  name: string
  // ... entity-specific fields
  created_at: string
  updated_at: string
}
```

## Nullable Fields

- Required: `id`, `world_id`, `name`, timestamps
- Optional fields: `type: string | null`
- Enums: `role: 'option1' | 'option2' | null`
- Arrays: `aliases: string[] | null`

## Database Helper Types

```tsx
export type Database = {
  public: {
    Tables: {
      entities: {
        Row: Entity
        Insert: Omit<Entity, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Entity, 'id'>>
      }
    }
  }
}
```

## Adding New Entity Types

1. Add SQL table in `supabase/schema.sql`
2. Add TypeScript interface in `src/types/database.ts`
3. Add to `Database` type
4. Enable RLS and create policies
5. Add indexes for foreign keys
