'use server';

import { createClient } from '@/lib/supabase/server';
import { extractEntities } from '@/lib/ai/extract-entities';
import { ExtractedEntities, ExtractionResult } from '@/lib/ai/types';
import { revalidatePath } from 'next/cache';

export async function extractFromContent(content: string): Promise<ExtractionResult> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  return extractEntities(content);
}

interface CreateEntitiesParams {
  worldId: string;
  entities: ExtractedEntities;
  selected: {
    characters: number[];
    locations: number[];
    organizations: number[];
    items: number[];
    events: number[];
  };
}

export async function createExtractedEntities(params: CreateEntitiesParams): Promise<{ success: boolean; error?: string; created?: number }> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  const { worldId, entities, selected } = params;
  let created = 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any;

  try {
    // Create selected characters
    for (const idx of selected.characters) {
      const char = entities.characters[idx];
      if (char) {
        await db.from('characters').insert({
          world_id: worldId,
          name: char.name,
          role: char.role || null,
          species: char.species || null,
          appearance: char.appearance || null,
          personality: char.personality || null,
          background: char.background || null,
        });
        created++;
      }
    }

    // Create selected locations
    for (const idx of selected.locations) {
      const loc = entities.locations[idx];
      if (loc) {
        await db.from('locations').insert({
          world_id: worldId,
          name: loc.name,
          type: loc.type || null,
          description: loc.description || null,
          atmosphere: loc.atmosphere || null,
        });
        created++;
      }
    }

    // Create selected organizations
    for (const idx of selected.organizations) {
      const org = entities.organizations[idx];
      if (org) {
        await db.from('organizations').insert({
          world_id: worldId,
          name: org.name,
          type: org.type || null,
          purpose: org.purpose || null,
        });
        created++;
      }
    }

    // Create selected items
    for (const idx of selected.items) {
      const item = entities.items[idx];
      if (item) {
        await db.from('items').insert({
          world_id: worldId,
          name: item.name,
          type: item.type || null,
          description: item.description || null,
          significance: item.significance || null,
        });
        created++;
      }
    }

    // Create selected events
    for (const idx of selected.events) {
      const event = entities.events[idx];
      if (event) {
        await db.from('events').insert({
          world_id: worldId,
          name: event.name,
          type: event.type || null,
          description: event.description || null,
          date: event.date || null,
        });
        created++;
      }
    }

    revalidatePath('/dashboard');
    return { success: true, created };
  } catch (error) {
    console.error('Create entities error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create entities',
    };
  }
}
