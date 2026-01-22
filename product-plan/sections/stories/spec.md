# Stories Section Specification

## Overview

The Stories section manages narratives that use world elements. Stories contain Scenes, and Scenes contain ShotsÃ¢â‚¬â€providing a complete production pipeline from story concept to storyboard-ready shot breakdowns.

---

## Hierarchy

```
Story
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ Scene 1
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ Shot 1.1
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ Shot 1.2
Ã¢â€â€š   Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ Shot 1.3
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ Scene 2
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ Shot 2.1
Ã¢â€â€š   Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ Shot 2.2
Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ Scene 3
    Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ ...
```

---

## User Stories

### As a worldbuilder, I want to:
1. Create narrative containers that reference my world elements
2. Break stories into scenes with location and character assignments
3. Create shot breakdowns with camera specs for production
4. Generate storyboard prompts for AI image generation
5. Export screenplay-formatted documents

---

## Screens

### 1. Stories List

Shows all stories with status, genre, and progress indicators.

### 2. Story Detail

Master view of a single story with:
- Story metadata (title, logline, genre, tone, theme)
- Featured characters and locations
- Scene list with drag-to-reorder
- Story status tracking

### 3. Scene Detail

Detailed scene breakdown:
- Scene number and purpose
- Location assignment
- Characters present
- Emotional beat
- Key dialogue points
- Shot list

### 4. Shot Detail

Production-ready shot spec:
- Shot number and type
- Camera movement
- Characters in frame
- Action description
- Dialogue
- Visual prompt for AI storyboarding

---

## Data Requirements

### Story
- `id`, `world_id`, `title`, `logline`
- `genre`, `tone`, `theme`
- `status`: concept | outline | draft | complete
- Links to characters (protagonist, antagonist, featured)
- Links to locations (settings)

### Scene
- `id`, `story_id`, `scene_number`
- `location_id`, `time`
- `purpose`, `summary`, `emotional_beat`
- `key_dialogue`, `action`, `props_needed`
- Links to characters present

### Shot
- `id`, `scene_id`, `shot_number`
- `shot_type`: wide | medium | close_up | extreme_close_up | over_shoulder | pov | aerial
- `camera_movement`: static | pan | tilt | dolly | crane | handheld | steadicam
- `description`, `action`, `dialogue`
- `mood`, `lighting_notes`, `duration_estimate`
- `visual_prompt`: AI image generation prompt
- Links to characters in frame

---

## Key Components

### StoryCard
Story summary with progress indicator

### StoryDetail
Full story view with scene list

### SceneCard
Scene summary in story context

### SceneDetail
Full scene view with shot list

### ShotCard
Shot in scene context

### ShotDetail
Full shot spec with visual prompt

### VisualPromptGenerator
AI-assisted prompt creation for storyboards
