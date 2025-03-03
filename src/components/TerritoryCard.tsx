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
    // Generate a sophisticated gradient background based on the territory name
    // This creates a unique but consistent gradient for each territory with warm, jewel-tone colors
    const colors = useMemo(() => {
    const getGradient = (str: string) => {
      // Simple hash function to get a number from string
      const hash = str.split('').reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc);
      }, 0);
      
      // Palette inspired by jewel tones, metallics, and warm neutrals that complement the app's red theme
      // All coordinated with the bone/red/white/black primary palette
      const palettes = [
        // Warm reds/burgundies
        { main: 'hsla(352, 70%, 98%, 1)', accent: 'hsla(352, 80%, 40%, 0.75)', highlight: 'hsla(352, 70%, 50%, 0.12)' },
        // Golds
        { main: 'hsla(45, 60%, 98%, 1)', accent: 'hsla(45, 80%, 50%, 0.75)', highlight: 'hsla(45, 70%, 50%, 0.12)' },
        // Copper/bronze
        { main: 'hsla(30, 60%, 98%, 1)', accent: 'hsla(30, 80%, 40%, 0.75)', highlight: 'hsla(30, 70%, 40%, 0.12)' },
        // Deep purple/amethyst (complementary to the red)
        { main: 'hsla(280, 30%, 98%, 1)', accent: 'hsla(280, 50%, 40%, 0.75)', highlight: 'hsla(280, 40%, 40%, 0.12)' },
        // Silver/platinum
        { main: 'hsla(220, 15%, 98%, 1)', accent: 'hsla(220, 30%, 60%, 0.75)', highlight: 'hsla(220, 15%, 50%, 0.12)' },
        // Warm amber
        { main: 'hsla(35, 60%, 98%, 1)', accent: 'hsla(35, 90%, 50%, 0.75)', highlight: 'hsla(35, 80%, 50%, 0.12)' },
        // Deep garnet
        { main: 'hsla(340, 30%, 98%, 1)', accent: 'hsla(340, 70%, 35%, 0.75)', highlight: 'hsla(340, 60%, 40%, 0.12)' },
        // Muted jade (harmonious with reds)
        { main: 'hsla(150, 20%, 98%, 1)', accent: 'hsla(150, 30%, 40%, 0.75)', highlight: 'hsla(150, 25%, 40%, 0.12)' }
      ];
      
      // Select palette based on hash
      const paletteIndex = Math.abs(hash) % palettes.length;
      return palettes[paletteIndex];
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