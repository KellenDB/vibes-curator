// src/app/page.tsx
'use client';

import React, { useState } from "react";
import Input from "../components/Input";
import VibesInput from "../components/VibesInput";
import Button from "../components/Button";
import LoadingSpinner from "../components/LoadingSpinner";
import CreativeResponse from "../components/CreativeResponse";
import TerritoryExpansion from "../components/TerritoryExpansion";

interface Territory {
  territory: string;
  'Mood & Tone': string;
  Unique_Angles: string[];
  Key_Questions: string[];
}

interface TerritoryExpansionResponse {
  expansion: {
    visual_world: {
      aesthetics: string[];
      inspiration: string[];
      signature_elements: string[];
    };
    narrative_angles: {
      key_stories: string[];
      messaging_themes: string[];
      tone_guidance: string;
    };
    activation_opportunities: {
      key_moments: string[];
      platform_ideas: string[];
      engagement_hooks: string[];
    };
    evolution_questions: string[];
  };
}

interface CreativeResponseType {
  Approach: {
    vibes: string[];
    intent: string;
  };
  Brainstorm: {
    workthrough: string;
  };
  Creative_Territories: Territory[];
}

const Page = () => {
  const [product, setProduct] = useState("");
  const [direction, setDirection] = useState("");
  const [vibes, setVibes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandLoading, setExpandLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creativeResponse, setCreativeResponse] = useState<CreativeResponseType | null>(null);
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);
  const [territoryExpansion, setTerritoryExpansion] = useState<TerritoryExpansionResponse | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleTerritorySelect = async (territory: Territory) => {
    setSelectedTerritory(territory);
    setIsModalOpen(true);
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
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to expand territory');
      }

      const data = await response.json();
      if (data.expansion) {
        setTerritoryExpansion(data);
      } else {
        throw new Error('Invalid expansion response format');
      }
    } catch (error) {
      console.error("Error expanding territory:", error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setExpandLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <div className={`w-full max-w-6xl mx-auto px-4 py-8 transition-all duration-500 ${isExpanded ? 'space-y-8' : ''}`}>
        {/* Input Form */}
        <div className={`bg-white rounded-lg shadow-md border border-gray-100 transition-all duration-500 
          ${isExpanded ? 'p-4' : 'p-8'}`}>
          <div className={`transition-all duration-500 ${isExpanded ? 'scale-95 opacity-80' : ''}`}>
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

        {/* Loading States */}
        {loading && <LoadingSpinner />}

        {/* Creative Response */}
        {creativeResponse && !loading && (
          <CreativeResponse 
            response={creativeResponse}
            onTerritorySelect={handleTerritorySelect}
          />
        )}

        {/* Territory Expansion */}
        {selectedTerritory && (
          <>
            {expandLoading && <LoadingSpinner />}
            <TerritoryExpansion 
              territory={selectedTerritory}
              originalContext={{
                product,
                direction,
                vibes,
                approach: creativeResponse?.Approach,
                brainstorm: creativeResponse?.Brainstorm
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Page;