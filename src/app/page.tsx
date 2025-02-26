// src/app/page.tsx
'use client';

import React, { useState } from "react";
import Input from "../components/Input";
import VibesInput from "../components/VibesInput";
import Button from "../components/Button";
import LoadingSpinner from "../components/LoadingSpinner";
import CreativeResponse from "../components/CreativeResponse";
import TerritoryDetails from "../components/TerritoryDetails";
import ContextInputs from "../components/ContextInputs";
import { 
  Territory, 
  TerritoryExpansionResponse, 
  CreativeResponseType,
  UserContext
} from "../types";
import { ChevronLeft, X } from "lucide-react";

const Page = () => {
  const [product, setProduct] = useState("");
  const [direction, setDirection] = useState("");
  const [vibes, setVibes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandLoading, setExpandLoading] = useState(false);
  const [updatingExpansion, setUpdatingExpansion] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creativeResponse, setCreativeResponse] = useState<CreativeResponseType | null>(null);
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);
  const [territoryExpansion, setTerritoryExpansion] = useState<TerritoryExpansionResponse | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSplitView, setShowSplitView] = useState(false);
  // Add a cache to store territory expansions
  const [expansionCache, setExpansionCache] = useState<{[key: string]: TerritoryExpansionResponse}>({});

  const handleGenerateVibes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/generate-vibes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product,
          direction,
          vibes: vibes.join(', '),
          aiProvider: "claude",
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate creative response');
      }

      const data = await response.json();
      if (data.generatedVibes) {
        setCreativeResponse(data.generatedVibes);
        setIsExpanded(true);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleTerritorySelect = (territory: Territory) => {
    // Clear previous errors
    setError(null);
    
    // Set the selected territory
    setSelectedTerritory(territory);
    
    // Check if we already have this territory expansion in cache
    const territoryKey = territory.territory;
    if (expansionCache[territoryKey]) {
      setTerritoryExpansion(expansionCache[territoryKey]);
      // Directly show split view if we already have the expansion
      setShowSplitView(true);
    } else {
      // If not in cache, show modal to gather context
      setIsModalOpen(true);
      setTerritoryExpansion(null);
    }
  };
  
  const handleExpandTerritory = async (territory: Territory, userContext: UserContext) => {
    // Close the modal if it's open
    setIsModalOpen(false);
    
    // Start showing split view
    setShowSplitView(true);
    
    // Set loading state
    setExpandLoading(true);
    
    try {
      const response = await fetch("/api/expand-territory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          territory,
          originalContext: {
            product,
            direction,
            vibes,
            approach: creativeResponse?.Approach,
            brainstorm: creativeResponse?.Brainstorm
          },
          userContext
        }),
      });

      // Handle HTTP errors
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || 'Failed to expand territory';
        throw new Error(errorMessage);
      }

      const data = await response.json();
      if (data.expansion) {
        // Create the expected structure with user context
        const expansionWithContext: TerritoryExpansionResponse = {
          expansion: data.expansion,
          userContext: userContext
        };
        
        // Store in cache with the user context
        setExpansionCache(prev => ({
          ...prev,
          [territory.territory]: expansionWithContext
        }));
        
        // Update current state with user context
        setTerritoryExpansion(expansionWithContext);
      } else {
        throw new Error('The AI provided an invalid response format. Please try again.');
      }
    } catch (error) {
      console.error("Error expanding territory:", error);
      setError(error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred. Please try again or contact support.');
    } finally {
      setExpandLoading(false);
    }
  };

  // New function to update an existing territory expansion with new context
  const handleUpdateExpansion = async (territory: Territory, userContext: UserContext) => {
    if (!territory) return;
    
    setUpdatingExpansion(true);
    setError(null);
    
    try {
      const response = await fetch("/api/expand-territory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          territory,
          originalContext: {
            product,
            direction,
            vibes,
            approach: creativeResponse?.Approach,
            brainstorm: creativeResponse?.Brainstorm
          },
          userContext,
          isUpdate: true // Signal this is an update to existing expansion
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || 'Failed to update territory expansion';
        throw new Error(errorMessage);
      }

      const data = await response.json();
      if (data.expansion) {
        // Create the expected structure with user context
        const expansionWithContext: TerritoryExpansionResponse = {
          expansion: data.expansion,
          userContext: userContext
        };
        
        // Update in cache
        setExpansionCache(prev => ({
          ...prev,
          [territory.territory]: expansionWithContext
        }));
        
        // Update current state
        setTerritoryExpansion(expansionWithContext);
      } else {
        throw new Error('The AI provided an invalid response format. Please try again.');
      }
    } catch (error) {
      console.error("Error updating territory expansion:", error);
      setError(error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred during update. Please try again.');
    } finally {
      setUpdatingExpansion(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCloseSplitView = () => {
    setShowSplitView(false);
    setSelectedTerritory(null);
    setTerritoryExpansion(null);
  };

  // Only show territories content if we have creative response
  const showTerritories = creativeResponse && creativeResponse.Creative_Territories;

  return (
    <div className="min-h-screen bg-[#f8f7f4] flex">
      {/* Main content (shrinks when split view is active) */}
      <div 
        className={`transition-all duration-500 overflow-y-auto ${showSplitView ? 'w-5/12 border-r border-gray-200' : 'w-full'}`}
        style={{height: '100vh'}}
      >
        <div className={`w-full max-w-3xl mx-auto px-4 py-8 transition-all duration-500 ${isExpanded ? 'space-y-8' : ''}`}>
          {/* Input Form */}
          <div className={`bg-white rounded-lg shadow-md border border-gray-100 transition-all duration-500 
            ${isExpanded ? 'p-4' : 'p-8'} ${showSplitView ? 'max-w-full' : ''}`}>
            <div className={`transition-all duration-500 ${isExpanded ? 'opacity-90' : ''}`}>
              <h1 className="text-3xl font-light tracking-tight text-gray-900 mb-6">
                TARS: Your partner in vibes
              </h1>
              <div className="space-y-6">
                <Input
                  label="Product"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  placeholder="What's the product?"
                />
                <Input
                  label="Direction"
                  value={direction}
                  onChange={(e) => setDirection(e.target.value)}
                  placeholder="Digital campaign, re-brand, etc."
                />
                <VibesInput
                  value={vibes}
                  onChange={setVibes}
                />
                <Button 
                  text="Curate the vibes" 
                  onClick={handleGenerateVibes} 
                  disabled={loading} 
                />
                {error && (
                  <p className="text-red-500 text-sm mt-2">{error}</p>
                )}
              </div>
            </div>
          </div>

          {/* Creative Response */}
          {showTerritories && !loading && (
            <CreativeResponse 
              response={creativeResponse}
              onTerritorySelect={handleTerritorySelect}
              compactMode={showSplitView}
            />
          )}
        </div>
      </div>

      {/* Territory Detail Split View */}
      {showSplitView && selectedTerritory && (
        <div className="fixed top-0 right-0 bottom-0 w-7/12 bg-white overflow-hidden shadow-lg flex flex-col">
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
            <button 
              onClick={handleCloseSplitView}
              className="inline-flex items-center text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Back to Territories
            </button>
            <div className="text-lg font-medium text-center flex-1">
              {selectedTerritory.territory}
            </div>
            <button 
              onClick={handleCloseSplitView}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Territory Details - scrollable container */}
          <div className="p-6 overflow-y-auto flex-1">
            <TerritoryDetails
              territory={selectedTerritory}
              expansionData={territoryExpansion}
              isLoading={expandLoading || updatingExpansion}
              error={error}
              onUpdateContext={handleUpdateExpansion}
              originalContext={{
                product,
                direction,
                vibes,
                approach: creativeResponse?.Approach,
                brainstorm: creativeResponse?.Brainstorm
              }}
            />
          </div>
        </div>
      )}

      {/* Modal for initial context gathering */}
      {isModalOpen && selectedTerritory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h2 className="text-xl font-semibold mb-4">Exploring: {selectedTerritory.territory}</h2>
            <p className="text-gray-600 mb-6">{selectedTerritory['Mood & Tone']}</p>
            
            <ContextInputs 
              onSubmit={(context) => handleExpandTerritory(selectedTerritory, context)}
              onCancel={handleCloseModal}
              isLoading={expandLoading}
            />
          </div>
        </div>
      )}

      {/* Global loading state */}
      {loading && <LoadingSpinner />}
    </div>
  );
};

export default Page;