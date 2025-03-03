// src/components/LoadingSpinner.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Brain, Palette, Lightbulb } from "lucide-react";

interface LoadingSpinnerProps {
  text?: string;
  duration?: number; // Duration in milliseconds
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  text = "Curating vibes...", 
  duration = 6000 // Default to 6 seconds
}) => {
  const [progress, setProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  
  // Define the loading stages
  const stages = [
    { icon: Brain, text: "Gathering inspiration..." },
    { icon: Palette, text: "Assembling color palettes..." },
    { icon: Lightbulb, text: "Exploring creative territories..." },
    { icon: Sparkles, text: "Finalizing the vibes..." }
  ];
  
  // Use an effect to animate progress
  useEffect(() => {
    const startTime = Date.now();
    const interval = 60; // Update every 60ms for smooth animation
    
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(elapsed / duration, 1);
      setProgress(newProgress);
      
      // Update stage based on progress
      const newStageIndex = Math.min(
        Math.floor(newProgress * stages.length),
        stages.length - 1
      );
      setStageIndex(newStageIndex);
      
      if (newProgress >= 1) {
        clearInterval(timer);
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, [duration]);
  
  // Current stage
  const CurrentIcon = stages[stageIndex].icon;
  const currentText = stages[stageIndex].text;
  
  // Circular progress value (0 to 100)
  const circumference = 2 * Math.PI * 45; // 45 is radius of circle
  const strokeDashoffset = circumference * (1 - progress);
  
  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-md 
                    flex items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-6 max-w-xs text-center">
        {/* SVG circle progress */}
        <div className="relative w-40 h-40">
          {/* Background circle */}
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="none" 
              stroke="rgba(0,0,0,0.1)" 
              strokeWidth="4"
            />
            {/* Progress circle */}
            <motion.circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="none" 
              stroke="url(#gradient)" 
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 50 50)"
            />
            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--primary)" />
                <stop offset="100%" stopColor="var(--secondary)" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Percentage in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary">
              {Math.round(progress * 100)}%
            </span>
          </div>
          
          {/* Animated icon */}
          <motion.div 
            className="absolute top-0 right-0 bg-white p-2 rounded-full shadow-md border border-border"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            key={stageIndex} // Forces re-animation when icon changes
          >
            <CurrentIcon className="w-6 h-6 text-secondary" />
          </motion.div>
        </div>

        {/* Animated stage text */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={stageIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="h-8" // Fixed height to prevent layout shift
          >
            <p className="font-medium text-lg text-gray-800">{currentText}</p>
          </motion.div>
        </AnimatePresence>
        
        {/* Hint text */}
        <motion.p 
          className="text-sm text-gray-500 italic"
          animate={{ 
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          Great ideas take a moment...
        </motion.p>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-primary to-secondary"
            style={{ width: `${progress * 100}%` }}
            initial={{ width: "0%" }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;