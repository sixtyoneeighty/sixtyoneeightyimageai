"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enhancedPrompt, setEnhancedPrompt] = useState<string | null>(null);
  const [skipEnhancement, setSkipEnhancement] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);

  const generateImage = async () => {
    setLoading(true);
    setError(null);
    setImage(null);
    try {
      console.log('Sending request with prompt:', prompt); // Debug log
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, skipEnhancement }),
      });

      const data = await response.json();
      console.log('Response from server:', data); // Debug log

      if (response.ok && data.imageUrl) {
        setImage(data.imageUrl);
        setEnhancedPrompt(data.enhancedPrompt);
      } else {
        console.error('Error response:', data); // Debug log
        setError(data.error || 'Failed to generate image');
      }
    } catch (err) {
      console.error('Fetch error:', err); // Debug log
      setError('Failed to generate image');
    } finally {
      setLoading(false);
    }
  };

  const clearPrompt = () => {
    setPrompt('');
  };

  const saveImage = () => {
    if (image) {
      const link = document.createElement('a');
      link.href = image;
      link.download = 'generated-image.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const toggleOverlay = () => {
    setOverlayVisible(!overlayVisible);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-gradient-to-br from-background via-background/95 to-background/90">
      {/* Sidebar */}
      <div className="w-full md:w-[350px] md:min-w-[350px] h-auto md:h-screen bg-black/20 backdrop-blur-xl p-4 md:p-8 md:pt-24 overflow-y-auto shadow-2xl relative z-10">
        <div className="space-y-8 md:space-y-16">
          <div className="flex justify-center transition-transform hover:scale-105 duration-300">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={200}
              height={100}
              className="w-[140px] md:w-[180px] h-auto drop-shadow-2xl hover:drop-shadow-[0_20px_20px_rgba(255,255,255,0.1)] transition-all duration-300"
              priority
            />
          </div>

          <div className="space-y-6 md:space-y-8">
            <div className="space-y-2">
              <Label htmlFor="prompt" className="text-base md:text-lg font-medium tracking-wide">Your Vision</Label>
              <Textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Share your vision here. Our AI will refine and enhance your idea to create a stunning image."
                className="min-h-[100px] md:min-h-[120px] resize-none bg-white/5 backdrop-blur-sm border-2 border-white/10 focus:border-white/20 focus:ring-4 focus:ring-white/10 transition-all duration-300 rounded-xl shadow-xl hover:shadow-2xl text-sm md:text-base"
              />
            </div>

            <div className="flex items-center space-x-2 bg-white/5 p-3 md:p-4 rounded-xl backdrop-blur-sm border border-white/10 transition-all duration-300 hover:bg-white/10">
              <Checkbox
                id="skip-enhancement"
                checked={skipEnhancement}
                onCheckedChange={(checked) => setSkipEnhancement(checked as boolean)}
                className="data-[state=checked]:bg-white/20 border-2 transition-colors duration-300"
              />
              <Label htmlFor="skip-enhancement" className="text-xs md:text-sm font-medium">Skip Prompt Enhancement</Label>
            </div>

            <div className="space-y-3 md:space-y-4 pt-2 md:pt-4">
              <Button 
                onClick={generateImage} 
                disabled={loading} 
                className="w-full bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 rounded-xl border border-white/10 text-sm md:text-base py-5 md:py-6"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Generating...</span>
                  </div>
                ) : "Generate Image"}
              </Button>
              <Button 
                onClick={clearPrompt} 
                variant="outline" 
                className="w-full border-white/10 hover:bg-white/10 transition-all duration-300 rounded-xl hover:shadow-xl text-sm md:text-base"
              >
                Clear
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:block w-[2px] h-full bg-gradient-to-b from-white/5 via-white/10 to-white/5"></div>

      {/* Main Canvas Area */}
      <div className="flex-1 h-[calc(100vh-350px)] md:h-screen overflow-hidden p-4 md:p-6 flex items-center justify-center">
        {image ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="group relative max-w-[95%] md:max-w-[90%] max-h-[95%] md:max-h-[90%] transition-transform duration-300">
              <img
                src={image}
                alt="Generated"
                className="rounded-2xl shadow-2xl max-w-full max-h-[70vh] md:max-h-[85vh] object-contain transition-all duration-300 group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.3)] group-hover:scale-[1.02]"
                onClick={() => setLightboxOpen(true)}
              />
              {overlayVisible && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl flex items-center justify-center transition-opacity duration-300">
                  <div className="text-white p-4 md:p-8 max-w-[90%] md:max-w-[80%]">
                    <p className="text-base md:text-lg leading-relaxed">{enhancedPrompt}</p>
                    <button 
                      onClick={toggleOverlay} 
                      className="mt-4 md:mt-6 px-4 md:px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 hover:shadow-xl text-sm md:text-base"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
              <div className="absolute bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
                <Button
                  onClick={saveImage}
                  variant="secondary"
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5 rounded-xl px-4 md:px-6 text-sm md:text-base whitespace-nowrap"
                >
                  Download Image
                </Button>
                <Button
                  onClick={toggleOverlay}
                  variant="secondary"
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5 rounded-xl px-4 md:px-6 text-sm md:text-base whitespace-nowrap"
                >
                  View Enhanced Prompt
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-3 md:space-y-4 max-w-[90%] md:max-w-md mx-auto p-6 md:p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:bg-white/10 shadow-2xl">
            <p className="text-lg md:text-xl font-medium text-white/90">Your generated image will appear here</p>
            <p className="text-xs md:text-sm text-white/70">Enter a prompt in the sidebar to get started</p>
          </div>
        )}
      </div>

      {image && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={[{ src: image }]}
        />
      )}
    </div>
  );
};

export default ImageGenerator;