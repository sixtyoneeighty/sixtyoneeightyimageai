"use client";

import React, { useState } from 'react';
import Image from 'next/image'; // Import Image component for optimized image handling

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enhancedPrompt, setEnhancedPrompt] = useState<string | null>(null);
  const [skipEnhancement, setSkipEnhancement] = useState(false); // Toggle for skipping enhancement
  const [dropdownOpen, setDropdownOpen] = useState(false); // Toggle for dropdown

  const generateImage = async () => {
    setLoading(true);
    setError(null);
    setImage(null);
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, skipEnhancement }),
      });

      const data = await response.json();
      console.log('Image generation response:', data); // Debugging log

      if (response.ok && data.imageUrl) {
        setImage(data.imageUrl);  // Handle the image URL correctly
        setEnhancedPrompt(data.enhancedPrompt); // Save enhanced prompt for display
      } else {
        setError(data.error || 'Failed to generate image');
      }
    } catch (err) {
      setError('Failed to generate image');
    } finally {
      setLoading(false);
    }
  };

  const clearPrompt = () => {
    setPrompt('');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Replace title with logo image */}
      <Image
        src="/images/logo.png"
        alt="Logo"
        width={400}
        height={200}
        className="mb-8"
      />
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <label className="block mb-2 text-gray-700 font-semibold">Prompt:</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your idea here. Our AI enhances, optimizes, and generates your image. It will then appear below"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 text-white h-28"
        />
        <div className="mt-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={skipEnhancement}
              onChange={(e) => setSkipEnhancement(e.target.checked)}
              className="form-checkbox"
            />
            <span className="ml-2 text-gray-700">Skip Prompt Enhancement</span>
          </label>
        </div>
        <button
          onClick={generateImage}
          disabled={loading}
          className={`mt-4 w-full py-2 px-4 rounded-md text-white font-semibold ${
            loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {loading ? 'Generating...' : 'Generate Image'}
        </button>
        <button
          onClick={clearPrompt}
          className="mt-2 w-full py-2 px-4 rounded-md text-white font-semibold bg-gray-700 hover:bg-gray-800"
        >
          Clear
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {image && (
          <div className="mt-8">
            <img
              src={image}
              alt="Generated"
              className="w-full max-w-lg rounded-lg shadow-lg"
              onError={() => setError('Failed to load image')}
            />
          </div>
        )}
        {enhancedPrompt && (
          <div className="mt-4">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full py-2 px-4 rounded-md text-white font-semibold bg-indigo-600 hover:bg-indigo-700"
            >
              {dropdownOpen ? 'Hide Enhanced Prompt' : 'Click to see your enhanced prompt'}
            </button>
            {dropdownOpen && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <p className="text-indigo-700">
                  <strong>Enhanced Prompt:</strong> {enhancedPrompt}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGenerator;
