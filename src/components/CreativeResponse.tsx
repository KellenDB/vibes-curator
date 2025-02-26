// src/components/CreativeResponse.tsx
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Button from './Button';
import { Territory } from '../types';

interface CreativeResponseType {
  Approach: {
    intent: string;
    vibes: string[];
  };
  Brainstorm: {
    workthrough: string;
  };
  Creative_Territories: Territory[];
}

interface CreativeResponseProps {
  response: any;
  onTerritorySelect?: (territory: Territory) => void;
  compactMode?: boolean; // New prop for split view
}

const CreativeResponse: React.FC<CreativeResponseProps> = ({ 
  response, 
  onTerritorySelect,
  compactMode = false
}) => {
  const [parsedResponse, setParsedResponse] = useState<CreativeResponseType | null>(null);
  const [showTerritories, setShowTerritories] = useState(false); // Start collapsed
  const [selectedTerritoryId, setSelectedTerritoryId] = useState<string | null>(null);
  const [showFullIntent, setShowFullIntent] = useState(false);
  const [showFullBrainstorm, setShowFullBrainstorm] = useState(false);

  useEffect(() => {
    try {
      const parsed = typeof response === 'string' ? JSON.parse(response) : response;
      setParsedResponse(parsed);
    } catch (error) {
      console.error('Error parsing response:', error);
      console.log('Raw response:', response);
    }
  }, [response]);

  // When going into compact mode, auto-expand territories
  useEffect(() => {
    if (compactMode) {
      setShowTerritories(true);
      // Reset expanded states when entering compact mode
      setShowFullIntent(false);
      setShowFullBrainstorm(false);
    }
  }, [compactMode]);

  if (!parsedResponse) {
    return <div className="mt-8">Loading...</div>;
  }

  const handleTerritorySelect = (territory: Territory) => {
    setSelectedTerritoryId(territory.territory);
    if (onTerritorySelect) {
      onTerritorySelect(territory);
    }
  };

  return (
    <div className={`w-full mx-auto ${compactMode ? 'px-2 py-4' : 'px-4 py-8'} bg-[#f8f7f4]`}>
      <div className="space-y-6">
        {/* Approach Section - Show in both modes but with different styling */}
        <div className="bg-white rounded-lg shadow-md border border-gray-100">
          <div className={`border-b border-gray-100 ${compactMode ? 'px-4 py-3' : 'px-8 py-6'}`}>
            <h2 className={`${compactMode ? 'text-xl' : 'text-3xl'} font-light tracking-tight text-gray-900`}>Approach</h2>
          </div>
          <div className={`${compactMode ? 'px-4 py-3' : 'px-8 py-6'} space-y-4`}>
            {parsedResponse.Approach?.vibes?.length > 0 && (
              <div>
                <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-2">Vibes</h3>
                <div className="flex flex-wrap gap-2">
                  {parsedResponse.Approach.vibes.map((vibe, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {vibe}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {parsedResponse.Approach?.intent && (
              <div>
                <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-2">Intent</h3>
                <p className={`text-gray-700 leading-relaxed ${compactMode ? 'text-sm' : ''}`}>
                  {compactMode && !showFullIntent
                    ? parsedResponse.Approach.intent.length > 150
                      ? parsedResponse.Approach.intent.substring(0, 150) + '...'
                      : parsedResponse.Approach.intent
                    : parsedResponse.Approach.intent
                  }
                </p>
                {compactMode && parsedResponse.Approach.intent.length > 150 && !showFullIntent && (
                  <button 
                    className="text-blue-600 text-sm mt-1 hover:underline"
                    onClick={() => setShowFullIntent(true)}
                  >
                    Read more
                  </button>
                )}
                {compactMode && showFullIntent && (
                  <button 
                    className="text-blue-600 text-sm mt-1 hover:underline"
                    onClick={() => setShowFullIntent(false)}
                  >
                    Show less
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Brainstorm Section - Show in both modes but condense in compact mode */}
        {parsedResponse.Brainstorm?.workthrough && (
          <div className="bg-white rounded-lg shadow-md border border-gray-100">
            <div className={`border-b border-gray-100 ${compactMode ? 'px-4 py-3' : 'px-8 py-6'}`}>
              <h2 className={`${compactMode ? 'text-xl' : 'text-3xl'} font-light tracking-tight text-gray-900`}>Brainstorm</h2>
            </div>
            <div className={`${compactMode ? 'px-4 py-3' : 'px-8 py-6'}`}>
              <p className={`text-gray-700 leading-relaxed ${compactMode ? 'text-sm' : ''} whitespace-pre-wrap`}>
                {compactMode && !showFullBrainstorm
                  ? parsedResponse.Brainstorm.workthrough.split('\n\n')[0].substring(0, 150) + '...'
                  : parsedResponse.Brainstorm.workthrough
                }
              </p>
              {compactMode && !showFullBrainstorm && (
                <button 
                  className="text-blue-600 text-sm mt-2 hover:underline"
                  onClick={() => setShowFullBrainstorm(true)}
                >
                  View full brainstorm
                </button>
              )}
              {compactMode && showFullBrainstorm && (
                <button 
                  className="text-blue-600 text-sm mt-2 hover:underline"
                  onClick={() => setShowFullBrainstorm(false)}
                >
                  Show less
                </button>
              )}
            </div>
          </div>
        )}
        
        {/* Creative Territories Section */}
        {parsedResponse.Creative_Territories?.length > 0 && (
          <div className="bg-white rounded-lg shadow-md border border-gray-100">
            <button
              onClick={() => setShowTerritories(!showTerritories)}
              className={`w-full flex items-center justify-between ${compactMode ? 'px-4 py-3' : 'px-8 py-6'} border-b border-gray-100 hover:bg-gray-50 transition-colors`}
            >
              <h2 className={`${compactMode ? 'text-xl' : 'text-3xl'} font-light tracking-tight text-gray-900`}>
                Creative Territories
              </h2>
              {showTerritories ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            
            {showTerritories && (
              <div className={`${compactMode ? 'px-4 py-3' : 'px-8 py-6'} space-y-6`}>
                {parsedResponse.Creative_Territories.map((territory, index) => (
                  <div 
                    key={index}
                    className={`p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer ${selectedTerritoryId === territory.territory ? 'ring-2 ring-black' : ''}`}
                    onClick={() => handleTerritorySelect(territory)}
                  >
                    {/* Territory Title */}
                    <h3 className={`${compactMode ? 'text-lg' : 'text-2xl'} font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200`}>
                      {territory.territory}
                    </h3>
                    
                    <div className={`space-y-4 ${compactMode ? 'text-sm' : ''}`}>
                      {/* Mood & Tone Section - Show in all modes */}
                      <div className="bg-white rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-400 mb-2">
                          MOOD & TONE
                        </h4>
                        <p className="text-gray-800 leading-relaxed">
                          {territory['Mood & Tone']}
                        </p>
                      </div>

                      {/* Unique Angles Section - Hide in compact mode */}
                      {!compactMode && (
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="text-sm font-medium text-gray-400 mb-3">
                            UNIQUE ANGLES
                          </h4>
                          <ul className="list-disc pl-4 space-y-2">
                            {territory.Unique_Angles.map((angle, i) => (
                              <li key={i} className="text-gray-800 leading-relaxed">
                                {angle}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Key Questions Section - Hide in compact mode */}
                      {!compactMode && (
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="text-sm font-medium text-gray-400 mb-3">
                            KEY QUESTIONS
                          </h4>
                          <ul className="list-disc pl-4 space-y-2">
                            {territory.Key_Questions.map((question, i) => (
                              <li key={i} className="text-gray-800 leading-relaxed">
                                {question}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className={`${compactMode ? 'mt-4' : 'mt-6'} group flex items-center text-blue-600 hover:text-blue-700 font-medium`}>
                      <button 
                        className="inline-flex items-center text-blue-600 hover:text-blue-800"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTerritorySelect(territory);
                        }}
                      >
                        {selectedTerritoryId === territory.territory ? 'Currently exploring' : 'Explore this territory'}
                        <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreativeResponse;