# Data Model

## Overview

Vixio Worldbuilder uses 11 core entities to represent all aspects of a fictional world and its narratives.

---

## Entity Relationship Diagram

```
User
 └── owns many → World
                  ├── contains many → Character
                  ├── contains many → Location
                  ├── contains many → Organization
                  ├── contains many → Event
                  ├── contains many → Item
                  ├── contains many → Rule
                  └── contains many → Story
                                       └── contains many → Scene
                                                            └── contains many → Shot

Cross-entity relationships:
- Character ↔ Character (relationships)
- Character ↔ Organization (membership)
- Character ↔ Location (residence/presence)
- Event ↔ Character (participants)
- Event ↔ Location (occurs at)
- Item ↔ Character (ownership)
- Item ↔ Location (located at)
- Scene ↔ Location (set in)
- Scene ↔ Character (features)
```

---

## Entity Definitions

### 1. User

**Description**: Authenticated user account from Supabase Auth. Owns one or more worlds.

**Fields**:
- `id` — UUID (from Supabase Auth)
- `email` — Email address
- `created_at` — Account creation timestamp

**Relationships**:
- Owns many **World**

---

### 2. World

**Description**: Top-level container for all world elements. Represents a complete fictional universe.

**Fields**:
- `id` — UUID
- `user_id` — Owner reference
- `name` — World name (e.g., "The Fractured Realms")
- `genre` — Primary genre (fantasy, sci-fi, horror, etc.)
- `tone` — Overall tone (dark, hopeful, gritty, whimsical)
- `themes` — Array of thematic elements
- `logline` — 1-2 sentence summary of the world
- `created_at` — Creation timestamp
- `updated_at` — Last modification timestamp

**Relationships**:
- Belongs to **User**
- Contains many **Character**, **Location**, **Organization**, **Event**, **Item**, **Rule**, **Story**

---

### 3. Character

**Description**: People, creatures, or sentient entities that inhabit the world.

**Fields**:
- `id` — UUID
- `world_id` — Parent world reference
- `name` — Full name
- `aliases` — Alternative names, titles
- `role` — Narrative role (protagonist, antagonist, supporting, background)
- `species` — Species or type
- `appearance` — Physical description
- `personality` — Personality traits and behavioral patterns
- `background` — History and origin story
- `motivations` — Goals and driving forces
- `arc_potential` — How this character might change
- `visual_references` — Notes for MetaHuman/casting
- `voice_notes` — Speech patterns, accent, tone
- `movement_notes` — Physicality, gestures, gait
- `created_at` — Creation timestamp
- `updated_at` — Last modification timestamp

**Relationships**:
- Belongs to **World**
- Many-to-many with **Character** (relationships: ally, enemy, family, romantic, mentor, etc.)
- Many-to-many with **Organization** (membership)
- Many-to-many with **Location** (residence, frequent locations)
- Many-to-many with **Item** (ownership)

---

### 4. Location

**Description**: Places, environments, and settings in the world. Supports hierarchical nesting.

**Fields**:
- `id` — UUID
- `world_id` — Parent world reference
- `parent_location_id` — Parent location for hierarchy (nullable)
- `name` — Location name
- `type` — Location type (planet, continent, country, city, district, building, room)
- `description` — Physical description
- `atmosphere` — Mood and feeling
- `climate` — Weather and environmental conditions
- `key_features` — Notable landmarks and characteristics
- `history` — Historical significance
- `cultural_significance` — Cultural meaning and importance
- `visual_references` — Notes for environment design
- `lighting_notes` — Lighting conditions and mood
- `sound_notes` — Ambient sound design
- `asset_requirements` — Props and set pieces needed
- `created_at` — Creation timestamp
- `updated_at` — Last modification timestamp

**Relationships**:
- Belongs to **World**
- Self-referential parent/child (location hierarchy)
- Many-to-many with **Character** (inhabitants, visitors)
- One-to-many from **Event** (events occur here)
- One-to-many from **Scene** (scenes set here)

---

### 5. Organization

**Description**: Groups, factions, governments, religions, companies, and other collective entities.

**Fields**:
- `id` — UUID
- `world_id` — Parent world reference
- `name` — Organization name
- `type` — Organization type (government, religion, corporation, guild, family, military, secret society)
- `purpose` — Mission and goals
- `structure` — Organizational hierarchy description
- `leadership` — Leadership structure and key positions
- `territory` — Geographic influence
- `resources` — Assets and capabilities
- `beliefs` — Core values and ideology
- `symbols` — Iconography, colors, mottos
- `history` — Origin and significant events
- `created_at` — Creation timestamp
- `updated_at` — Last modification timestamp

**Relationships**:
- Belongs to **World**
- Many-to-many with **Character** (members)
- Many-to-many with **Organization** (allies, enemies)

---

### 6. Event

**Description**: Historical events, plot points, and significant occurrences in the world's timeline.

**Fields**:
- `id` — UUID
- `world_id` — Parent world reference
- `name` — Event name
- `date` — In-world date/time (flexible format for different calendar systems)
- `date_sort` — Sortable timestamp for ordering
- `type` — Event type (historical, plot_point, scheduled, recurring)
- `description` — What happened
- `causes` — What led to this event
- `consequences` — Results and aftermath
- `created_at` — Creation timestamp
- `updated_at` — Last modification timestamp

