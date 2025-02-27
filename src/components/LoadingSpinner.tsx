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
    <div className="fixed inset-0 bg-background/90 backdrop-blur-sm 
                    flex items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative w-16 h-16">
          {/* Outer gradient ring */}
          <motion.div 
            className="w-16 h-16 rounded-full absolute"
            style={{
              border: "4px solid",
              borderImage: "linear-gradient(135deg, var(--primary), var(--secondary)) 1",
              borderTopColor: "transparent",
            }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.5,
              ease: "linear",
              repeat: Infinity
            }}
          />
          
          {/* Middle ring */}
          <motion.div 
            className="w-12 h-12 rounded-full absolute
                      border-4 border-primary/30 border-t-transparent
                      top-2 left-2"
            animate={{ rotate: -360 }}
            transition={{
              duration: 2,
              ease: "linear",
              repeat: Infinity
            }}
          />
          
          {/* Inner pulsing dot */}
          <motion.div 
            className="w-4 h-4 rounded-full absolute bg-secondary
                      top-6 left-6"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity
            }}
          />
        </div>

        {/* Loading text with gradient animation */}
        <motion.div 
          className="font-medium text-lg text-gray-700"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{
            duration: 2.5,
            ease: "easeInOut",
            repeat: Infinity
          }}
        >
          {text}
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingSpinner;