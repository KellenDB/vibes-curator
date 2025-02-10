// src/components/VibesCard.tsx
import React from "react";

interface VibesCardProps {
  title: string;
  description: string;
}

const VibesCard: React.FC<VibesCardProps> = ({ title, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <p className="text-gray-700">{description}</p>
    </div>
  );
};

export default VibesCard;
