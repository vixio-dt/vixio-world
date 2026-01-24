# Layout Patterns

## App Shell

```
┌─────────────────────────────────────┐
│ Sidebar │ Main Content              │
│ (fixed) │ (scrollable)              │
│         │                           │
│ - Logo  │ ┌───────────────────────┐ │
│ - World │ │ Page Content          │ │
│ - Nav   │ │                       │ │
│ - User  │ │                       │ │
└─────────┴─┴───────────────────────┘─┘
```

## Sidebar

- Desktop: Fixed width (w-64), collapsible (w-16)
- Mobile: Hidden, replaced by mobile nav
- Toggle: `Cmd/Ctrl + B`

## Page Layout

```tsx
<div className="p-6 space-y-6">
  {/* Page header */}
  <div className="flex justify-between items-center">
    <h1 className="text-2xl font-display font-bold">Title</h1>
    <Button>Action</Button>
  </div>

  {/* Content */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {/* Cards */}
  </div>
</div>
```

## Detail Layout

```tsx
<div className="space-y-6">
  {/* Back link + actions */}
  <div className="flex justify-between items-start">
    <button onClick={() => navigate(-1)}>← Back</button>
    <div className="flex gap-2">
      <Button>Edit</Button>
      <Button variant="secondary">Delete</Button>
    </div>
  </div>

  {/* Hero/header card */}
  <Card>
    <CardContent className="p-6">
      <h1>Name</h1>
      <Badge>Type</Badge>
    </CardContent>
  </Card>

  {/* Sections grid */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <Card>Section 1</Card>
    <Card>Section 2</Card>
  </div>
</div>
```

## Empty States

Center content with clear messaging:

```tsx
<EmptyState
  icon={<Users className="h-12 w-12" />}
  title="No characters yet"
  description="Create your first character"
  action={<Button onClick={onCreate}>Create Character</Button>}
/>
```
