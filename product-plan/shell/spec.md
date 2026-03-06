# Application Shell Specification

## Overview

The Studio shell should orient the user around **workflow**, not entity type.

This is the visible product-level proof of the pivot. Even before the full data model changes, the shell should tell users they are inside a preproduction workspace.

## Navigation Structure

### Primary Navigation

- **Project Switcher** - select the active project
- **Overview** - project health, next steps, workflow summary
- **Boards** - stage-aware workspace
- **Canon** - approved context and references
- **Assets** - reusable characters, locations, props, and relationships

### Utility Navigation

- **Agent Chat** - conversational coordination and project Q&A
- **Exports** - deliverables and handoff outputs

### Secondary / Supporting Routes

The detailed CRUD routes remain available, but they are supporting surfaces behind the top-level IA:

- `/characters`
- `/locations`
- `/organizations`
- `/timeline`
- `/items`
- `/rules`
- `/stories`
- `/graph`
- `/import`

## Layout Pattern

| Region | Purpose |
|--------|---------|
| Header | Project identity, theme toggle, auth controls |
| Sidebar | Workflow-first navigation |
| Main content | Active Studio surface |

## UX Goals

### 1. Immediate Orientation

The shell should make it obvious that the user is working on a project with stages, not browsing a wiki.

### 2. Short Path To Action

From the shell, users should be able to quickly:

- start from a brief
- start from a script breakdown
- open boards
- jump into canon or assets
- export current work

### 3. Preserve Current Implementation Value

The shell should not throw away the existing routes. It should reframe them.

## Interaction Details

### Project Switcher

Current implementation continues to use the existing `world` records, but the shell should label them as projects.

Required behaviors:

- current project visible at all times
- dropdown list of projects
- create new project entry
- onboarding modal for project brief, script breakdown, reference intake, and demo project

### Active Route Styling

Active states should follow the workflow-first IA. Supporting CRUD routes do not need first-class nav placement unless they are later promoted.

### Command Palette

Search should be framed as searching `canon and assets`, not generic entities.

## Future Shell Enhancements

- board stage progress indicator
- quick actions in header
- project health summary chip
- pinned stage context when on board pages