**Relationships**:
- Belongs to **World**
- Many-to-one with **Location** (occurs at)
- Many-to-many with **Character** (participants)
- Many-to-many with **Event** (causes/effects chain)

---

### 7. Item

**Description**: Props, vehicles, artifacts, and significant objects in the world.

**Fields**:
- `id` — UUID
- `world_id` — Parent world reference
- `name` — Item name
- `type` — Item type (weapon, vehicle, artifact, tool, document, clothing, technology)
- `description` — Physical description
- `function` — What it does
- `origin` — Where it came from
- `significance` — Plot importance, cultural value
- `rules` — What it can and cannot do (for magical/special items)
- `visual_references` — Notes for asset creation
- `scale` — Dimensions and size
- `material_notes` — Construction and materials
- `created_at` — Creation timestamp
- `updated_at` — Last modification timestamp

**Relationships**:
- Belongs to **World**
- Many-to-many with **Character** (ownership, past owners)
- Many-to-one with **Location** (current location)

---

### 8. Rule

**Description**: World laws, physics, magic systems, social norms, and constraints that govern how the world works.

**Fields**:
- `id` — UUID
- `world_id` — Parent world reference
- `name` — Rule name
- `category` — Rule category (physics, magic, technology, biology, social, political, economic, temporal, cosmological)
- `statement` — Clear, unambiguous rule text
- `scope` — Where/when this rule applies
- `exceptions` — Known exceptions to the rule
- `consequences` — What happens when violated
- `examples` — Illustrative examples
- `created_at` — Creation timestamp
- `updated_at` — Last modification timestamp

**Relationships**:
- Belongs to **World**

**Special Behavior**: Rules are used for consistency checking. When new content is added, it's validated against applicable rules.

---

### 9. Story

**Description**: Narrative containers that organize world elements into structured stories.

**Fields**:
- `id` — UUID
- `world_id` — Parent world reference
- `title` — Story title
- `logline` — 1-2 sentence summary
- `genre` — Story genre (may differ from world genre)
- `tone` — Story tone
- `theme` — Central theme
- `status` — Development status (concept, outline, draft, complete)
- `created_at` — Creation timestamp
- `updated_at` — Last modification timestamp

**Relationships**:
- Belongs to **World**
- Contains many **Scene**
- Many-to-many with **Character** (protagonist, antagonist, featured)
- Many-to-many with **Location** (settings)

---

### 10. Scene

**Description**: Individual scene breakdowns within stories.

**Fields**:
- `id` — UUID
- `story_id` — Parent story reference
- `scene_number` — Order within story
- `time` — In-story time
- `purpose` — What this scene accomplishes narratively
- `summary` — Scene description
- `emotional_beat` — Emotional tone and arc
- `key_dialogue` — Important dialogue points
- `action` — Key actions and events
- `props_needed` — Required items for the scene
- `setup_payoff` — Connection to other scenes
- `created_at` — Creation timestamp
- `updated_at` — Last modification timestamp

**Relationships**:
- Belongs to **Story**
- Many-to-one with **Location** (set in)
- Many-to-many with **Character** (present in scene)
- Contains many **Shot**

---

### 11. Shot

**Description**: Visual frames for storyboarding and production.

**Fields**:
- `id` — UUID
- `scene_id` — Parent scene reference
- `shot_number` — Order within scene
- `shot_type` — Shot type (wide, medium, close-up, extreme_close_up, over_shoulder, pov, aerial, etc.)
- `camera_movement` — Camera movement (static, pan, tilt, dolly, crane, handheld, steadicam)
- `description` — Visual description of the frame
- `action` — What happens in this shot
- `dialogue` — Any dialogue in this shot
- `mood` — Emotional tone
- `lighting_notes` — Lighting for this shot
- `duration_estimate` — Estimated length in seconds
- `visual_prompt` — AI image generation prompt for storyboarding
- `created_at` — Creation timestamp
- `updated_at` — Last modification timestamp

**Relationships**:
- Belongs to **Scene**
- Many-to-many with **Character** (in frame)

---

## Junction Tables (for Many-to-Many Relationships)

### character_relationships
- `character_a_id` — First character
- `character_b_id` — Second character  
- `relationship_type` — Type (ally, enemy, family, romantic, mentor, rival, etc.)
- `description` — Relationship details

### character_organizations
- `character_id` — Character reference
- `organization_id` — Organization reference
- `role` — Role within organization
- `status` — Current, former, founding member, etc.

### character_locations
- `character_id` — Character reference
- `location_id` — Location reference
- `relationship_type` — Resident, birthplace, workplace, etc.

### event_characters
- `event_id` — Event reference
- `character_id` — Character reference
- `role` — Role in event (participant, witness, victim, etc.)

### scene_characters
- `scene_id` — Scene reference
- `character_id` — Character reference

### shot_characters
- `shot_id` — Shot reference
- `character_id` — Character reference

### story_characters
- `story_id` — Story reference
- `character_id` — Character reference
- `role` — Role in story (protagonist, antagonist, supporting)

### item_owners
- `item_id` — Item reference
- `character_id` — Character reference
- `ownership_type` — Current, former, creator, etc.
