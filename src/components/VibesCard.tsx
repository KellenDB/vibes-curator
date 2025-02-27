// src/components/VibesCard.tsx
import React from "react";
import { motion } from "framer-motion";

interface VibesCardProps {
  title: string;
  description: string;
  className?: string;
}

const VibesCard: React.FC<VibesCardProps> = ({ 
  title, 
  description,
  className 
}) => {
  return (
    <motion.div 
      className={`card bg-card p-6 mb-6 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)" }}
    >
      <h2 className="text-2xl font-semibold mb-4 text-card-foreground">{title}</h2>
      <p className="text-gray-700">{description}</p>
    </motion.div>
  );
};

export default VibesCard;