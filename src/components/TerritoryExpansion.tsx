// src/components/TerritoryExpansion.tsx
//DEPRECATED -- NO LONGER IN USE
import React, { useState } from 'react';
import Button from './Button';
import Modal from './Modal';
import ErrorMessage from './ErrorMessage';
import SuccessMessage from './SuccessMessage';
import CopyButton from './CopyButton';
import DownloadButton from './DownloadButton';

interface Territory {
  territory: string;
  'Mood & Tone': string;
  Unique_Angles: string[];
  Key_Questions: string[];
}

interface ExpansionData {
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
    approach?: {
      intent: string;
      vibes: string[];
    };
    brainstorm?: {
      workthrough: string;
    };
  };
  expansionData?: {
    expansion: ExpansionData;
    userContext?: {
      focusArea?: string;
      primaryChannel?: string;
      targetAudience?: string;
    };
  };
  onExpand?: (territory: Territory, userContext: any) => Promise<void>;
}

const TerritoryExpansion: React.FC<TerritoryExpansionProps> = ({ 
  isOpen,
  onClose,
  territory, 
  originalContext,
  expansionData,
  onExpand
}) => {
  const [expandedDetails, setExpandedDetails] = useState<ExpansionData | null>(null);
  const [isExpanding, setIsExpanding] = useState(false);
  const [focusArea, setFocusArea] = useState('');
  const [channel, setChannel] = useState('');
  const [audience, setAudience] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Reset state when territory changes
  React.useEffect(() => {
    // If we have expansion data from props, use it
    if (expansionData) {
      setExpandedDetails(expansionData.expansion);
      
      // If userContext is included in expansionData, restore it
      if (expansionData.userContext) {
        setFocusArea(expansionData.userContext.focusArea || '');
        setChannel(expansionData.userContext.primaryChannel || '');
        setAudience(expansionData.userContext.targetAudience || '');
      }
    } else {
      // Reset state for new territory
      setExpandedDetails(null);
      setFocusArea('');
      setChannel('');
      setAudience('');
    }
    
    setError(null);
    setSuccessMessage(null);
  }, [territory.territory, expansionData]);

  const handleExpand = async () => {
    if (!onExpand) return;
    
    setIsExpanding(true);
    setError(null);
    
    try {
      // Call the parent component's expansion handler
      await onExpand(territory, {
        focusArea: focusArea || undefined,
        primaryChannel: channel || undefined,
        targetAudience: audience || undefined
      });
      
      setSuccessMessage('Territory expanded successfully!');
      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error expanding territory:', error);
      setError(error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred while generating the territory expansion. Please try again with different inputs.');
        
      // Add user guidance in the error message
      if (error instanceof Error && 
          (error.message.includes('issue processing') || 
           error.message.includes('parse'))) {
        setError(`${error.message} Try using simpler language, fewer special characters, or breaking your request into smaller parts.`);
      }
    } finally {
      setIsExpanding(false);
    }
  };
  
  // Function to prepare content for copying
  const prepareCopyContent = () => {
    if (!expandedDetails) return '';
    
    let content = `# ${territory.territory} - Expansion\n\n`;
    
    // Add context if provided
    if (focusArea || channel || audience) {
      content += `## Context\n`;
      if (focusArea) content += `- Focus Area: ${focusArea}\n`;
      if (channel) content += `- Primary Channel: ${channel}\n`;
      if (audience) content += `- Target Audience: ${audience}\n`;
      content += `\n`;
    }
    
    content += `## Visual World\n\n`;
    
    content += `### Aesthetics\n`;
    expandedDetails.visual_world.aesthetics.forEach(item => {
      content += `- ${item}\n`;
    });
    
    content += `\n### Inspiration\n`;
    expandedDetails.visual_world.inspiration.forEach(item => {
      content += `- ${item}\n`;
    });
    
    content += `\n### Signature Elements\n`;
    expandedDetails.visual_world.signature_elements.forEach(item => {
      content += `- ${item}\n`;
    });
    
    content += `\n## Narrative Angles\n\n`;
    
    content += `### Key Stories\n`;
    expandedDetails.narrative_angles.key_stories.forEach(item => {
      content += `- ${item}\n`;
    });
    
    content += `\n### Messaging Themes\n`;
    expandedDetails.narrative_angles.messaging_themes.forEach(item => {
      content += `- ${item}\n`;
    });
    
    content += `\n### Tone Guidance\n${expandedDetails.narrative_angles.tone_guidance}\n`;
    
    content += `\n## Activation Opportunities\n\n`;
    
    content += `### Key Moments\n`;
    expandedDetails.activation_opportunities.key_moments.forEach(item => {
      content += `- ${item}\n`;
    });
    
    content += `\n### Platform Ideas\n`;
    expandedDetails.activation_opportunities.platform_ideas.forEach(item => {
      content += `- ${item}\n`;
    });
    
    content += `\n### Engagement Hooks\n`;
    expandedDetails.activation_opportunities.engagement_hooks.forEach(item => {
      content += `- ${item}\n`;
    });
    
    content += `\n## Evolution Questions\n`;
    expandedDetails.evolution_questions.forEach(item => {
      content += `- ${item}\n`;
    });
    
    return content;
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={territory.territory}
    >
      <div className="space-y-6">
        <p className="text-gray-700">{territory['Mood & Tone']}</p>
        
        {/* Show success or error messages */}
        {successMessage && (
          <SuccessMessage 
            message={successMessage} 
            onDismiss={() => setSuccessMessage(null)} 
          />
        )}
        
        {error && (
          <ErrorMessage 
            message={error} 
            onDismiss={() => setError(null)} 
          />
        )}
        
        {/* Optional Context Form - Show only if we don't have expansion data yet */}
        {!expandedDetails && (
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
        )}

        {/* Action Buttons - Show differently based on state */}
        {!expandedDetails ? (
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
        ) : (
          <div className="border-t border-gray-200 pt-4 mt-8">
            <h2 className="text-xl font-semibold mb-4">Territory Expansion</h2>
          </div>
        )}
        
        {/* Expanded Content */}
        {expandedDetails && (
          <div className="space-y-8 mt-4">
            {/* Display user context if provided */}
            {(focusArea || channel || audience) && (
              <div className="mb-4">
                <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-3">Context Applied</h4>
                <div className="flex flex-wrap gap-2">
                  {focusArea && (
                    <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                      <span className="font-medium">Focus:</span> {focusArea}
                    </div>
                  )}
                  {channel && (
                    <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                      <span className="font-medium">Channel:</span> {channel}
                    </div>
                  )}
                  {audience && (
                    <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                      <span className="font-medium">Audience:</span> {audience}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-4">
              <CopyButton 
                text={prepareCopyContent()} 
                label="Copy" 
              />
              <DownloadButton 
                content={prepareCopyContent()}
                filename={`${territory.territory.toLowerCase().replace(/\s+/g, '-')}-expansion.md`}
                label="Download MD"
              />
            </div>
            <div className="space-y-6">
              <h3 className="text-xl font-semibold bg-gray-50 p-3 rounded-md">Visual World</h3>
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
              <h3 className="text-xl font-semibold bg-gray-50 p-3 rounded-md">Narrative Angles</h3>
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
                <p className="p-4 bg-gray-50 rounded text-gray-700">{expandedDetails.narrative_angles.tone_guidance}</p>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold bg-gray-50 p-3 rounded-md">Activation Opportunities</h3>
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
              <h3 className="text-xl font-semibold bg-gray-50 p-3 rounded-md">Evolution Questions</h3>
              <ul className="list-disc pl-8 space-y-2">
                {expandedDetails.evolution_questions.map((question, i) => (
                  <li key={i} className="text-gray-700">{question}</li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
              <Button 
                text="Close" 
                onClick={onClose}
              />
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default TerritoryExpansion;