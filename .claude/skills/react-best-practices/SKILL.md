---
name: react-best-practices
description: React and Next.js performance optimization guidelines from Vercel Engineering. This skill should be used when writing, reviewing, or refactoring React/Next.js code to ensure optimal performance patterns. Triggers on tasks involving React components, Next.js pages, data fetching, bundle optimization, or performance improvements.
license: MIT
metadata:
  author: vercel
  version: "1.0.0"
---

# React & Next.js Best Practices

Comprehensive performance optimization guide for React and Next.js applications, maintained by Vercel. Contains 57 rules across 8 categories, prioritized by impact to guide automated refactoring and code generation.

## When to Apply

Reference these guidelines when:
- Writing new React components or Next.js pages
- Implementing data fetching (client or server-side)
- Reviewing code for performance issues
- Refactoring existing React/Next.js code
- Optimizing bundle size or load times

## Rule Categories by Priority

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | Eliminating Waterfalls | CRITICAL | `async-` |
| 2 | Bundle Size Optimization | CRITICAL | `bundle-` |
| 3 | Server-Side Performance | HIGH | `server-` |
| 4 | Client-Side Data Fetching | MEDIUM-HIGH | `client-` |
| 5 | Re-render Optimization | MEDIUM | `rerender-` |
| 6 | Rendering Performance | MEDIUM | `rendering-` |
| 7 | JavaScript Performance | LOW-MEDIUM | `js-` |
| 8 | Advanced Patterns | LOW | `advanced-` |

## Critical Rules

### 1. Eliminating Waterfalls (CRITICAL)

#### Parallel fetch with Promise.all
```typescript
// ❌ Bad: Sequential fetches (waterfall)
async function getData() {
  const user = await fetchUser();
  const posts = await fetchPosts();
  const comments = await fetchComments();
  return { user, posts, comments };
}

// ✅ Good: Parallel fetches
async function getData() {
  const [user, posts, comments] = await Promise.all([
    fetchUser(),
    fetchPosts(),
    fetchComments(),
  ]);
  return { user, posts, comments };
}
```

#### Use Suspense for streaming
```tsx
// ❌ Bad: Block entire page for data
export default async function Page() {
  const data = await fetchSlowData();
  return <SlowComponent data={data} />;
}

// ✅ Good: Stream with Suspense
export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <SlowComponent />
    </Suspense>
  );
}

async function SlowComponent() {
  const data = await fetchSlowData();
  return <div>{data}</div>;
}
```

### 2. Bundle Size Optimization (CRITICAL)

#### Import directly, avoid barrel files
```typescript
// ❌ Bad: Barrel import pulls entire library
import { Button, Input } from '@/components';

// ✅ Good: Direct imports
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
```

#### Dynamic imports for heavy components
```tsx
// ❌ Bad: Always loads heavy component
import HeavyChart from '@/components/HeavyChart';

// ✅ Good: Load only when needed
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false, // If not needed on server
});
```

#### Defer third-party scripts
```tsx
// ❌ Bad: Blocks hydration
import { Analytics } from '@vercel/analytics';

export default function Layout({ children }) {
  return (
    <>
      <Analytics />
      {children}
    </>
  );
}

// ✅ Good: Load after hydration
'use client';
import { useEffect, useState } from 'react';

export function DeferredAnalytics() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  return <Analytics />;
}
```

### 3. Server-Side Performance (HIGH)

#### Authenticate server actions
```typescript
// ❌ Bad: No auth check
'use server';
export async function deleteCharacter(id: string) {
  await db.characters.delete({ where: { id } });
}

// ✅ Good: Always verify auth
'use server';
import { auth } from '@/lib/auth';

export async function deleteCharacter(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');
  
  // Verify ownership
  const character = await db.characters.findUnique({ where: { id } });
  if (character?.userId !== session.user.id) {
    throw new Error('Forbidden');
  }
  
  await db.characters.delete({ where: { id } });
}
```

#### Use React.cache() for deduplication
```typescript
// ❌ Bad: Duplicate fetches in same render
async function Header() {
  const user = await fetchUser(); // Fetch 1
  return <div>{user.name}</div>;
}

async function Sidebar() {
  const user = await fetchUser(); // Fetch 2 (duplicate!)
  return <div>{user.email}</div>;
}

// ✅ Good: Deduplicated with cache()
import { cache } from 'react';

const getUser = cache(async () => {
  return await fetchUser();
});

async function Header() {
  const user = await getUser(); // Fetch 1
  return <div>{user.name}</div>;
}

async function Sidebar() {
  const user = await getUser(); // Reuses Fetch 1
  return <div>{user.email}</div>;
}
```

