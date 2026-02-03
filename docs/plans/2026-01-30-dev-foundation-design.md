# Development Foundation Design

**Date:** 2026-01-30
**Status:** Approved
**Goal:** Set up proper development infrastructure for AI-assisted delivery pipeline

## Overview

Establish the foundation needed for a "good practice" development workflow:
- Branch protection to prevent direct pushes
- Test suite for quality assurance
- CI pipeline for automated checks
- Prepare for future Slack automation layer

## Decisions Made

| Question | Decision |
|----------|----------|
| Priority | Branch protection first, then tests + CI |
| Branch protection level | Light now (PR required), upgrade to strict after CI |
| Test framework | Vitest |
| CI location | GitHub Actions + Vercel |
| Test scope | Critical paths + E2E first |

## Phase 1: Branch Protection

**Scope:**
- Require PRs for all changes to `main`
- Require 1 approval before merge
- No direct pushes allowed

**Implementation:** GitHub repository settings or API

## Phase 2: Test Suite

**Framework:** Vitest + Playwright

**Initial Coverage (Priority A+D):**
- Auth flow tests (login, signup, logout)
- World creation/selection tests  
- Core CRUD operations
- 2-3 E2E journeys with Playwright

**Future Coverage (Priority B+C):**
- API/data layer tests (Supabase queries, server actions)
- UI component tests (renders, interactions)

## Phase 3: CI Pipeline

**GitHub Actions workflow:**
```yaml
on: [pull_request]
jobs:
  quality:
    - npm run lint
    - npm run typecheck
    - npm run test
    - npm run test:e2e
```

**Vercel (existing):**
- Build verification
- Preview deployments on PRs
- Production deploys on merge

## Phase 4: Upgrade Branch Protection

After CI is working:
- Require status checks to pass
- Require branch to be up-to-date before merge

## Future: Slack Automation

This foundation enables the Slack-driven automation layer:
- Orchestrator creates branches + PRs
- CI validates changes
- Reports sent to Slack with screenshots
- Human approval via PR review
- Merge triggers deploy

## Success Criteria

- [ ] Cannot push directly to main
- [ ] PRs require approval
- [ ] Tests run on every PR
- [ ] Lint/typecheck run on every PR
- [ ] E2E tests capture screenshots
- [ ] CI blocks merge on failure
