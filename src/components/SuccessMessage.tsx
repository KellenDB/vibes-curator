// src/components/SuccessMessage.tsx
import React from 'react';
import { CheckCircle } from 'lucide-react';

interface SuccessMessageProps {
  message: string;
  onDismiss?: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ message, onDismiss }) => {
  return (
    <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-md flex items-start">
      <div className="flex-shrink-0">
        <CheckCircle className="h-5 w-5 text-green-400" />
      </div>
      <div className="ml-3 flex-1">
        <p className="text-sm text-green-700">{message}</p>
      </div>
      {onDismiss && (
        <button 
          onClick={onDismiss}
          className="ml-auto text-green-400 hover:text-green-500"
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default SuccessMessage;