#### Minimize client component props
```tsx
// ❌ Bad: Passing entire object to client
<ClientComponent user={user} /> // user has 50 fields

// ✅ Good: Pass only what's needed
<ClientComponent 
  userName={user.name} 
  userAvatar={user.avatar} 
/>
```

### 4. Re-render Optimization (MEDIUM)

#### Don't subscribe to state only used in callbacks
```tsx
// ❌ Bad: Subscribes to items, rerenders on every change
function List({ items }) {
  const [items, setItems] = useState([]);
  
  const handleClick = () => {
    console.log(items.length); // Only used in callback
  };
  
  return <button onClick={handleClick}>Log count</button>;
}

// ✅ Good: Use ref for callback-only values
function List() {
  const itemsRef = useRef([]);
  
  const handleClick = () => {
    console.log(itemsRef.current.length);
  };
  
  return <button onClick={handleClick}>Log count</button>;
}
```

#### Use functional setState for stable callbacks
```tsx
// ❌ Bad: Callback recreated when count changes
function Counter() {
  const [count, setCount] = useState(0);
  
  const increment = useCallback(() => {
    setCount(count + 1); // Depends on count
  }, [count]);
  
  return <ExpensiveChild onClick={increment} />;
}

// ✅ Good: Stable callback with functional update
function Counter() {
  const [count, setCount] = useState(0);
  
  const increment = useCallback(() => {
    setCount(c => c + 1); // No external dependency
  }, []);
  
  return <ExpensiveChild onClick={increment} />;
}
```

#### Derive state during render, not effects
```tsx
// ❌ Bad: Effect for derived state
function FilteredList({ items, filter }) {
  const [filtered, setFiltered] = useState([]);
  
  useEffect(() => {
    setFiltered(items.filter(i => i.includes(filter)));
  }, [items, filter]);
  
  return <ul>{filtered.map(i => <li key={i}>{i}</li>)}</ul>;
}

// ✅ Good: Derive during render
function FilteredList({ items, filter }) {
  const filtered = useMemo(
    () => items.filter(i => i.includes(filter)),
    [items, filter]
  );
  
  return <ul>{filtered.map(i => <li key={i}>{i}</li>)}</ul>;
}
```

### 5. Rendering Performance (MEDIUM)

#### Use ternary, not && for conditionals
```tsx
// ❌ Bad: Can render "0" or "false"
{count && <Badge count={count} />}
{isAdmin && <AdminPanel />}

// ✅ Good: Explicit ternary
{count > 0 ? <Badge count={count} /> : null}
{isAdmin ? <AdminPanel /> : null}
```

#### Extract static JSX outside components
```tsx
// ❌ Bad: Recreated every render
function Card({ title }) {
  const footer = <div className="footer">© 2024</div>;
  return (
    <div>
      <h1>{title}</h1>
      {footer}
    </div>
  );
}

// ✅ Good: Static JSX hoisted
const footer = <div className="footer">© 2024</div>;

function Card({ title }) {
  return (
    <div>
      <h1>{title}</h1>
      {footer}
    </div>
  );
}
```

### 6. JavaScript Performance (LOW-MEDIUM)

#### Use Set/Map for O(1) lookups
```typescript
// ❌ Bad: O(n) lookup
const selectedIds = ['a', 'b', 'c'];
const isSelected = (id: string) => selectedIds.includes(id);

// ✅ Good: O(1) lookup
const selectedIds = new Set(['a', 'b', 'c']);
const isSelected = (id: string) => selectedIds.has(id);
```

#### Return early from functions
```typescript
// ❌ Bad: Deep nesting
function processUser(user) {
  if (user) {
    if (user.isActive) {
      if (user.hasPermission) {
        // ... actual logic
      }
    }
  }
}

// ✅ Good: Early returns
function processUser(user) {
  if (!user) return;
  if (!user.isActive) return;
  if (!user.hasPermission) return;
  
  // ... actual logic
}
```

## Quick Reference Checklist

- [ ] No sequential awaits for independent fetches
- [ ] Heavy components use dynamic imports
- [ ] Direct imports, no barrel files
- [ ] Server actions verify authentication
- [ ] React.cache() for shared async data
- [ ] Minimal props passed to client components
- [ ] useCallback with functional setState
- [ ] useMemo for expensive derived state
- [ ] Set/Map for frequent lookups
- [ ] Early returns for cleaner logic

## References

- https://nextjs.org/docs
- https://react.dev/reference/react
- https://vercel.com/blog
