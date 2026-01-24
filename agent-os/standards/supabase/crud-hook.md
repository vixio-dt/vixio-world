# Supabase CRUD Hook

## Usage

```tsx
const { data, loading, error, create, update, remove, getById, refresh } = useSupabaseCRUD<Entity>({
  table: 'table_name',
  worldScoped: true,  // default: true
  orderBy: { column: 'name', ascending: true },
  filter: { column: 'type', value: 'active' }
})
```

## World Scoping

By default, all queries filter by `currentWorld.id`:

```tsx
// This is automatic when worldScoped: true
query.eq('world_id', currentWorld.id)
```

Set `worldScoped: false` for tables without `world_id` (e.g., `worlds` table itself).

## CRUD Operations

```tsx
// Create - world_id added automatically
const newItem = await create({ name: 'New', type: 'category' })

// Update by ID
const updated = await update(id, { name: 'Updated' })

// Delete by ID
const success = await remove(id)

// Get single item
const item = await getById(id)

// Refresh list
await refresh()
```

## Return Values

- `create`: Returns created item or `null` on error
- `update`: Returns updated item or `null` on error
- `remove`: Returns `boolean` success
- `getById`: Returns item or `null`

## State Updates

The hook auto-updates local state after mutations:

- `create`: Prepends to `data` array
- `update`: Replaces item in `data` array
- `remove`: Filters item from `data` array

## Single Item Hook

For fetching with relations:

```tsx
const { item, loading, error, refresh } = useSupabaseItem<EntityWithRelations>(
  'table_name',
  id,
  '*, related_table(*)'  // Supabase select syntax
)
```
