// src/components/TerritoryCard.tsx
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Territory } from "../types";

interface TerritoryCardProps {
  territory: Territory;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}

const TerritoryCard: React.FC<TerritoryCardProps> = ({ 
  territory, 
  isSelected,
  onSelect,
  index
}) => {
  // Generate a gradient background based on the territory name
  // This creates a unique but consistent gradient for each territory
  const colors = useMemo(() => {
    const getGradient = (str: string) => {
      // Simple hash function to get a number from string
      const hash = str.split('').reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc);
      }, 0);
      
      // Use the hash to generate hue values (keep in warm or cool tones)
      const baseHue = Math.abs(hash % 360);
      const hue1 = (baseHue % 180) + (baseHue > 180 ? 0 : 180); // 0-179 or 180-359
      const hue2 = (hue1 + 30) % 360;
      
      return {
        main: `hsla(${hue1}, 80%, 50%, 0.05)`,
        accent: `hsla(${hue2}, 90%, 60%, 0.8)`,
        highlight: `hsla(${hue1}, 95%, 60%, 0.1)`
      };
    };
    
    return getGradient(territory.territory);
  }, [territory.territory]);
  
  return (
    <motion.div 
      className={`relative overflow-hidden rounded-lg cursor-pointer
                 border border-border shadow-sm transition-all duration-300
                 ${isSelected ? 'ring-2 ring-primary' : 'hover:shadow-md'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.1,
        ease: [0.23, 1, 0.32, 1]
      }}
      whileHover={{ y: -4 }}
      onClick={onSelect}
      style={{
        background: `linear-gradient(135deg, ${colors.main}, white)`
      }}
    >
      {/* Accent bar */}
      <div 
        className="h-1 w-full absolute top-0 left-0"
        style={{ 
          background: `linear-gradient(to right, ${colors.accent}, transparent 80%)`
        }}
      />
      
      <div className="p-8">
        {/* Title Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-3 text-card-foreground tracking-tight">
            {territory.territory}
          </h3>
          
          <div className="w-12 h-1 bg-secondary rounded-full opacity-75 mb-6"></div>
          
          <p className="text-gray-600 text-sm italic">
            Creative Territory
          </p>
        </div>
        
        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Mood & Tone */}
            <div>
              <h4 className="text-xs font-medium uppercase tracking-widest text-gray-500 mb-3">
                Mood & Tone
              </h4>
              <p className="text-gray-700 leading-relaxed">
                {territory['Mood & Tone']}
              </p>
            </div>
            
            {/* Unique Angles */}
            {territory.Unique_Angles && territory.Unique_Angles.length > 0 && (
              <div>
                <h4 className="text-xs font-medium uppercase tracking-widest text-gray-500 mb-3">
                  Unique Angles
                </h4>
                <ul className="space-y-3">
                  {territory.Unique_Angles.map((angle, idx) => (
                    <li key={idx} className="text-gray-700 flex">
                      <span className="text-secondary mr-2">•</span>
                      <span>{angle}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {/* Right Column */}
          <div>
            {/* Key Questions */}
            {territory.Key_Questions && territory.Key_Questions.length > 0 && (
              <div>
                <h4 className="text-xs font-medium uppercase tracking-widest text-gray-500 mb-3">
                  Key Questions
                </h4>
                <ul className="space-y-4">
                  {territory.Key_Questions.map((question, idx) => (
                    <li key={idx} className="text-gray-700 italic border-l-2 border-gray-200 pl-4 py-1">
                      "{question}"
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        
        {/* Action button */}
        <div className="flex justify-end mt-6">
          <motion.button 
            className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-full 
                       transition-colors ${isSelected ? 
                         'bg-primary text-white' : 
                         'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {isSelected ? 'Currently exploring' : 'Explore this territory'}
            <ArrowRight className="ml-2 w-4 h-4" />
          </motion.button>
        </div>
      </div>
      
      {/* Visual decoration element */}
      <div
        className="absolute -bottom-12 -right-12 w-36 h-36 rounded-full opacity-15"
        style={{ 
          background: `radial-gradient(circle, ${colors.accent} 0%, transparent 70%)`
        }}
      />
    </motion.div>
  );
};

export default TerritoryCard;