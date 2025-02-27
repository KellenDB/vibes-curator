// src/components/LoadingSpinner.tsx
import React from "react";
import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  text = "Curating vibes..."
}) => {
  return (
    <motion.div 
      className="fixed inset-0 bg-bone-100/90 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="flex flex-col items-center space-y-8"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className="relative">
          {/* Main spinning circle */}
          <div className="relative">
            <motion.div 
              className="w-24 h-24 rounded-full border-4 border-charcoal-400 border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Inner blinking dots representing vibes */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-14 h-14">
                {[0, 1, 2, 3, 4].map((index) => (
                  <motion.div
                    key={index}
                    className="absolute w-3 h-3 rounded-full bg-territory-one"
                    initial={{ scale: 0 }}
                    animate={{ 
                      scale: [0, 1, 0],
                      x: Math.cos(index * (Math.PI * 2 / 5)) * 7,
                      y: Math.sin(index * (Math.PI * 2 / 5)) * 7,
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      delay: index * 0.3,
                      ease: "easeInOut"
                    }}
                    style={{
                      left: '50%',
                      top: '50%',
                      x: '-50%',
                      y: '-50%'
                    }}
                  />
                ))}
              </div>
            </div>
            
            {/* Center dot */}
            <motion.div 
              className="absolute top-1/2 left-1/2 w-4 h-4 -ml-2 -mt-2 bg-charcoal-400 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Loading text with animated ellipsis */}
        <div className="text-center">
          <div className="text-charcoal-400 font-medium text-lg">{text}</div>
          <div className="flex justify-center space-x-1 mt-1">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="w-2 h-2 rounded-full bg-charcoal-300"
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  delay: index * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
          <motion.div
            className="text-charcoal-300 text-sm mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.8 }}
          >
            Gathering creative inspiration...
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoadingSpinner;