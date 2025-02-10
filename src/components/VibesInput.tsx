// src/components/VibesInput.tsx
import React, { useState, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VibesInputProps {
  value: string[];
  onChange: (vibes: string[]) => void;
}

const VibesInput: React.FC<VibesInputProps> = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && inputValue.trim()) {
      e.preventDefault();
      addVibe();
    } else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      e.preventDefault();
      removeVibe(value.length - 1);
    }
  };

  const addVibe = () => {
    const vibe = inputValue.trim().toLowerCase();
    if (vibe && !value.includes(vibe)) {
      onChange([...value, vibe]);
      setInputValue("");
    }
  };

  const removeVibe = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm uppercase tracking-wider text-gray-500">
        Vibes
      </label>
      <div className="relative">
        <div 
          className="min-h-[100px] p-4 rounded-md border border-gray-200 
                   focus-within:ring-2 focus-within:ring-gray-200 
                   bg-white transition-all duration-200"
        >
          <div className="flex flex-wrap gap-2 mb-2">
            <AnimatePresence>
              {value.map((vibe, index) => (
                <motion.span
                  key={vibe}
                  initial={{ scale: 0, opacity: 0, y: 20 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1, 
                    y: 0,
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 20
                    }
                  }}
                  exit={{ 
                    scale: 0, 
                    opacity: 0,
                    transition: {
                      duration: 0.2,
                      ease: "easeOut"
                    }
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  layout
                >
                   <div className="gleam inline-flex items-center px-4 py-1.5 rounded-full shadow-lg">
                        <span className="relative z-10 text-white">{vibe}</span>
                        <motion.button
                        onClick={() => removeVibe(index)}
                        className="relative z-10 ml-2 text-white hover:text-white/80"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 25
                        }}
                        >
                        ×
                        </motion.button>
                    </div>
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => inputValue.trim() && addVibe()}
            placeholder="Type a vibe and press Enter (timeless, swaggy, etc.)"
            className="w-full outline-none placeholder-gray-400 text-gray-700"
          />
        </div>
      </div>
      <p className="text-xs text-gray-500 italic mt-2">
        Press Enter or comma to add a vibe
      </p>
    </div>
  );
};

export default VibesInput;