// src/components/ContextInputs.tsx
import React, { useState } from 'react';
import Button from './Button';
import { UserContext } from '../types';

interface ContextInputsProps {
  onSubmit: (context: UserContext) => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialContext?: UserContext;
}

const ContextInputs: React.FC<ContextInputsProps> = ({ 
  onSubmit, 
  onCancel, 
  isLoading = false,
  initialContext
}) => {
  const [focusArea, setFocusArea] = useState(initialContext?.focusArea || '');
  const [channel, setChannel] = useState(initialContext?.primaryChannel || '');
  const [audience, setAudience] = useState(initialContext?.targetAudience || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      focusArea: focusArea || undefined,
      primaryChannel: channel || undefined,
      targetAudience: audience || undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
      <div className="space-y-4 bg-gray-50 p-4 rounded-md">
        <h3 className="text-lg font-medium">Add Context (Optional)</h3>
        
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Specific Focus Areas
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Any specific aspects to explore?"
            value={focusArea}
            onChange={(e) => setFocusArea(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Primary Channel
          </label>
          <select
            className="w-full p-2 border rounded"
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
          >
            <option value="">Select a channel</option>
            <option value="Social">Social</option>
            <option value="Digital">Digital</option>
            <option value="Experiential">Experiential</option>
            <option value="Integrated">Integrated</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Target Audience Details
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Any specific audience context?"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Deep Dive'}
        </button>
      </div>
    </form>
  );
};

export default ContextInputs;