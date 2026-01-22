# Items Section Specification

## Overview

Manages props, vehicles, artifacts, and significant objects in the world.

## Key Features

- Item list with type/category filters
- Item detail with ownership history
- Production specs for asset creation

## Data Fields

- name, type (weapon, vehicle, artifact, tool, document, clothing, technology)
- description, function, origin
- owner_id (current), location_id (current location)
- significance (plot importance)
- rules (what it can/cannot do for magical items)
- visual_references, scale, material_notes

## Components

- ItemCard: Item summary with type icon
- ItemList: Filterable grid of items
- ItemDetail: Full view with ownership history and production specs
- OwnershipHistory: Timeline of who owned the item
