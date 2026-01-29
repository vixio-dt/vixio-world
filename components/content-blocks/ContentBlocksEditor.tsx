'use client';

import { useState, useEffect } from 'react';
import { Button, Textarea, Card, CardContent } from '@/components/ui';
import { AddModelButton } from '@/components/models';
import { FileText, Box, Trash2 } from 'lucide-react';
import type { ContentBlock } from '@/lib/types/database';
import type { ModelPlatform } from '@/lib/utils/model-url';

interface ContentBlocksEditorProps {
  initialBlocks?: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}

/**
 * Editor for content blocks.
 * Allows adding/editing/removing text and model blocks.
 */
export function ContentBlocksEditor({ initialBlocks = [], onChange }: ContentBlocksEditorProps) {
  const [blocks, setBlocks] = useState<ContentBlock[]>(initialBlocks);

  useEffect(() => {
    onChange(blocks);
  }, [blocks, onChange]);

  const generateId = () => `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const addTextBlock = () => {
    const newBlock: ContentBlock = {
      id: generateId(),
      type: 'text',
      content: '',
      mentions: [],
      order: blocks.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setBlocks([...blocks, newBlock]);
  };

  const addModelBlock = (url: string, platform: ModelPlatform) => {
    const newBlock: ContentBlock = {
      id: generateId(),
      type: 'model',
      content: url,
      platform,
      mentions: [],
      order: blocks.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (id: string, content: string) => {
    setBlocks(blocks.map(block => 
      block.id === id 
        ? { ...block, content, updated_at: new Date().toISOString() }
        : block
    ));
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(block => block.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-700">Content Blocks</h3>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addTextBlock}
          >
            <FileText className="w-4 h-4 mr-1" />
            Add Text
          </Button>
          <AddModelButton onAdd={addModelBlock} />
        </div>
      </div>

      {blocks.length === 0 ? (
        <p className="text-sm text-slate-500 italic py-4 text-center border border-dashed border-slate-200 rounded-lg">
          No content blocks yet. Add text or 3D models to enrich this entity.
        </p>
      ) : (
        <div className="space-y-3">
          {blocks.map((block, index) => (
            <ContentBlockEditor
              key={block.id}
              block={block}
              index={index}
              onUpdate={updateBlock}
              onRemove={removeBlock}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface ContentBlockEditorProps {
  block: ContentBlock;
  index: number;
  onUpdate: (id: string, content: string) => void;
  onRemove: (id: string) => void;
}

function ContentBlockEditor({ block, index, onUpdate, onRemove }: ContentBlockEditorProps) {
  if (block.type === 'text') {
    return (
      <Card>
        <CardContent className="py-3">
          <div className="flex items-start gap-2">
            <div className="flex items-center gap-2 pt-2">
              <FileText className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-500">#{index + 1}</span>
            </div>
            <div className="flex-1">
              <Textarea
                value={block.content}
                onChange={(e) => onUpdate(block.id, e.target.value)}
                placeholder="Write content here..."
                className="min-h-[100px]"
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemove(block.id)}
              className="text-slate-400 hover:text-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (block.type === 'model') {
    return (
      <Card>
        <CardContent className="py-3">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Box className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-500">
                #{index + 1} · 3D Model ({block.platform || 'External'})
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemove(block.id)}
              className="text-slate-400 hover:text-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden">
            <iframe
              src={block.content.includes('sketchfab.com') 
                ? block.content.replace('/models/', '/models/embed/').split('?')[0] + '?autostart=0'
                : block.content}
              className="w-full h-full border-0"
              allow="autoplay; fullscreen; xr-spatial-tracking"
              allowFullScreen
              title="3D Model Preview"
            />
          </div>
          <p className="text-xs text-slate-500 mt-2 truncate">{block.content}</p>
        </CardContent>
      </Card>
    );
  }

  return null;
}
