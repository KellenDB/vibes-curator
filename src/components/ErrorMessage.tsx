// src/components/ErrorMessage.tsx
import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onDismiss }) => {
  return (
    <motion.div 
      className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start shadow-sm"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <div className="flex-shrink-0">
        <AlertCircle className="h-5 w-5 text-red-500" />
      </div>
      <div className="ml-3 flex-1">
        <p className="text-sm text-red-700 font-medium">{message}</p>
      </div>
      {onDismiss && (
        <button 
          onClick={onDismiss}
          className="ml-auto text-red-500 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 rounded-full"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </motion.div>
  );
};

export default ErrorMessage;