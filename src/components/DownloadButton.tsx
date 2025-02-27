// src/components/DownloadButton.tsx
import React from 'react';
import { Download } from 'lucide-react';
import { motion } from 'framer-motion';

interface DownloadButtonProps {
  content: string;
  filename: string;
  label?: string;
  className?: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ 
  content, 
  filename, 
  label = "Download",
  className = ""
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
    <motion.button
      onClick={handleDownload}
      className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md
                 bg-primary text-white hover:bg-primary/90
                 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                 ${className}`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <Download className="w-4 h-4 mr-1.5" />
      {label}
    </motion.button>
  );
};

export default DownloadButton;