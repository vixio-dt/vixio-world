'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { parseModelUrl, ModelPlatform } from '@/lib/utils/model-url';

interface AddModelButtonProps {
  onAdd: (url: string, platform: ModelPlatform) => void;
}

/**
 * Button that opens a modal for adding a 3D model URL.
 * Validates that the URL is a supported Sketchfab or Tripo AI link.
 */
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

  const handleClose = () => {
    setIsOpen(false);
    setUrl('');
    setError('');
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
      <div className="w-full max-w-md rounded-lg bg-zinc-900 p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Add 3D Model</h3>
          <button
            onClick={handleClose}
            className="text-zinc-400 hover:text-white transition-colors"
            aria-label="Close"
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
            autoFocus
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
              onClick={handleClose}
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
