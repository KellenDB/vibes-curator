// src/components/DownloadButton.tsx
import React from 'react';
import { Download } from 'lucide-react';

interface DownloadButtonProps {
  content: string;
  filename: string;
  label?: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ 
  content, 
  filename, 
  label = "Download" 
}) => {
  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleDownload}
      className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md 
                bg-gray-800 text-white hover:bg-gray-700 transition-colors"
    >
      <Download className="w-4 h-4 mr-1.5" />
      {label}
    </button>
  );
};

export default DownloadButton;