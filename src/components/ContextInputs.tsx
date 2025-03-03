// src/components/ContextInputs.tsx
import React, { useState } from 'react';
import Button from './Button';
import { UserContext } from '../types';
import { motion } from 'framer-motion';

interface ContextInputsProps {
  onSubmit: (context: UserContext) => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialContext?: UserContext;
}

const ContextInputs: React.FC<ContextInputsProps> = ({ 
  onSubmit, 
  onCancel, 
  isLoading = false,
  initialContext
}) => {
  const [focusArea, setFocusArea] = useState(initialContext?.focusArea || '');
  const [channel, setChannel] = useState(initialContext?.primaryChannel || '');
  const [audience, setAudience] = useState(initialContext?.targetAudience || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      focusArea: focusArea || undefined,
      primaryChannel: channel || undefined,
      targetAudience: audience || undefined
    });
  };
  
  const handleCancel = () => {
    // Just call the passed-in cancel function without expecting an event
    onCancel();
  };

  // Animation variants
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
    hidden: { opacity: 0, y: 10 },
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
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-6 max-w-lg mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="space-y-6 bg-gray-50/70 p-6 rounded-lg shadow-sm border border-border"
        variants={itemVariants}
      >
        <h3 className="text-lg font-medium text-gray-800">Add Context (Optional)</h3>
        
        <motion.div variants={itemVariants}>
          <label className="block text-sm text-gray-600 font-medium mb-2">
            Specific Focus Areas
          </label>
          <input
            type="text"
            className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
            placeholder="Any specific aspects to explore?"
            value={focusArea}
            onChange={(e) => setFocusArea(e.target.value)}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <label className="block text-sm text-gray-600 font-medium mb-2">
            Target Audience Details
          </label>
          <input
            type="text"
            className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
            placeholder="Any specific audience context?"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <label className="block text-sm text-gray-600 font-medium mb-2">
            Primary Channel
          </label>
          <select
            className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-primary transition-colors bg-white"
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
          >
            <option value="">Select a channel</option>
            <option value="Social">Social</option>
            <option value="Digital">Digital</option>
            <option value="Experiential">Experiential</option>
            <option value="Integrated">Integrated</option>
          </select>
        </motion.div>
      </motion.div>

      <motion.div 
        className="flex justify-end space-x-4 pt-2"
        variants={itemVariants}
      >
        <Button
          variant="outline"
          size="default"
          onClick={handleCancel}
          disabled={isLoading}
          text="Cancel"
          type="button" // Important: not a submit button
        />
        <Button
          variant="gradient"
          size="default"
          type="submit"
          disabled={isLoading}
          text={isLoading ? 'Loading...' : 'Deep Dive'}
        />
      </motion.div>
    </motion.form>
  );
};

export default ContextInputs;