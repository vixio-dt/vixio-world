# Timeline Section Specification

## Overview

Displays events in chronological order with filtering and connection visualization.

## Key Features

- Chronological timeline visualization
- Event list view with date filtering
- Event detail with participants and consequences
- Causal chain visualization (what led to what)

## Data Fields

- name, date (in-world format), date_sort (for ordering)
- type (historical, plot_point, scheduled, recurring)
- description, causes, consequences
- location_id (where it happened)
- character_ids (who was involved)
- related_event_ids (cause/effect chain)

## Components

- TimelineView: Visual chronological display
- EventCard: Event summary with date and type
- EventList: Filterable list view
- EventDetail: Full view with participants and effects
- CausalChain: Visual cause/effect relationship display
