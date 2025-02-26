// src/components/CopyButton.tsx
import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  label?: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ text, label = "Copy" }) => {
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
    <button
      onClick={handleCopy}
      className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md 
                bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 mr-1.5" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="w-4 h-4 mr-1.5" />
          {label}
        </>
      )}
    </button>
  );
};

export default CopyButton;