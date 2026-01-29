'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Card } from '@/components/ui/Card';
import { extractFromContent, createExtractedEntities } from '@/lib/actions/import';
import { ExtractedEntities } from '@/lib/ai/types';

export default function ImportPage() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [entities, setEntities] = useState<ExtractedEntities | null>(null);
  const [selected, setSelected] = useState<{
    characters: number[];
    locations: number[];
    organizations: number[];
    items: number[];
    events: number[];
  }>({ characters: [], locations: [], organizations: [], items: [], events: [] });

  const handleExtract = async () => {
    if (!content.trim()) {
      setError('Please paste some content to extract from');
      return;
    }

    setLoading(true);
    setError('');
    setEntities(null);

    const result = await extractFromContent(content);

    if (result.success && result.entities) {
      setEntities(result.entities);
      // Select all by default
      setSelected({
        characters: result.entities.characters.map((_, i) => i),
        locations: result.entities.locations.map((_, i) => i),
        organizations: result.entities.organizations.map((_, i) => i),
        items: result.entities.items.map((_, i) => i),
        events: result.entities.events.map((_, i) => i),
      });
    } else {
      setError(result.error || 'Extraction failed');
    }

    setLoading(false);
  };

  const toggleSelection = (type: keyof typeof selected, index: number) => {
    setSelected(prev => ({
      ...prev,
      [type]: prev[type].includes(index)
        ? prev[type].filter(i => i !== index)
        : [...prev[type], index],
    }));
  };

  const handleCreate = async () => {
    if (!entities) return;

    // TODO: Get actual worldId from context/cookies
    const worldId = 'placeholder-world-id';

    setLoading(true);
    const result = await createExtractedEntities({
      worldId,
      entities,
      selected,
    });

    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Failed to create entities');
    }
    setLoading(false);
  };

  const totalSelected = Object.values(selected).flat().length;
  const totalFound = entities 
    ? entities.characters.length + entities.locations.length + 
      entities.organizations.length + entities.items.length + entities.events.length
    : 0;

  if (entities) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Extraction Results</h1>
          <Button variant="secondary" onClick={() => setEntities(null)}>
            ← Back
          </Button>
        </div>

        <p className="mb-6 text-zinc-400">
          Found {totalFound} entities. Review and select which ones to create.
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Characters */}
          {entities.characters.length > 0 && (
            <Card>
              <h2 className="mb-3 text-lg font-semibold text-white">
                Characters ({entities.characters.length})
              </h2>
              <div className="space-y-2">
                {entities.characters.map((char, idx) => (
                  <label key={idx} className="flex items-start gap-3 cursor-pointer hover:bg-zinc-800/50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={selected.characters.includes(idx)}
                      onChange={() => toggleSelection('characters', idx)}
                      className="mt-1"
                    />
                    <div>
                      <span className="font-medium text-white">{char.name}</span>
                      {char.role && (
                        <span className="ml-2 text-sm text-violet-400">({char.role})</span>
                      )}
                      {char.appearance && (
                        <p className="text-sm text-zinc-400 mt-1">{char.appearance}</p>
                      )}
                      {char.background && (
                        <p className="text-sm text-zinc-500 mt-1">{char.background}</p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </Card>
          )}

          {/* Locations */}
          {entities.locations.length > 0 && (
            <Card>
              <h2 className="mb-3 text-lg font-semibold text-white">
                Locations ({entities.locations.length})
              </h2>
              <div className="space-y-2">
                {entities.locations.map((loc, idx) => (
                  <label key={idx} className="flex items-start gap-3 cursor-pointer hover:bg-zinc-800/50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={selected.locations.includes(idx)}
                      onChange={() => toggleSelection('locations', idx)}
                      className="mt-1"
                    />
                    <div>
                      <span className="font-medium text-white">{loc.name}</span>
                      {loc.type && (
                        <span className="ml-2 text-sm text-emerald-400">({loc.type})</span>
                      )}
                      {loc.description && (
                        <p className="text-sm text-zinc-400 mt-1">{loc.description}</p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </Card>
          )}

          {/* Organizations */}
          {entities.organizations.length > 0 && (
            <Card>
              <h2 className="mb-3 text-lg font-semibold text-white">
                Organizations ({entities.organizations.length})
              </h2>
              <div className="space-y-2">
                {entities.organizations.map((org, idx) => (
                  <label key={idx} className="flex items-start gap-3 cursor-pointer hover:bg-zinc-800/50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={selected.organizations.includes(idx)}
                      onChange={() => toggleSelection('organizations', idx)}
                      className="mt-1"
                    />
                    <div>
                      <span className="font-medium text-white">{org.name}</span>
                      {org.type && (
                        <span className="ml-2 text-sm text-amber-400">({org.type})</span>
                      )}
                      {org.purpose && (
                        <p className="text-sm text-zinc-400 mt-1">{org.purpose}</p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </Card>
          )}

          {/* Items */}
          {entities.items.length > 0 && (
            <Card>
              <h2 className="mb-3 text-lg font-semibold text-white">
                Items ({entities.items.length})
              </h2>
              <div className="space-y-2">
                {entities.items.map((item, idx) => (
                  <label key={idx} className="flex items-start gap-3 cursor-pointer hover:bg-zinc-800/50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={selected.items.includes(idx)}
                      onChange={() => toggleSelection('items', idx)}
                      className="mt-1"
                    />
                    <div>
                      <span className="font-medium text-white">{item.name}</span>
                      {item.type && (
                        <span className="ml-2 text-sm text-cyan-400">({item.type})</span>
                      )}
                      {item.description && (
                        <p className="text-sm text-zinc-400 mt-1">{item.description}</p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </Card>
          )}

          {/* Events */}
          {entities.events.length > 0 && (
            <Card>
              <h2 className="mb-3 text-lg font-semibold text-white">
                Events ({entities.events.length})
              </h2>
              <div className="space-y-2">
                {entities.events.map((event, idx) => (
                  <label key={idx} className="flex items-start gap-3 cursor-pointer hover:bg-zinc-800/50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={selected.events.includes(idx)}
                      onChange={() => toggleSelection('events', idx)}
                      className="mt-1"
                    />
                    <div>
                      <span className="font-medium text-white">{event.name}</span>
                      {event.type && (
                        <span className="ml-2 text-sm text-rose-400">({event.type})</span>
                      )}
                      {event.date && (
                        <span className="ml-2 text-sm text-zinc-500">{event.date}</span>
                      )}
                      {event.description && (
                        <p className="text-sm text-zinc-400 mt-1">{event.description}</p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </Card>
          )}

          {totalFound === 0 && (
            <Card>
              <p className="text-zinc-400 text-center py-8">
                No entities found. Try adding more detail to your content.
              </p>
            </Card>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setEntities(null)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={loading || totalSelected === 0}>
            {loading ? 'Creating...' : `Create ${totalSelected} Selected`}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <Button variant="secondary" onClick={() => router.push('/dashboard')}>
          ← Back to Dashboard
        </Button>
      </div>

      <h1 className="mb-2 text-2xl font-bold text-white">Import Content</h1>
      <p className="mb-6 text-zinc-400">
        Paste your world bible, character notes, or story content below.
        AI will extract entities for you to review.
      </p>

      {error && (
        <div className="mb-4 rounded-lg bg-red-500/10 p-4 text-red-400">
          {error}
        </div>
      )}

      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={`Paste your content here...

Example:
Queen Aria rules Ironhold from the Crystal Palace. Her trusted advisor, Kael the Grey, has served the throne for thirty years. The city is protected by the Silver Guard, an elite military order founded after the Great War.

The Sunblade, an ancient weapon forged by the first king, hangs in the throne room. It's said to glow when danger approaches the realm.`}
        className="mb-4 min-h-[300px]"
      />

      <div className="flex items-center gap-4">
        <Button onClick={handleExtract} disabled={loading || !content.trim()}>
          {loading ? 'Extracting...' : 'Extract Entities'}
        </Button>
        {loading && (
          <span className="text-sm text-zinc-400">
            This may take a few seconds...
          </span>
        )}
      </div>
    </div>
  );
}
