# Workspace Model

## Overview

The Studio pivot depends on a clear mental model:

- **Project** is the top-level container
- **Boards** are the primary workspace
- **Canon** is the approved context layer
- **Assets** are reusable visual planning inputs
- **Exports** package the work for review or handoff

## Core Objects

### Project

The active creative unit. Can start from a brief or a script.

### Boards

The stage-specific surfaces where work happens.

Recommended stages:

1. Planning
2. Ideation
3. Scripting / Breakdown
4. Design
5. Storyboard

### Blocks

Each board contains blocks representing meaningful outputs:

- concept directions
- outlines
- scene lists
- design options
- shot sequences

### Elements

Blocks contain selectable elements that can be refined individually:

- one beat
- one character option
- one shot
- one visual note

### Lineage

Whenever a block changes, the system should preserve:

- parent block
- new branch
- latest approved version

This is what prevents the workflow from collapsing back into flat chat.

### Canon

Canon holds approved narrative and reference material that future stages can trust.

Examples:

- stories
- rules
- important events
- approved notes
- imported references

### Assets

Assets are reusable units like characters, locations, props, and groups. They should stay linkable from boards, canon, scenes, and exports.

## Agent Roles

### Core Agent

Responsibilities:

- interpret user intent
- identify the active stage
- suggest next steps
- package context for specialized actions
- keep continuity across stages

### Specialized Roles

Suggested specializations:

- ideation
- scripting / breakdown
- design
- storyboard / art

The first slice can implement this lightly, but the model should already support it.
