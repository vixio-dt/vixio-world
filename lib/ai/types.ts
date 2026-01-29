// Extracted entity types from AI

export interface ExtractedCharacter {
  name: string;
  role?: 'protagonist' | 'antagonist' | 'supporting' | 'background';
  species?: string;
  appearance?: string;
  personality?: string;
  background?: string;
  relationships?: string[];
}

export interface ExtractedLocation {
  name: string;
  type?: 'planet' | 'continent' | 'country' | 'city' | 'district' | 'building' | 'room';
  description?: string;
  atmosphere?: string;
}

export interface ExtractedOrganization {
  name: string;
  type?: 'government' | 'religion' | 'corporation' | 'guild' | 'family' | 'military' | 'secret_society';
  purpose?: string;
  description?: string;
}

export interface ExtractedItem {
  name: string;
  type?: 'weapon' | 'vehicle' | 'artifact' | 'tool' | 'document' | 'clothing' | 'technology';
  description?: string;
  significance?: string;
}

export interface ExtractedEvent {
  name: string;
  type?: 'historical' | 'plot_point' | 'scheduled' | 'recurring';
  description?: string;
  date?: string;
}

export interface ExtractedEntities {
  characters: ExtractedCharacter[];
  locations: ExtractedLocation[];
  organizations: ExtractedOrganization[];
  items: ExtractedItem[];
  events: ExtractedEvent[];
}

export interface ExtractionResult {
  success: boolean;
  entities?: ExtractedEntities;
  error?: string;
}
