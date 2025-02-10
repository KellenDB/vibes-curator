// src/components/Input.tsx
import React from "react";

interface InputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

const Input: React.FC<InputProps> = ({ label, value, onChange, placeholder }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm uppercase tracking-wider text-gray-500">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-md border border-gray-200 
                 focus:outline-none focus:ring-2 focus:ring-gray-200 
                 placeholder-gray-400 text-gray-700"
      />
    </div>
  );
};

export default Input;