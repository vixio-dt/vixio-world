# Feature Design: Stage Boards

## Overview

Visualization is not a supporting graph feature anymore. It is the main product surface.

The core visualization model is a set of **stage-aware boards**:

- Planning
- Ideation
- Scripting / Breakdown
- Design
- Storyboard

## Why Boards

Boards solve the main problems that flat chat and generic docs do not:

- they keep outputs visible
- they preserve alternatives
- they make stage progression understandable
- they provide a shared memory for users and AI

## Board Building Blocks

### Board

A stage-specific workspace.

### Block

A meaningful output unit on a board.

Examples:

- story concepts
- scene lists
- character directions
- style references
- shot sequences

### Element

A selectable unit inside a block.

Examples:

- a single beat
- one design option
- one shot
- one reference callout

### Lineage

Every refinement should preserve ancestry so users can see:

- what changed
- what branch was explored
- what got approved

## First UX Model

The first implementation does not need a full infinite canvas. It does need:

- stage-aware surface separation
- visible workflow structure
- cards or panels that feel like boards
- continuity across stages

## Agent Relationship

Boards should become the UI surface where the `Core Agent` coordinates work and where specialized actions can publish results.

That is more important than maximizing graph complexity.

## Relationship To Graph View

Relationship maps still matter, but they now sit under `Assets` as a supporting visualization. They are not the primary explanation of the product.
