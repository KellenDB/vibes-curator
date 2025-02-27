// src/components/CopyButton.tsx
import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ 
  text, 
  label = "Copy", 
  className = ""
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <motion.button
      onClick={handleCopy}
      className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md
                 bg-gray-100 text-gray-800 hover:bg-gray-200 
                 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
                 ${className}`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      {copied ? (
        <motion.div 
          className="flex items-center"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
        >
          <Check className="w-4 h-4 mr-1.5 text-green-500" />
          <span className="text-green-600">Copied!</span>
        </motion.div>
      ) : (
        <>
          <Copy className="w-4 h-4 mr-1.5" />
          {label}
        </>
      )}
    </motion.button>
  );
};

export default CopyButton;