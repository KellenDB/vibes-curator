// src/types/index.ts
// Shared types across components

export interface Territory {
    territory: string;
    'Mood & Tone': string;
    Unique_Angles: string[];
    Key_Questions: string[];
  }
  
  export interface ExpansionData {
    visual_world: {
      aesthetics: string[];
      inspiration: string[];
      signature_elements: string[];
    };
    narrative_angles: {
      key_stories: string[];
      messaging_themes: string[];
      tone_guidance: string;
    };
    activation_opportunities: {
      key_moments: string[];
      platform_ideas: string[];
      engagement_hooks: string[];
    };
    evolution_questions: string[];
  }
  
  export interface UserContext {
    focusArea?: string;
    primaryChannel?: string;
    targetAudience?: string;
  }
  
  export interface TerritoryExpansionResponse {
    expansion: ExpansionData;
    userContext?: UserContext;
  }
  
  export interface CreativeResponseType {
    Approach: {
      vibes: string[];
      intent: string;
    };
    Brainstorm: {
      workthrough: string;
    };
    Creative_Territories: Territory[];
  }