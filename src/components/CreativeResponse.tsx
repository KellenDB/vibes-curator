import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface RefinedConcept {
  concept: string;
  'Color Palette': string[];
  color_exploration: string;
  'Mood & Tone': string;
  'Textures & Styling': string;
  Settings: string;
}

interface VibeResponse {
  Approach: {
    intent: string;
    vibes: string[];
  };
  Brainstorm: {
    workthrough: string;
  };
  'Refined Concepts': RefinedConcept[];
}

const CreativeResponse: React.FC<{ response: any }> = ({ response }) => {
  const [parsedResponse, setParsedResponse] = useState<VibeResponse | null>(null);
  const [showRefinedConcepts, setShowRefinedConcepts] = useState(false);

  useEffect(() => {
    try {
      const parsed = typeof response === 'string' ? JSON.parse(response) : response;
      console.log('Parsed response:', parsed);
      setParsedResponse(parsed);
    } catch (error) {
      console.error('Error parsing response:', error);
      console.log('Raw response:', response);
    }
  }, [response]);

  if (!parsedResponse) {
    return <div className="mt-8">Loading...</div>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 bg-[#f8f7f4]">
      <div className="space-y-8">
        {/* Approach Section */}
        <div className="bg-white rounded-lg shadow-md border border-gray-100">
          <div className="border-b border-gray-100 px-8 py-6">
            <h2 className="text-3xl font-light tracking-tight text-gray-900">Approach</h2>
          </div>
          <div className="px-8 py-6 space-y-6">
            {parsedResponse.Approach?.vibes?.length > 0 && (
              <div>
                <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-3">Vibes</h3>
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
                <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-3">Intent</h3>
                <p className="text-gray-700 leading-relaxed">{parsedResponse.Approach.intent}</p>
              </div>
            )}
          </div>
        </div>

        {/* Brainstorm Section */}
        {parsedResponse.Brainstorm?.workthrough && (
          <div className="bg-white rounded-lg shadow-md border border-gray-100">
            <div className="border-b border-gray-100 px-8 py-6">
              <h2 className="text-3xl font-light tracking-tight text-gray-900">Brainstorm</h2>
            </div>
            <div className="px-8 py-6">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{parsedResponse.Brainstorm.workthrough}</p>
            </div>
          </div>
        )}

        {/* Refined Concepts Section */}
        {parsedResponse['Refined Concepts']?.length > 0 && (
          <div className="bg-white rounded-lg shadow-md border border-gray-100">
            <button
              onClick={() => setShowRefinedConcepts(!showRefinedConcepts)}
              className="w-full flex items-center justify-between px-8 py-6 border-b border-gray-100"
            >
              <h2 className="text-3xl font-light tracking-tight text-gray-900">Refined Concepts</h2>
              {showRefinedConcepts ? (
                <ChevronUp className="w-6 h-6 text-gray-400" />
              ) : (
                <ChevronDown className="w-6 h-6 text-gray-400" />
              )}
            </button>
            
            {showRefinedConcepts && (
              <div className="px-8 py-6">
                {parsedResponse['Refined Concepts'].map((concept, index) => (
                  <div key={index} className="space-y-6">
                    <h3 className="text-2xl font-medium text-gray-900">{concept.concept}</h3>
                    
                    <div>
                      <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-3">Color Palette</h4>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {concept['Color Palette'].map((color, idx) => (
                          <span 
                            key={idx} 
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                          >
                            {color}
                          </span>
                        ))}
                      </div>
                      <p className="text-gray-700 leading-relaxed">{concept.color_exploration}</p>
                    </div>

                    <div>
                      <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-3">Mood & Tone</h4>
                      <p className="text-gray-700 leading-relaxed">{concept['Mood & Tone']}</p>
                    </div>

                    <div>
                      <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-3">Textures & Styling</h4>
                      <p className="text-gray-700 leading-relaxed">{concept['Textures & Styling']}</p>
                    </div>

                    <div>
                      <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-3">Settings</h4>
                      <p className="text-gray-700 leading-relaxed">{concept.Settings}</p>
                    </div>

                    {index < parsedResponse['Refined Concepts'].length - 1 && (
                      <hr className="my-8 border-gray-100" />
                    )}
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