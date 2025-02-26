// src/components/ErrorMessage.tsx
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onDismiss }) => {
  return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md flex items-start">
      <div className="flex-shrink-0">
        <AlertCircle className="h-5 w-5 text-red-400" />
      </div>
      <div className="ml-3 flex-1">
        <p className="text-sm text-red-700">{message}</p>
      </div>
      {onDismiss && (
        <button 
          onClick={onDismiss}
          className="ml-auto text-red-400 hover:text-red-500"
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;