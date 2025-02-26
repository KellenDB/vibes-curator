// src/components/TerritoryDetails.tsx
import React, { useState } from 'react';
import { 
  Territory, 
  TerritoryExpansionResponse, 
  UserContext 
} from '../types';
import ContextInputs from './ContextInputs';
import CopyButton from './CopyButton';
import DownloadButton from './DownloadButton';
import ErrorMessage from './ErrorMessage';
import SuccessMessage from './SuccessMessage';
import LoadingSpinner from './LoadingSpinner';
import { RefreshCw, Settings } from 'lucide-react';

interface TerritoryDetailsProps {
  territory: Territory;
  expansionData: TerritoryExpansionResponse | null;
  isLoading: boolean;
  error: string | null;
  onUpdateContext: (territory: Territory, userContext: UserContext) => Promise<void>;
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
}

const TerritoryDetails: React.FC<TerritoryDetailsProps> = ({
  territory,
  expansionData,
  isLoading,
  error,
  onUpdateContext,
  originalContext
}) => {
  const [showContextForm, setShowContextForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Function to handle updating territory with new context
  const handleContextUpdate = async (newContext: UserContext) => {
    await onUpdateContext(territory, newContext);
    setShowContextForm(false);
    setSuccessMessage('Territory updated with new context!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };
  
  // Function to prepare content for copying and downloading
  const prepareCopyContent = () => {
    if (!expansionData?.expansion) return '';
    
    const expansion = expansionData.expansion;
    const userContext = expansionData.userContext;
    
    let content = `# ${territory.territory} - Expansion\n\n`;
    
    // Add context if provided
    if (userContext?.focusArea || userContext?.primaryChannel || userContext?.targetAudience) {
      content += `## Context\n`;
      if (userContext.focusArea) content += `- Focus Area: ${userContext.focusArea}\n`;
      if (userContext.primaryChannel) content += `- Primary Channel: ${userContext.primaryChannel}\n`;
      if (userContext.targetAudience) content += `- Target Audience: ${userContext.targetAudience}\n`;
      content += `\n`;
    }
    
    content += `## Original Brief\n`;
    content += `- Product: ${originalContext.product}\n`;
    content += `- Direction: ${originalContext.direction}\n`;
    content += `- Vibes: ${originalContext.vibes.join(', ')}\n\n`;
    
    content += `## Visual World\n\n`;
    
    content += `### Aesthetics\n`;
    expansion.visual_world.aesthetics.forEach(item => {
      content += `- ${item}\n`;
    });
    
    content += `\n### Inspiration\n`;
    expansion.visual_world.inspiration.forEach(item => {
      content += `- ${item}\n`;
    });
    
    content += `\n### Signature Elements\n`;
    expansion.visual_world.signature_elements.forEach(item => {
      content += `- ${item}\n`;
    });
    
    content += `\n## Narrative Angles\n\n`;
    
    content += `### Key Stories\n`;
    expansion.narrative_angles.key_stories.forEach(item => {
      content += `- ${item}\n`;
    });
    
    content += `\n### Messaging Themes\n`;
    expansion.narrative_angles.messaging_themes.forEach(item => {
      content += `- ${item}\n`;
    });
    
    content += `\n### Tone Guidance\n${expansion.narrative_angles.tone_guidance}\n`;
    
    content += `\n## Activation Opportunities\n\n`;
    
    content += `### Key Moments\n`;
    expansion.activation_opportunities.key_moments.forEach(item => {
      content += `- ${item}\n`;
    });
    
    content += `\n### Platform Ideas\n`;
    expansion.activation_opportunities.platform_ideas.forEach(item => {
      content += `- ${item}\n`;
    });
    
    content += `\n### Engagement Hooks\n`;
    expansion.activation_opportunities.engagement_hooks.forEach(item => {
      content += `- ${item}\n`;
    });
    
    content += `\n## Evolution Questions\n`;
    expansion.evolution_questions.forEach(item => {
      content += `- ${item}\n`;
    });
    
    return content;
  };

  // If loading and no expansion data yet, show spinner
  if (isLoading && !expansionData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <LoadingSpinner />
        <p className="mt-4 text-gray-500">Generating territory expansion...</p>
      </div>
    );
  }

  // If error and no expansion data, show error message
  if (error && !expansionData) {
    return <ErrorMessage message={error} />;
  }

  // If no expansion data yet, show a placeholder
  if (!expansionData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <p className="text-gray-500">Waiting for territory expansion...</p>
      </div>
    );
  }

  const expansion = expansionData.expansion;
  const userContext = expansionData.userContext;

  return (
    <div className="space-y-8">
      {/* Territory overview and context */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="text-2xl font-semibold mb-2">{territory.territory}</h2>
        <p className="text-gray-700 mb-4">{territory['Mood & Tone']}</p>
        
        {/* Context badge section */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-2">Applied Context</h3>
            <div className="flex flex-wrap gap-2">
              {userContext?.focusArea ? (
                <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                  <span className="font-medium">Focus:</span> {userContext.focusArea}
                </div>
              ) : null}
              
              {userContext?.primaryChannel ? (
                <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                  <span className="font-medium">Channel:</span> {userContext.primaryChannel}
                </div>
              ) : null}
              
              {userContext?.targetAudience ? (
                <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                  <span className="font-medium">Audience:</span> {userContext.targetAudience}
                </div>
              ) : null}
              
              {!userContext?.focusArea && !userContext?.primaryChannel && !userContext?.targetAudience && (
                <div className="text-gray-500 text-sm italic">No additional context applied</div>
              )}
            </div>
          </div>
          
          <button
            onClick={() => setShowContextForm(!showContextForm)}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {showContextForm ? (
              <>Hide Context Form</>
            ) : (
              <>
                <Settings className="w-4 h-4 mr-1.5" />
                Update Context
              </>
            )}
          </button>
        </div>
        
        {/* Success Message */}
        {successMessage && (
          <div className="mt-4">
            <SuccessMessage message={successMessage} onDismiss={() => setSuccessMessage(null)} />
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div className="mt-4">
            <ErrorMessage message={error} />
          </div>
        )}
        
        {/* Context update form */}
        {showContextForm && (
          <div className="mt-6 border-t border-gray-200 pt-4">
            <h3 className="text-lg font-medium mb-4">Update Context</h3>
            <div className="max-w-lg mx-auto">
              <ContextInputs
                onSubmit={handleContextUpdate}
                onCancel={() => setShowContextForm(false)}
                isLoading={isLoading}
                initialContext={userContext}
              />
            </div>
          </div>
        )}
        
        {/* Export options */}
        <div className="mt-6 flex justify-end space-x-4">
          <CopyButton 
            text={prepareCopyContent()} 
            label="Copy All" 
          />
          <DownloadButton 
            content={prepareCopyContent()}
            filename={`${territory.territory.toLowerCase().replace(/\s+/g, '-')}-expansion.md`}
            label="Download MD"
          />
        </div>
      </div>
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-white/70 flex items-center justify-center z-10">
          <div className="text-center">
            <LoadingSpinner />
            <p className="mt-4 text-gray-600">Updating territory expansion...</p>
          </div>
        </div>
      )}
      
      {/* Visual World Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold mb-6 pb-2 border-b border-gray-100">Visual World</h2>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-md font-medium text-gray-800 mb-3">Aesthetics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {expansion.visual_world.aesthetics.map((item, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-md">
                  {item}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-md font-medium text-gray-800 mb-3">Inspiration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {expansion.visual_world.inspiration.map((item, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-md">
                  {item}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-md font-medium text-gray-800 mb-3">Signature Elements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {expansion.visual_world.signature_elements.map((item, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-md">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Narrative Angles Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold mb-6 pb-2 border-b border-gray-100">Narrative Angles</h2>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-md font-medium text-gray-800 mb-3">Key Stories</h3>
            <div className="space-y-4">
              {expansion.narrative_angles.key_stories.map((item, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-md">
                  {item}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-md font-medium text-gray-800 mb-3">Messaging Themes</h3>
            <div className="space-y-4">
              {expansion.narrative_angles.messaging_themes.map((item, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-md">
                  {item}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-md font-medium text-gray-800 mb-3">Tone Guidance</h3>
            <div className="p-4 bg-gray-50 rounded-md">
              {expansion.narrative_angles.tone_guidance}
            </div>
          </div>
        </div>
      </div>
      
      {/* Activation Opportunities Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold mb-6 pb-2 border-b border-gray-100">Activation Opportunities</h2>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-md font-medium text-gray-800 mb-3">Key Moments</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {expansion.activation_opportunities.key_moments.map((item, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-md">
                  {item}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-md font-medium text-gray-800 mb-3">Platform Ideas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {expansion.activation_opportunities.platform_ideas.map((item, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-md">
                  {item}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-md font-medium text-gray-800 mb-3">Engagement Hooks</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {expansion.activation_opportunities.engagement_hooks.map((item, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-md">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Evolution Questions Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold mb-6 pb-2 border-b border-gray-100">Evolution Questions</h2>
        
        <ul className="list-disc pl-8 space-y-4">
          {expansion.evolution_questions.map((question, i) => (
            <li key={i} className="text-gray-800">
              {question}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TerritoryDetails;