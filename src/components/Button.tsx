// src/components/Button.tsx
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "secondary" | "gradient" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  className = "",
  variant = "default",
  size = "default",
  text,
  children,
  onClick,
  disabled = false,
  ...props
}) => {
  // Base button styles
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  // Variant styles
  const variantStyles = {
    default: "bg-primary text-white hover:shadow-md",
    secondary: "bg-secondary text-white hover:shadow-md",
    gradient: "bg-gradient-to-br from-primary to-secondary text-white hover:shadow-md",
    outline: "border border-primary text-primary hover:bg-primary/5",
    ghost: "text-primary hover:bg-primary/5",
  };
  
  // Size styles
  const sizeStyles = {
    default: "h-10 py-2 px-6",
    sm: "h-9 px-4",
    lg: "h-12 px-8 text-base",
  };
  
  // Combine all styles
  const buttonClasses = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {text || children}
    </button>
  );
};

export default Button;