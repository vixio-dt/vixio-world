import { openrouter, AI_MODEL } from './openrouter';
import { ExtractedEntities, ExtractionResult } from './types';

const SYSTEM_PROMPT = `You are an entity extraction assistant for worldbuilding content.

Your task: Extract characters, locations, organizations, items, and events from the provided text.

Rules:
1. Return ONLY valid JSON matching the exact schema
2. Only include entities explicitly mentioned in the text
3. Do not invent or assume information not present
4. Preserve the author's original names and descriptions
5. For relationships, use free text like "ally of [name]"
6. If uncertain about an entity type, omit it

Return JSON in this exact format:
{
  "characters": [{ "name": "...", "role": "protagonist|antagonist|supporting|background", "species": "...", "appearance": "...", "personality": "...", "background": "...", "relationships": ["..."] }],
  "locations": [{ "name": "...", "type": "planet|continent|country|city|district|building|room", "description": "...", "atmosphere": "..." }],
  "organizations": [{ "name": "...", "type": "government|religion|corporation|guild|family|military|secret_society", "purpose": "...", "description": "..." }],
  "items": [{ "name": "...", "type": "weapon|vehicle|artifact|tool|document|clothing|technology", "description": "...", "significance": "..." }],
  "events": [{ "name": "...", "type": "historical|plot_point|scheduled|recurring", "description": "...", "date": "..." }]
}

Only include fields that have values. Empty arrays are fine.`;

export async function extractEntities(content: string): Promise<ExtractionResult> {
  if (!process.env.OPENROUTER_API_KEY) {
    return { success: false, error: 'AI features not configured' };
  }

  try {
    const response = await openrouter.chat.completions.create({
      model: AI_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Extract entities from this text:\n\n${content}` },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
      max_tokens: 4000,
    });

    const text = response.choices[0]?.message?.content;
    if (!text) {
      return { success: false, error: 'No response from AI' };
    }

    const entities: ExtractedEntities = JSON.parse(text);
    
    // Ensure all arrays exist
    return {
      success: true,
      entities: {
        characters: entities.characters || [],
        locations: entities.locations || [],
        organizations: entities.organizations || [],
        items: entities.items || [],
        events: entities.events || [],
      },
    };
  } catch (error) {
    console.error('Entity extraction error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Extraction failed',
    };
  }
}
