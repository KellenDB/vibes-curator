// src/components/CreativeResponse.tsx
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Button from './Button';

interface Territory {
  territory: string;
  'Mood & Tone': string;
  Unique_Angles: string[];
  Key_Questions: string[];
}

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
}

const CreativeResponse: React.FC<CreativeResponseProps> = ({ response, onTerritorySelect }) => {
  const [parsedResponse, setParsedResponse] = useState<CreativeResponseType | null>(null);
  const [showTerritories, setShowTerritories] = useState(false); // Start collapsed

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
        {/* Creative Territories Section */}
        {parsedResponse.Creative_Territories?.length > 0 && (
          <div className="bg-white rounded-lg shadow-md border border-gray-100">
            <button
              onClick={() => setShowTerritories(!showTerritories)}
              className="w-full flex items-center justify-between px-8 py-6 border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-3xl font-light tracking-tight text-gray-900">Creative Territories</h2>
              {showTerritories ? (
                <ChevronUp className="w-6 h-6 text-gray-400" />
              ) : (
                <ChevronDown className="w-6 h-6 text-gray-400" />
              )}
            </button>
            
            {showTerritories && (
              <div className="px-8 py-6 space-y-8">
                {parsedResponse.Creative_Territories.map((territory, index) => (
                  <div 
                    key={index}
                    className="p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => onTerritorySelect?.(territory)}
                  >
                    {/* Territory Title */}
                    <h3 className="text-3xl font-medium text-gray-900 mb-8 pb-4 border-b border-gray-200">
                      {territory.territory}
                    </h3>
                    
                    <div className="space-y-6">
                      {/* Mood & Tone Section */}
                      <div className="bg-white rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-400 mb-3">
                          MOOD & TONE
                        </h4>
                        <p className="text-gray-800 leading-relaxed">
                          {territory['Mood & Tone']}
                        </p>
                      </div>

                      {/* Unique Angles Section */}
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

                      {/* Key Questions Section */}
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
                    </div>

                    <div className="mt-6 group flex items-center text-blue-600 hover:text-blue-700 font-medium">
                      <Button 
                          text="Explore this territory"
                          onClick={() => onTerritorySelect?.(territory)}
                      />
                      <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
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
