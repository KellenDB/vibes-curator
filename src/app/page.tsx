'use client';

import React, { useState } from "react";
import Input from "../components/Input";
import VibesInput from "../components/VibesInput";
import Button from "../components/Button";
import LoadingSpinner from "../components/LoadingSpinner";
import CreativeResponse from "../components/CreativeResponse";

const Page = () => {
  const [product, setProduct] = useState("");
  const [direction, setDirection] = useState("");
  const [vibes, setVibes] = useState<string[]>([]);
  const [targetAudience, setTargetAudience] = useState("");
  const [loading, setLoading] = useState(false);
  const [creativeResponse, setCreativeResponse] = useState<null | any>(null);

  const handleGenerateVibes = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/generate-vibes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product,
          direction,
          vibes: vibes.join(', '), // Convert array to comma-separated string for API
          targetAudience,
          aiProvider: "claude",
        }),
      });

      const data = await response.json();
      
      if (data.generatedVibes) {
        setCreativeResponse(data.generatedVibes);
      } else {
        setCreativeResponse({
          title: "Error",
          description: "Something went wrong, please try again.",
        });
      }
    } catch (error) {
      console.error("Error generating vibes:", error);
      setCreativeResponse({
        title: "Error",
        description: "Failed to generate vibes. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <div className="w-full max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md border border-gray-100 mb-8">
          <div className="border-b border-gray-100 px-8 py-6">
            <h1 className="text-3xl font-light tracking-tight text-gray-900">TARS: Your partner in vibes</h1>
          </div>
          <div className="px-8 py-6 space-y-6">
            <Input
              label="Product | Brands"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="What's the product or brand"
            />
            <Input
              label="Direction"
              value={direction}
              onChange={(e) => setDirection(e.target.value)}
              placeholder="What's the general direction (target audience, campaign type, etc.)"
            />
            <VibesInput
              value={vibes}
              onChange={(newVibes) => {
                console.log("New vibes:", newVibes); // Debug log
                setVibes(newVibes);
              }}
            />
            <Button 
              text="Curate the vibes" 
              onClick={handleGenerateVibes} 
              disabled={loading} 
            />
          </div>
        </div>

        {loading && <LoadingSpinner />}
        {creativeResponse && !loading && (
          <CreativeResponse response={creativeResponse} />
        )}
      </div>
    </div>
  );
};

export default Page;