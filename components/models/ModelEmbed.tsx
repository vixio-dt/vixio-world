'use client';

import { parseModelUrl, ModelPlatform } from '@/lib/utils/model-url';

interface ModelEmbedProps {
  url: string;
  platform?: ModelPlatform;
  className?: string;
}

/**
 * Renders a 3D model embed from Sketchfab or Tripo AI.
 * Parses the share URL and renders the appropriate iframe.
 */
export function ModelEmbed({ url, className = '' }: ModelEmbedProps) {
  const parsed = parseModelUrl(url);
  
  if (!parsed) {
    return (
      <div className={`flex items-center justify-center rounded-lg bg-zinc-800 p-4 text-zinc-400 ${className}`}>
        <span>Invalid model URL</span>
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
        loading="lazy"
      />
    </div>
  );
}
