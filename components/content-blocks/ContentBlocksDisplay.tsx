'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui';
import { ModelEmbed } from '@/components/models';
import type { ContentBlock } from '@/lib/types/database';
import { FileText, Image, Box } from 'lucide-react';

// Entity type to URL path mapping
const entityPaths: Record<string, string> = {
  character: '/characters',
  location: '/locations',
  organization: '/organizations',
  event: '/timeline',
  item: '/items',
  rule: '/rules',
  story: '/stories',
};

/**
 * Render text with @mentions as clickable links.
 */
function renderTextWithMentions(text: string): React.ReactNode[] {
  const mentionRegex = /@\[(\w+):([a-f0-9-]+):([^\]]+)\]/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = mentionRegex.exec(text)) !== null) {
    // Add text before mention
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    // Add mention as link
    const [, type, id, name] = match;
    const path = entityPaths[type] || '/dashboard';
    
    parts.push(
      <Link
        key={`${type}-${id}-${match.index}`}
        href={`${path}/${id}`}
        className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded text-sm font-medium transition-colors"
      >
        @{name}
      </Link>
    );

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

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
              <div className="text-slate-900 whitespace-pre-wrap flex-1">
                {renderTextWithMentions(block.content)}
              </div>
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
