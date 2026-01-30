---
name: supabase-postgres-best-practices
description: Postgres performance optimization and best practices from Supabase. Use this skill when writing, reviewing, or optimizing Postgres queries, schema designs, or database configurations.
license: MIT
metadata:
  author: supabase
  version: "1.1.0"
  organization: Supabase
  date: January 2026
  abstract: Comprehensive Postgres performance optimization guide for developers using Supabase and Postgres. Contains performance rules across 8 categories, prioritized by impact from critical (query performance, connection management) to incremental (advanced features). Each rule includes detailed explanations, incorrect vs. correct SQL examples, query plan analysis, and specific performance metrics to guide automated optimization and code generation.
---

# Supabase Postgres Best Practices

Comprehensive performance optimization guide for Postgres, maintained by Supabase. Contains rules across 8 categories, prioritized by impact to guide automated query optimization and schema design.

## When to Apply

Reference these guidelines when:
- Writing SQL queries or designing schemas
- Implementing indexes or query optimization
- Reviewing database performance issues
- Configuring connection pooling or scaling
- Optimizing for Postgres-specific features
- Working with Row-Level Security (RLS)

## Rule Categories by Priority

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | Query Performance | CRITICAL | `query-` |
| 2 | Connection Management | CRITICAL | `conn-` |
| 3 | Security & RLS | CRITICAL | `security-` |
| 4 | Schema Design | HIGH | `schema-` |
| 5 | Concurrency & Locking | MEDIUM-HIGH | `lock-` |
| 6 | Data Access Patterns | MEDIUM | `data-` |
| 7 | Monitoring & Diagnostics | LOW-MEDIUM | `monitor-` |
| 8 | Advanced Features | LOW | `advanced-` |

## Critical Rules

### Query Performance

#### Always use indexes for WHERE clauses
```sql
-- ❌ Bad: Full table scan
SELECT * FROM characters WHERE name = 'Alice';

-- ✅ Good: Create index first
CREATE INDEX idx_characters_name ON characters(name);
SELECT * FROM characters WHERE name = 'Alice';
```

#### Use covering indexes for frequently accessed columns
```sql
-- ❌ Bad: Index lookup + table fetch
CREATE INDEX idx_characters_name ON characters(name);
SELECT name, world_id FROM characters WHERE name = 'Alice';

-- ✅ Good: Covering index includes all needed columns
CREATE INDEX idx_characters_name_world ON characters(name) INCLUDE (world_id);
```

#### Avoid SELECT * in production
```sql
-- ❌ Bad: Fetches all columns
SELECT * FROM characters WHERE world_id = $1;

-- ✅ Good: Only fetch needed columns
SELECT id, name, description FROM characters WHERE world_id = $1;
```

### Connection Management

#### Use connection pooling (Supavisor)
```typescript
// ❌ Bad: Direct connection for each request
const client = new Client({ connectionString: process.env.DATABASE_URL });

// ✅ Good: Use pooler URL
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL.replace(':5432', ':6543'),
  max: 10 // Limit connections
});
```

#### Always release connections
```typescript
// ❌ Bad: Connection leak
const client = await pool.connect();
const result = await client.query('SELECT * FROM characters');
// Missing client.release()

// ✅ Good: Always release in finally block
const client = await pool.connect();
try {
  const result = await client.query('SELECT * FROM characters');
  return result.rows;
} finally {
  client.release();
}
```

### Security & RLS

#### Enable RLS on all user-facing tables
```sql
-- ❌ Bad: No RLS
CREATE TABLE characters (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  name TEXT
);

-- ✅ Good: RLS enabled with policies
CREATE TABLE characters (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  name TEXT
);

ALTER TABLE characters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own characters"
  ON characters FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own characters"
  ON characters FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

#### Use auth.uid() not current_user
```sql
-- ❌ Bad: current_user is the database role
CREATE POLICY "bad_policy" ON characters
  USING (user_id = current_user::uuid);

-- ✅ Good: auth.uid() is the authenticated user
CREATE POLICY "good_policy" ON characters
  USING (user_id = auth.uid());
```

### Schema Design

#### Use appropriate data types
```sql
-- ❌ Bad: Wrong types
CREATE TABLE events (
  id SERIAL,           -- Use UUID for distributed systems
  created_at TEXT,     -- Use TIMESTAMPTZ
  metadata TEXT        -- Use JSONB
);

-- ✅ Good: Proper types
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);
```

#### Use partial indexes for filtered queries
```sql
-- ❌ Bad: Full index on rarely-filtered column
CREATE INDEX idx_characters_active ON characters(is_active);

-- ✅ Good: Partial index for common filter
CREATE INDEX idx_characters_active ON characters(name) 
  WHERE is_active = true;
```

### Concurrency & Locking

#### Use FOR UPDATE SKIP LOCKED for job queues
```sql
-- ❌ Bad: Blocks other workers
SELECT * FROM jobs WHERE status = 'pending' 
  ORDER BY created_at LIMIT 1 FOR UPDATE;

-- ✅ Good: Skip locked rows
SELECT * FROM jobs WHERE status = 'pending' 
  ORDER BY created_at LIMIT 1 FOR UPDATE SKIP LOCKED;
```

#### Avoid long-running transactions
```sql
-- ❌ Bad: Long transaction blocks others
BEGIN;
  -- ... many operations over minutes ...
COMMIT;

-- ✅ Good: Break into smaller transactions
-- Transaction 1
BEGIN;
  UPDATE characters SET status = 'processing' WHERE batch_id = $1;
COMMIT;
-- Transaction 2 (separate)
BEGIN;
  -- ... process ...
COMMIT;
```

### Data Access Patterns

#### Use LIMIT for pagination
```sql
-- ❌ Bad: Fetch all then slice
SELECT * FROM characters ORDER BY created_at;
-- Then slice in application

-- ✅ Good: Database-level pagination
SELECT * FROM characters 
  ORDER BY created_at 
  LIMIT 20 OFFSET 0;
```

#### Use cursor-based pagination for large datasets
```sql
-- ❌ Bad: OFFSET is slow for large offsets
SELECT * FROM characters ORDER BY id LIMIT 20 OFFSET 10000;

-- ✅ Good: Cursor-based (keyset) pagination
SELECT * FROM characters 
  WHERE id > $last_seen_id 
  ORDER BY id LIMIT 20;
```

## Monitoring

### Check slow queries
```sql
SELECT query, calls, mean_time, total_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

### Check index usage
```sql
SELECT 
  schemaname || '.' || relname AS table,
  indexrelname AS index,
  idx_scan AS scans,
  idx_tup_read AS tuples_read,
  idx_tup_fetch AS tuples_fetched
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;
```

## References

- https://www.postgresql.org/docs/current/
- https://supabase.com/docs
- https://wiki.postgresql.org/wiki/Performance_Optimization
- https://supabase.com/docs/guides/database/overview
- https://supabase.com/docs/guides/auth/row-level-security
