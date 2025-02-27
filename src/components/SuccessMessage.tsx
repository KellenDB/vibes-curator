// src/components/SuccessMessage.tsx
import React from 'react';
import { CheckCircle, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface SuccessMessageProps {
  message: string;
  onDismiss?: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ message, onDismiss }) => {
  return (
    <motion.div 
      className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md flex items-start shadow-sm"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <div className="flex-shrink-0">
        <CheckCircle className="h-5 w-5 text-green-500" />
      </div>
      <div className="ml-3 flex-1">
        <p className="text-sm text-green-700 font-medium">{message}</p>
      </div>
      {onDismiss && (
        <button 
          onClick={onDismiss}
          className="ml-auto text-green-500 hover:text-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 rounded-full"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </motion.div>
  );
};

export default SuccessMessage;