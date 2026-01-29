export type ModelPlatform = 'sketchfab' | 'tripo';

export interface ParsedModelUrl {
  platform: ModelPlatform;
  embedUrl: string;
  modelId: string;
}

/**
 * Parse a Sketchfab or Tripo AI share URL and extract embed information.
 * 
 * Supported formats:
 * - Sketchfab: https://sketchfab.com/3d-models/model-name-abc123def456
 * - Tripo AI: https://www.tripo3d.ai/app/share/xxx
 */
export function parseModelUrl(url: string): ParsedModelUrl | null {
  if (!url) return null;

  // Sketchfab format: https://sketchfab.com/3d-models/model-name-abc123def456
  // The model ID is the last 32 hex characters
  const sketchfabMatch = url.match(/sketchfab\.com\/3d-models\/[\w-]+-([a-f0-9]{32})/i);
  if (sketchfabMatch) {
    const modelId = sketchfabMatch[1];
    return {
      platform: 'sketchfab',
      embedUrl: `https://sketchfab.com/models/${modelId}/embed`,
      modelId,
    };
  }

  // Also handle direct Sketchfab model URLs: https://sketchfab.com/models/abc123
  const sketchfabDirectMatch = url.match(/sketchfab\.com\/models\/([a-f0-9]{32})/i);
  if (sketchfabDirectMatch) {
    const modelId = sketchfabDirectMatch[1];
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

/**
 * Check if a URL is a valid Sketchfab or Tripo AI model URL.
 */
export function isValidModelUrl(url: string): boolean {
  return parseModelUrl(url) !== null;
}
