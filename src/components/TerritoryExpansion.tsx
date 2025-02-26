// src/components/TerritoryExpansion.tsx
import React, { useState } from 'react';
import Button from './Button';
import Modal from './Modal';

interface Territory {
  territory: string;
  'Mood & Tone': string;
  Unique_Angles: string[];
  Key_Questions: string[];
}

interface TerritoryExpansion {
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

interface TerritoryExpansionProps {
    isOpen: boolean;
    onClose: () => void;
    territory: Territory;
    originalContext: {
      product: string;
      direction: string;
      vibes: string[];
      approach: {
        intent: string;
        vibes: string[];
      };
      brainstorm: {
        workthrough: string;
      };
    };
  }

  const TerritoryExpansion: React.FC<TerritoryExpansionProps> = ({ 
    isOpen,
    onClose,
    territory, 
    originalContext 
  }) => {
    const [expandedDetails, setExpandedDetails] = useState<TerritoryExpansion | null>(null);
    const [isExpanding, setIsExpanding] = useState(false);
    const [focusArea, setFocusArea] = useState('');
    const [channel, setChannel] = useState('');
    const [audience, setAudience] = useState('');
  
    const handleExpand = async () => {
      setIsExpanding(true);
      try {
        const response = await fetch('/api/expand-territory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            territory,
            originalContext,
            userContext: {
              focusArea: focusArea || undefined,
              primaryChannel: channel || undefined,
              targetAudience: audience || undefined
            }
          })
        });
  
        const data = await response.json();
        setExpandedDetails(data.expansion);
      } catch (error) {
        console.error('Error expanding territory:', error);
      } finally {
        setIsExpanding(false);
      }
    };
  
    return (
      <Modal 
        isOpen={isOpen} 
        onClose={onClose}
        title={territory.territory}
      >
        <div className="space-y-6">
          <p className="text-gray-700">{territory['Mood & Tone']}</p>
          
          {/* Optional Context Form */}
          <div className="space-y-4 bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-medium">Add Context (Optional)</h3>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Specific Focus Areas
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="Any specific aspects to explore?"
                value={focusArea}
                onChange={(e) => setFocusArea(e.target.value)}
              />
            </div>
  
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Primary Channel
              </label>
              <select
                className="w-full p-2 border rounded"
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
              >
                <option value="">Select a channel</option>
                <option value="Social">Social</option>
                <option value="Digital">Digital</option>
                <option value="Experiential">Experiential</option>
                <option value="Integrated">Integrated</option>
              </select>
            </div>
  
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Target Audience Details
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="Any specific audience context?"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
              />
            </div>
          </div>
  
          <div className="flex justify-end space-x-4">
            <Button 
              text="Cancel" 
              onClick={onClose}
            />
            <Button
              text={isExpanding ? 'Expanding...' : 'Deep Dive'}
              onClick={handleExpand}
              disabled={isExpanding}
            />
          </div>
          

      {/* Expanded Content */}
      {expandedDetails && (
        <div className="mt-8 space-y-8">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Visual World</h3>
            <div>
              <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-3">Aesthetics</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {expandedDetails.visual_world.aesthetics.map((item, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-3">Inspiration</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {expandedDetails.visual_world.inspiration.map((item, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-3">Signature Elements</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {expandedDetails.visual_world.signature_elements.map((item, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Narrative Angles</h3>
            <div>
              <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-3">Key Stories</h4>
              <div className="grid grid-cols-1 gap-4">
                {expandedDetails.narrative_angles.key_stories.map((item, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-3">Messaging Themes</h4>
              <div className="grid grid-cols-1 gap-4">
                {expandedDetails.narrative_angles.messaging_themes.map((item, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-3">Tone Guidance</h4>
              <p className="text-gray-700">{expandedDetails.narrative_angles.tone_guidance}</p>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Activation Opportunities</h3>
            <div>
              <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-3">Key Moments</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {expandedDetails.activation_opportunities.key_moments.map((item, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-3">Platform Ideas</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {expandedDetails.activation_opportunities.platform_ideas.map((item, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-3">Engagement Hooks</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {expandedDetails.activation_opportunities.engagement_hooks.map((item, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Evolution Questions</h3>
            <ul className="list-disc pl-4 space-y-2">
              {expandedDetails.evolution_questions.map((question, i) => (
                <li key={i} className="text-gray-700">{question}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
    </Modal>
  );
};

export default TerritoryExpansion;