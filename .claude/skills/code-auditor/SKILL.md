---
name: code-auditor
description: Performs comprehensive codebase analysis covering architecture, code quality, security, performance, testing, and maintainability. Use when user wants to audit code quality, identify technical debt, find security issues, assess test coverage, or get a codebase health check.
---

# Code Auditor

Comprehensive codebase analysis covering architecture, code quality, security, performance, testing, and maintainability.

## When to Use

- "audit the code"
- "analyze code quality"
- "check for issues"
- "review the codebase"
- "find technical debt"
- "security audit"
- "performance review"
- "health check"

## What It Analyzes

### 1. Architecture & Design
- Overall structure and organization
- Design patterns in use
- Module boundaries and separation of concerns
- Dependency management
- Architectural decisions and trade-offs

### 2. Code Quality
- Complexity hotspots (cyclomatic complexity)
- Code duplication (DRY violations)
- Naming conventions and consistency
- Documentation coverage
- Code smells and anti-patterns

### 3. Security
- Common vulnerabilities (OWASP Top 10)
- Input validation and sanitization
- Authentication and authorization
- Secrets management
- Dependency vulnerabilities

### 4. Performance
- Algorithmic complexity issues
- Database query optimization
- Memory usage patterns
- Caching opportunities
- Resource leaks

### 5. Testing
- Test coverage assessment
- Test quality and effectiveness
- Missing test scenarios
- Testing patterns and practices
- Integration vs unit test balance

### 6. Maintainability
- Technical debt assessment
- Coupling and cohesion
- Ease of future changes
- Onboarding friendliness
- Documentation quality

## Approach

1. **Explore** the codebase structure
2. **Identify patterns** with search tools
3. **Read critical files** for detailed analysis
4. **Run available tools** (linters, type checkers)
5. **Synthesize findings** into actionable report

## Thoroughness Levels

| Level | Time | Scope |
|-------|------|-------|
| **Quick** | 5-10 min | High-level, critical issues only |
| **Standard** | 15-30 min | Comprehensive across all dimensions |
| **Deep** | 30+ min | Exhaustive with detailed examples |

## Output Format

```markdown
# Code Audit Report

## Executive Summary
- Overall health score: X/10
- Critical issues: N
- Top 3 priorities

## Findings by Category

### Architecture & Design
#### 🔴 Critical
- [Finding with file:line reference]
  - Impact: [description]
  - Recommendation: [action]

#### 🟡 Warning
- ...

#### 🟢 Good
- ...

### Code Quality
...

### Security
...

### Performance
...

### Testing
...

### Maintainability
...

## Prioritized Action Plan

### Quick Wins (< 1 day)
1. [Action item]
2. [Action item]

### Medium-term (1-5 days)
1. [Action item]

### Long-term (> 5 days)
1. [Action item]

## Metrics Summary
| Metric | Value | Status |
|--------|-------|--------|
| Files analyzed | X | |
| Lines of code | Y | |
| Test coverage | Z% | 🟡 |
| Complexity hotspots | N | 🔴 |
| Security issues | M | 🟢 |
```

## Common Patterns to Check

### TypeScript/JavaScript
- [ ] Strict TypeScript config
- [ ] No `any` types
- [ ] Proper error handling
- [ ] No unused imports/variables
- [ ] Consistent naming (camelCase, PascalCase)

### React/Next.js
- [ ] No prop drilling (use context/state management)
- [ ] Keys on list items
- [ ] No inline functions in JSX
- [ ] Proper memo usage
- [ ] Server vs Client component split

### Supabase/Database
- [ ] RLS enabled on all tables
- [ ] Indexes on frequently queried columns
- [ ] No SELECT * in production
- [ ] Proper foreign key constraints
- [ ] Connection pooling configured

### Security
- [ ] No secrets in code
- [ ] Input validation on all endpoints
- [ ] CSRF protection
- [ ] Rate limiting
- [ ] Proper authentication checks

## Integration with Other Skills

- **code-execution**: Run bulk analysis efficiently
- **react-best-practices**: Apply React-specific checks
- **supabase-postgres-best-practices**: Apply DB-specific checks
- **systematic-debugging**: Investigate identified issues
- **writing-plans**: Plan technical debt reduction

## Severity Levels

| Level | Symbol | Meaning |
|-------|--------|---------|
| Critical | 🔴 | Must fix immediately, security/stability risk |
| Warning | 🟡 | Should fix soon, affects quality |
| Info | 🔵 | Consider improving |
| Good | 🟢 | Positive finding, keep doing |

## Success Criteria

- [ ] All six dimensions covered
- [ ] Specific file:line references
- [ ] Severity ratings on all findings
- [ ] Actionable recommendations
- [ ] Estimated effort for fixes
- [ ] Both quick wins and long-term items
