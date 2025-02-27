// src/app/page.tsx
'use client';

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Input from "../components/Input";
import VibesInput from "../components/VibesInput";
import Button from "../components/Button";
import LoadingSpinner from "../components/LoadingSpinner";
import CreativeResponse from "../components/CreativeResponse";
import TerritoryDetails from "../components/TerritoryDetails";
import ContextInputs from "../components/ContextInputs";
import ErrorMessage from "../components/ErrorMessage";
import { 
  Territory, 
  TerritoryExpansionResponse, 
  CreativeResponseType,
  UserContext
} from "../types";
import { ChevronLeft, X, Sparkles } from "lucide-react";

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
    
    // Save scroll position
    preserveScrollPosition();
    
    // Check if we already have this territory expansion in cache
    const territoryKey = territory.territory;
    const existingExpansion = expansionCache[territoryKey];
    
    // Set the selected territory
    setSelectedTerritory(territory);
    
    if (existingExpansion) {
      // If we already have an expansion, show it directly
      setTerritoryExpansion(existingExpansion);
      setShowSplitView(true);
      // Don't show modal since we already have data
      setIsModalOpen(false);
    } else {
      // If no existing expansion, show the context gathering modal
      setIsModalOpen(true);
      setTerritoryExpansion(null);
      setShowSplitView(false);
    }
  };
  
  const handleExpandTerritory = async (territory: Territory, userContext: UserContext) => {
    // Close the modal
    setIsModalOpen(false);
    
    // Show split view and set loading state
    setShowSplitView(true);
    setExpandLoading(true);
    
    try {
      // If we somehow lost our territory reference, use the one from the parameters
      if (!selectedTerritory) {
        setSelectedTerritory(territory);
      }
      
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
        
      // On error, close the split view if we don't have a valid expansion
      if (!territoryExpansion) {
        setShowSplitView(false);
      }
    } finally {
      setExpandLoading(false);
    }
  };

  // Function to update an existing territory expansion with new context
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
    // Close the modal
    setIsModalOpen(false);
    
    // Clear selected territory since we're not proceeding with expansion
    setSelectedTerritory(null);
    
    // Ensure we're not showing split view
    setShowSplitView(false);
    
    // Clear any territory expansion
    setTerritoryExpansion(null);
  };

  const handleCloseSplitView = () => {
    // Close split view
    setShowSplitView(false);
    
    // Clear selected territory
    setSelectedTerritory(null);
    
    // Clear territory expansion
    setTerritoryExpansion(null);
    
    // Make sure modal is also closed
    setIsModalOpen(false);
    
    // Restore scroll position
    restoreScrollPosition();
  };

  // Only show territories content if we have creative response
  const showTerritories = creativeResponse && creativeResponse.Creative_Territories;

  // Function to preserve scroll position
  const preserveScrollPosition = () => {
    const mainContent = document.getElementById('main-content-container');
    if (mainContent) {
      // Save current scroll position in session storage when navigating to detail
      sessionStorage.setItem('scrollPosition', mainContent.scrollTop.toString());
    }
  };

  // Function to restore scroll position
  const restoreScrollPosition = () => {
    const mainContent = document.getElementById('main-content-container');
    if (mainContent) {
      const savedPosition = sessionStorage.getItem('scrollPosition');
      if (savedPosition) {
        setTimeout(() => {
          mainContent.scrollTop = parseInt(savedPosition);
        }, 100);
      }
    }
  };

  // Preserve scroll on split view open
  useEffect(() => {
    if (showSplitView) {
      preserveScrollPosition();
    } else {
      restoreScrollPosition();
    }
  }, [showSplitView]);

  // Page transition variants
  const pageVariants = {
    initial: {
      opacity: 0,
    },
    enter: {
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3, ease: "easeIn" }
    }
  };

  // Form input transition variants
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] }
    }
  };

  // Header variants
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] }
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-texture flex"
      initial="initial"
      animate="enter"
      exit="exit"
      variants={pageVariants}
    >
      {/* Main content (shrinks when split view is active) */}
      <div 
        className={`transition-all duration-500 overflow-y-auto ${showSplitView ? 'w-5/12 border-r border-border' : 'w-full'}`}
        style={{height: '100vh'}}
        id="main-content-container"
      >
        <div className={`w-full max-w-3xl mx-auto px-6 py-12 transition-all duration-500 ${isExpanded ? 'space-y-8' : ''}`}>
          {/* Input Form */}
          <motion.div 
            className={`card transition-all duration-500 
              ${isExpanded ? 'p-6' : 'p-8'} ${showSplitView ? 'max-w-full' : ''}`}
            variants={formVariants}
            initial="hidden"
            animate="visible"
            layoutId="input-form"
          >
            <motion.div 
              className={`transition-all duration-500 ${isExpanded ? 'opacity-90' : ''}`}
            >
              <motion.div 
                className="flex items-center mb-8 space-x-2"
                variants={headerVariants}
                initial="hidden"
                animate="visible"
              >
                <Sparkles className="w-6 h-6 text-secondary" />
                <h1 className="text-3xl font-medium tracking-tight text-gray-900">
                  TARS: Your partner in vibes
                </h1>
              </motion.div>
              
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
                <div className="pt-4">
                  <Button 
                    text="Curate the vibes"
                    onClick={handleGenerateVibes} 
                    disabled={loading}
                    variant="gradient"
                    size="lg"
                    className="w-full justify-center"
                  />
                </div>
                {error && (
                  <ErrorMessage message={error} onDismiss={() => setError(null)} />
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Creative Response */}
          <AnimatePresence mode="wait">
            {creativeResponse && !loading && (
              <motion.div
                key="creative-response"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{ opacity: 1 }} /* Force opacity */
              >
                <CreativeResponse 
                  response={creativeResponse}
                  onTerritorySelect={handleTerritorySelect}
                  compactMode={showSplitView}
                />
                {/* Debug info - only in development and hidden in production */}
                {false && process.env.NODE_ENV === 'development' && (
                  <pre className="mt-4 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-40">
                    {JSON.stringify(creativeResponse, null, 2)}
                  </pre>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Territory Detail Split View */}
      <AnimatePresence mode="wait">
        {showSplitView && selectedTerritory && (
          <motion.div 
            key="split-view"
            className="fixed top-0 right-0 bottom-0 w-7/12 bg-card overflow-hidden shadow-lg flex flex-col"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 50, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{ opacity: 1 }} /* Force opacity */
          >
            <div className="sticky top-0 z-10 bg-card border-b border-border p-4 flex justify-between items-center">
              <button 
                onClick={handleCloseSplitView}
                className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Back to Territories
              </button>
              <div className="text-lg font-medium text-center flex-1">
                {selectedTerritory.territory}
              </div>
              <button 
                onClick={handleCloseSplitView}
                className="text-gray-500 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full"
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal for initial context gathering */}
      <AnimatePresence mode="wait">
        {isModalOpen && selectedTerritory && (
          <motion.div 
            key="context-modal"
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ opacity: 1 }} /* Force opacity */
          >
            <motion.div 
              className="bg-card rounded-lg p-6 max-w-lg w-full shadow-xl"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 400 }}
            >
              <h2 className="text-xl font-semibold mb-2">Exploring: {selectedTerritory.territory}</h2>
              <p className="text-gray-600 mb-6">{selectedTerritory['Mood & Tone']}</p>
              
              <ContextInputs 
                onSubmit={(context) => handleExpandTerritory(selectedTerritory, context)}
                onCancel={handleCloseModal}
                isLoading={expandLoading}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global loading state */}
      <AnimatePresence>
        {loading && <LoadingSpinner />}
      </AnimatePresence>
    </motion.div>
  );
};

export default Page;