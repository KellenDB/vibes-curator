// src/components/Input.tsx
import React from "react";

interface InputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  className?: string;
}

const Input: React.FC<InputProps> = ({ 
  label, 
  value, 
  onChange, 
  placeholder,
  className 
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm uppercase tracking-wider text-gray-500 font-medium">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-md border border-border bg-white
                 focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary
                 placeholder-gray-400 text-gray-700 transition-colors duration-200
                 shadow-sm"
      />
    </div>
  );
};

export default Input;