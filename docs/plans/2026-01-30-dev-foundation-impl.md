# Development Foundation Implementation Plan

**Design:** 2026-01-30-dev-foundation-design.md
**Status:** In Progress

## Phase 1: Branch Protection (~10 min)

### Task 1.1: Configure GitHub branch protection
- [ ] Use GitHub MCP or manual setup
- [ ] Protect `main` branch
- [ ] Require pull request before merge
- [ ] Require 1 approval
- [ ] Disable direct pushes

### Task 1.2: Verify protection works
- [ ] Try to push directly (should fail)
- [ ] Create test PR to verify workflow

**Checkpoint:** Get user approval before Phase 2

---

## Phase 2: Test Suite Setup (~30 min)

### Task 2.1: Install Vitest
- [ ] Add vitest, @vitest/ui as dev dependencies
- [ ] Add @testing-library/react for component tests
- [ ] Create vitest.config.ts
- [ ] Add test scripts to package.json

### Task 2.2: Install Playwright
- [ ] Add @playwright/test as dev dependency
- [ ] Create playwright.config.ts
- [ ] Add e2e test scripts to package.json

### Task 2.3: Create test directory structure
```
tests/
  unit/           # Vitest unit tests
  integration/    # Vitest integration tests
  e2e/            # Playwright E2E tests
```

### Task 2.4: Write critical path tests (Priority A)
- [ ] Auth flow: login, signup, logout
- [ ] World: create, select, switch
- [ ] Character: create, read, update, delete

### Task 2.5: Write E2E journey tests (Priority D)
- [ ] Journey 1: New user signup → create world → view dashboard
- [ ] Journey 2: Login → create character → view character
- [ ] Journey 3: Login → import flow (if world exists)

**Checkpoint:** Get user approval before Phase 3

---

## Phase 3: CI Pipeline (~20 min)

### Task 3.1: Create GitHub Actions workflow
- [ ] Create `.github/workflows/ci.yml`
- [ ] Add lint step
- [ ] Add typecheck step
- [ ] Add unit test step
- [ ] Add E2E test step with artifact upload

### Task 3.2: Test the pipeline
- [ ] Push to a test branch
- [ ] Create PR to trigger workflow
- [ ] Verify all checks pass

**Checkpoint:** Get user approval before Phase 4

---

## Phase 4: Upgrade Branch Protection (~5 min)

### Task 4.1: Require status checks
- [ ] Add CI workflow as required check
- [ ] Require branch to be up-to-date

### Task 4.2: Final verification
- [ ] Create PR with failing test (should block)
- [ ] Fix test, verify merge allowed

---

## Completion Checklist

- [ ] Branch protection active
- [ ] Vitest configured and working
- [ ] Playwright configured and working
- [ ] Critical path tests written
- [ ] E2E journey tests written
- [ ] GitHub Actions CI running
- [ ] CI required for merge
- [ ] Design doc committed
- [ ] Implementation doc updated
