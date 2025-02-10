// src/components/Button.tsx
import React from "react";

interface ButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, disabled = false }) => {
  return (
    <div className="flex justify-center">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`
          gleam
          px-8 py-3 rounded-md text-sm font-medium
          shadow-lg
          transition-transform duration-300
          ${disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02]"}
        `}
      >
        <span className="relative z-10 text-white">{text}</span>
      </button>
    </div>
  );
};

export default Button;