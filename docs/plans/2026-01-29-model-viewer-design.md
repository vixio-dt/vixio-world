# 3D Model Viewer Design

> **Status:** Approved
> **Date:** 2026-01-29
> **Phase:** 2 (Worldbuilder Core)

## Overview

Add 3D model preview support to entity pages via external embeds (Sketchfab, Tripo AI). Users paste share URLs, system renders iframe previews.

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Use case | Quick preview only | MVP scope - spinning preview, not interactive exploration |
| Native viewer | `<model-viewer>` web component | Simple, purpose-built for the task |
| External embeds | Sketchfab + Tripo AI | Most authors use external services, not local files |
| Data storage | content_blocks with `'model'` type | Uses existing system, no schema changes |
| UX | Explicit "Add 3D Model" button | Clearer than magic paste detection |

## Architecture

### Component Structure

```
components/
  models/
    ModelEmbed.tsx      # Renders iframe for Sketchfab/Tripo URLs
    AddModelButton.tsx  # Button + modal for adding model URL
    index.ts
```

### Content Block Type

```typescript
type ContentBlock = {
  id: string;
  type: 'text' | 'media' | 'model';  // Add 'model'
  content: string;  // URL for models
  platform?: 'sketchfab' | 'tripo';  // For model blocks
  mentions: string[];
  order: number;
  created_at: string;
  updated_at: string;
};
```

### URL Formats

**Sketchfab:**
- Input: `https://sketchfab.com/3d-models/model-name-abc123`
- Embed: `https://sketchfab.com/models/abc123/embed`

**Tripo AI:**
- Input: `https://www.tripo3d.ai/app/share/xxx`
- Embed: `https://www.tripo3d.ai/app/share/xxx?embed=true` (or iframe URL from share)

### Data Flow

1. User clicks "Add 3D Model" button on entity page
2. Modal prompts for URL (validates Sketchfab or Tripo format)
3. System extracts model ID, determines platform
4. Creates content block: `{ type: 'model', content: url, platform: 'sketchfab' }`
5. `ModelEmbed` component renders appropriate iframe
6. Block saved to entity's content_blocks array

## Component Specs

### ModelEmbed.tsx

```tsx
interface ModelEmbedProps {
  url: string;
  platform: 'sketchfab' | 'tripo';
  className?: string;
}

// Renders responsive iframe with platform-specific embed URL
// Aspect ratio: 16:9
// Shows loading state while iframe loads
```

### AddModelButton.tsx

```tsx
interface AddModelButtonProps {
  onAdd: (url: string, platform: 'sketchfab' | 'tripo') => void;
}

// Button that opens modal
// Modal has URL input field
// Validates URL format on submit
// Shows error if URL not recognized
```

### URL Validation

```typescript
function parseModelUrl(url: string): { platform: 'sketchfab' | 'tripo'; embedUrl: string } | null {
  // Sketchfab: extract model ID from URL path
  // Tripo: convert share URL to embed URL
  // Return null if unrecognized format
}
```

## UI Mockup

**Entity Detail Page:**
```
┌─────────────────────────────────────────────┐
│  Character: Aria                            │
├─────────────────────────────────────────────┤
│  [Story Context field]                      │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │                                     │   │
│  │     [3D Model Embed - iframe]       │   │
│  │                                     │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [Text content block...]                    │
│                                             │
│  [+ Add Text] [+ Add Image] [+ Add 3D Model]│
└─────────────────────────────────────────────┘
```

**Add Model Modal:**
```
┌─────────────────────────────────────────────┐
│  Add 3D Model                          [X]  │
├─────────────────────────────────────────────┤
│                                             │
│  Paste a Sketchfab or Tripo AI share link:  │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ https://sketchfab.com/3d-models/... │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Supported: Sketchfab, Tripo AI             │
│                                             │
│              [Cancel]  [Add Model]          │
└─────────────────────────────────────────────┘
```

## Future Enhancements (Not MVP)

- Native `.glb/.gltf` upload with `<model-viewer>`
- Meshy embed support
- Auto-detect URLs on paste
- Model thumbnail generation for cards
- AR preview (model-viewer supports this)

## Implementation

See: `docs/plans/2026-01-29-model-viewer-impl.md`
