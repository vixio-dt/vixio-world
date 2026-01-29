'use client';

import { Card, CardContent } from '@/components/ui';
import { ModelEmbed } from '@/components/models';
import type { ContentBlock } from '@/lib/types/database';
import { FileText, Image, Box } from 'lucide-react';

interface ContentBlocksDisplayProps {
  blocks: ContentBlock[];
  className?: string;
}

/**
 * Renders content blocks in read-only mode.
 * Supports text, media (images), and 3D model blocks.
 */
export function ContentBlocksDisplay({ blocks, className = '' }: ContentBlocksDisplayProps) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  // Sort blocks by order
  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold text-slate-900">Content</h3>
      
      {sortedBlocks.map((block) => (
        <ContentBlockItem key={block.id} block={block} />
      ))}
    </div>
  );
}

function ContentBlockItem({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'text':
      return (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-start gap-2">
              <FileText className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" />
              <p className="text-slate-900 whitespace-pre-wrap flex-1">{block.content}</p>
            </div>
          </CardContent>
        </Card>
      );

    case 'media':
      return (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-start gap-2 mb-2">
              <Image className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span className="text-sm text-slate-500">Image</span>
            </div>
            <img
              src={block.content}
              alt="Content media"
              className="w-full max-h-96 object-contain rounded-lg bg-slate-100"
            />
          </CardContent>
        </Card>
      );

    case 'model':
      return (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-start gap-2 mb-2">
              <Box className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span className="text-sm text-slate-500">
                3D Model ({block.platform || 'External'})
              </span>
            </div>
            <ModelEmbed url={block.content} />
          </CardContent>
        </Card>
      );

    default:
      return null;
  }
}
