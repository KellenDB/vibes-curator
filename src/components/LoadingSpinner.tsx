// src/components/LoadingSpinner.tsx
import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-[#f8f7f4]/80 backdrop-blur-sm 
                    flex items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative w-16 h-16">
          {/* Outer rotating ring */}
          <div className="w-16 h-16 rounded-full absolute
                        border-4 border-black border-t-transparent
                        animate-spin"></div>
          
          {/* Middle pulsing ring */}
          <div className="w-12 h-12 rounded-full absolute
                        border-4 border-gray-400 border-t-transparent
                        top-2 left-2
                        animate-[spin_1s_linear_infinite_reverse]"></div>
          
          {/* Inner dot that fades in and out */}
          <div className="w-4 h-4 rounded-full absolute
                        bg-black
                        top-6 left-6
                        animate-[ping_1s_ease-in-out_infinite]"></div>
        </div>

        {/* Loading text - now below the spinner */}
        <div className="text-gray-500 font-light text-lg animate-pulse">
          Curating vibes...
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;