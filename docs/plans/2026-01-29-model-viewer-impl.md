# 3D Model Viewer Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add 3D model embed support (Sketchfab + Tripo AI) to entity pages using content blocks.

**Architecture:** New `'model'` block type in content_blocks. Components parse share URLs and render iframes. No schema changes needed.

**Tech Stack:** React, TypeScript, iframe embeds

---

## Task 1: Update ContentBlock Type

**Files:**
- Modify: `lib/types/database.ts`

**Step 1: Add 'model' to ContentBlock type**

Update the ContentBlock type to include 'model' and platform field:

```typescript
export type ContentBlock = {
  id: string;
  type: 'text' | 'media' | 'model';  // Add 'model'
  content: string;
  platform?: 'sketchfab' | 'tripo';  // Add platform for model blocks
  mentions: string[];
  order: number;
  created_at: string;
  updated_at: string;
};
```

**Step 2: Verify TypeScript compiles**

Run: `./node_modules/.bin/tsc --noEmit`
Expected: Exit 0

**Step 3: Commit**

```bash
git add lib/types/database.ts
git commit -m "types: Add model type to ContentBlock"
```

---

## Task 2: Create URL Parser Utility

**Files:**
- Create: `lib/utils/model-url.ts`

**Step 1: Create the URL parser**

```typescript
export type ModelPlatform = 'sketchfab' | 'tripo';

export interface ParsedModelUrl {
  platform: ModelPlatform;
  embedUrl: string;
  modelId: string;
}

export function parseModelUrl(url: string): ParsedModelUrl | null {
  // Sketchfab format: https://sketchfab.com/3d-models/model-name-abc123def456
  const sketchfabMatch = url.match(/sketchfab\.com\/3d-models\/[\w-]+-([a-f0-9]{32})/i);
  if (sketchfabMatch) {
    const modelId = sketchfabMatch[1];
    return {
      platform: 'sketchfab',
      embedUrl: `https://sketchfab.com/models/${modelId}/embed`,
      modelId,
    };
  }

  // Tripo format: https://www.tripo3d.ai/app/share/xxx
  const tripoMatch = url.match(/tripo3d\.ai\/app\/share\/([a-zA-Z0-9_-]+)/i);
  if (tripoMatch) {
    const modelId = tripoMatch[1];
    return {
      platform: 'tripo',
      embedUrl: `https://www.tripo3d.ai/embed/${modelId}`,
      modelId,
    };
  }

  return null;
}

export function isValidModelUrl(url: string): boolean {
  return parseModelUrl(url) !== null;
}
```

**Step 2: Verify TypeScript compiles**

Run: `./node_modules/.bin/tsc --noEmit`
Expected: Exit 0

**Step 3: Commit**

```bash
git add lib/utils/model-url.ts
git commit -m "feat: Add model URL parser for Sketchfab and Tripo"
```

---

## Task 3: Create ModelEmbed Component

**Files:**
- Create: `components/models/ModelEmbed.tsx`

**Step 1: Create the component**

```typescript
'use client';

import { parseModelUrl, ModelPlatform } from '@/lib/utils/model-url';

interface ModelEmbedProps {
  url: string;
  platform?: ModelPlatform;
  className?: string;
}

export function ModelEmbed({ url, platform, className = '' }: ModelEmbedProps) {
  const parsed = parseModelUrl(url);
  
  if (!parsed) {
    return (
      <div className={`bg-zinc-800 rounded-lg p-4 text-zinc-400 ${className}`}>
        Invalid model URL
      </div>
    );
  }

  return (
    <div className={`relative aspect-video w-full overflow-hidden rounded-lg bg-zinc-900 ${className}`}>
      <iframe
        src={parsed.embedUrl}
        className="absolute inset-0 h-full w-full border-0"
        allow="autoplay; fullscreen; xr-spatial-tracking"
        allowFullScreen
        title={`3D Model (${parsed.platform})`}
      />
    </div>
  );
}
```

**Step 2: Verify TypeScript compiles**

Run: `./node_modules/.bin/tsc --noEmit`
Expected: Exit 0

**Step 3: Commit**

```bash
git add components/models/ModelEmbed.tsx
git commit -m "feat: Add ModelEmbed component for 3D previews"
```

---

## Task 4: Create AddModelButton Component

**Files:**
- Create: `components/models/AddModelButton.tsx`

**Step 1: Create the component**

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { parseModelUrl, ModelPlatform } from '@/lib/utils/model-url';

interface AddModelButtonProps {
  onAdd: (url: string, platform: ModelPlatform) => void;
}

export function AddModelButton({ onAdd }: AddModelButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const parsed = parseModelUrl(url);
    if (!parsed) {
      setError('Please enter a valid Sketchfab or Tripo AI URL');
      return;
    }

    onAdd(url, parsed.platform);
    setUrl('');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <Button variant="secondary" size="sm" onClick={() => setIsOpen(true)}>
        + Add 3D Model
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-zinc-900 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Add 3D Model</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-zinc-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <p className="mb-3 text-sm text-zinc-400">
            Paste a Sketchfab or Tripo AI share link:
          </p>
          
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://sketchfab.com/3d-models/..."
            className="mb-2"
          />

          {error && (
            <p className="mb-3 text-sm text-red-400">{error}</p>
          )}

          <p className="mb-4 text-xs text-zinc-500">
            Supported: Sketchfab, Tripo AI
          </p>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Add Model
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

**Step 2: Verify TypeScript compiles**

Run: `./node_modules/.bin/tsc --noEmit`
Expected: Exit 0

**Step 3: Commit**

```bash
git add components/models/AddModelButton.tsx
git commit -m "feat: Add AddModelButton component with modal"
```

---

## Task 5: Create Component Index

**Files:**
- Create: `components/models/index.ts`

**Step 1: Create the index file**

```typescript
export { ModelEmbed } from './ModelEmbed';
export { AddModelButton } from './AddModelButton';
```

**Step 2: Commit**

```bash
git add components/models/index.ts
git commit -m "feat: Add models component index"
```

---

## Task 6: Update Documentation

**Files:**
- Modify: `docs/current-sprint.md`

**Step 1: Update sprint docs**

Add section documenting model viewer completion and update the checklist.

**Step 2: Commit**

```bash
git add docs/current-sprint.md
git commit -m "docs: Update sprint with model viewer implementation"
```

---

## Task 7: Final Verification and Push

**Step 1: TypeScript check**

Run: `./node_modules/.bin/tsc --noEmit`
Expected: Exit 0

**Step 2: Lint check**

Run: `npm run lint`
Expected: Exit 0 (or warnings only)

**Step 3: Push**

```bash
git push -u origin cursor/entity-schema-content-blocks-4f1f
```

---

## Summary

| Task | Description |
|------|-------------|
| 1 | Update ContentBlock type |
| 2 | Create URL parser utility |
| 3 | Create ModelEmbed component |
| 4 | Create AddModelButton component |
| 5 | Create component index |
| 6 | Update documentation |
| 7 | Final verification and push |

**Estimated commits:** 6
**Risk level:** Low (new components, no breaking changes)
