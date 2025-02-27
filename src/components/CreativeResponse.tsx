// src/components/CreativeResponse.tsx
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TerritoryCard from './TerritoryCard';
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
  compactMode?: boolean;
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
      console.log("Response to parse:", response);
      const parsed = typeof response === 'string' ? JSON.parse(response) : response;
      console.log("Parsed response:", parsed);
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
    // Only mark as selected if it's not already selected (toggling behavior)
    const newSelectedId = selectedTerritoryId === territory.territory ? null : territory.territory;
    setSelectedTerritoryId(newSelectedId);
    
    if (onTerritorySelect) {
      onTerritorySelect(territory);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <motion.div 
      className={`w-full mx-auto ${compactMode ? 'px-2 py-4' : 'px-4 py-8'} bg-texture`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="space-y-6">
        {/* Approach Section */}
        <motion.div 
          className="card bg-card"
          variants={itemVariants}
        >
          <div className={`border-b border-border ${compactMode ? 'px-4 py-3' : 'px-8 py-6'}`}>
            <div className="flex items-center">
              <Sparkles className="w-5 h-5 text-secondary mr-2" />
              <h2 className={`${compactMode ? 'text-xl' : 'text-2xl'} font-medium tracking-tight text-card-foreground`}>
                Approach
              </h2>
            </div>
          </div>
          <div className={`${compactMode ? 'px-4 py-3' : 'px-8 py-6'} space-y-4`}>
            {parsedResponse.Approach?.vibes?.length > 0 && (
              <div>
                <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3">
                  Vibes
                </h3>
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
                <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium mb-3">
                  Intent
                </h3>
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
                    className="text-primary text-sm mt-1 hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                    onClick={() => setShowFullIntent(true)}
                  >
                    Read more
                  </button>
                )}
                {compactMode && showFullIntent && (
                  <button 
                    className="text-primary text-sm mt-1 hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                    onClick={() => setShowFullIntent(false)}
                  >
                    Show less
                  </button>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Brainstorm Section */}
        {parsedResponse.Brainstorm?.workthrough && (
          <motion.div 
            className="card bg-card"
            variants={itemVariants}
          >
            <div className={`border-b border-border ${compactMode ? 'px-4 py-3' : 'px-8 py-6'}`}>
              <h2 className={`${compactMode ? 'text-xl' : 'text-2xl'} font-medium tracking-tight text-card-foreground`}>
                Brainstorm
              </h2>
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
                  className="text-primary text-sm mt-2 hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                  onClick={() => setShowFullBrainstorm(true)}
                >
                  View full brainstorm
                </button>
              )}
              {compactMode && showFullBrainstorm && (
                <button 
                  className="text-primary text-sm mt-2 hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                  onClick={() => setShowFullBrainstorm(false)}
                >
                  Show less
                </button>
              )}
            </div>
          </motion.div>
        )}
        
        {/* Creative Territories Section */}
        {parsedResponse.Creative_Territories?.length > 0 && (
          <motion.div 
            className="card bg-card"
            variants={itemVariants}
          >
            <button
              onClick={() => setShowTerritories(!showTerritories)}
              className={`w-full flex items-center justify-between ${compactMode ? 'px-4 py-3' : 'px-8 py-6'} border-b border-border hover:bg-gray-50 transition-colors`}
            >
              <h2 className={`${compactMode ? 'text-xl' : 'text-2xl'} font-medium tracking-tight text-card-foreground`}>
                Creative Territories
              </h2>
              {showTerritories ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            
            <AnimatePresence mode="wait">
              {showTerritories && (
                <motion.div 
                  className={`${compactMode ? 'px-4 py-3' : 'px-8 py-6'}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-6">
                    {parsedResponse.Creative_Territories.map((territory, index) => (
                      <TerritoryCard
                        key={territory.territory}
                        territory={territory}
                        isSelected={selectedTerritoryId === territory.territory}
                        onSelect={() => handleTerritorySelect(territory)}
                        index={index}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default CreativeResponse;