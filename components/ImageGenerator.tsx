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
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-background via-background/95 to-background/90">
      {/* Sidebar */}
      <div className="w-[350px] min-w-[350px] h-screen border-r border-border/30 bg-card/30 backdrop-blur-xl supports-[backdrop-filter]:bg-background/30 p-8 overflow-y-auto shadow-lg">
        <div className="space-y-16">
          <div className="flex justify-center pt-8 transition-transform hover:scale-105 duration-300">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={200}
              height={100}
              className="w-[180px] h-auto drop-shadow-lg"
              priority
            />
          </div>

          <div className="space-y-8">
            <div className="space-y-2">
              <Label htmlFor="prompt" className="text-lg font-medium">Your Vision</Label>
              <Textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Share your vision here. Our AI will refine and enhance your idea to create a stunning image."
                className="min-h-[120px] resize-none bg-white/5 backdrop-blur-sm border-2 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-lg shadow-sm"
              />
            </div>

            <div className="flex items-center space-x-2 bg-background/10 p-3 rounded-lg backdrop-blur-sm">
              <Checkbox
                id="skip-enhancement"
                checked={skipEnhancement}
                onCheckedChange={(checked) => setSkipEnhancement(checked as boolean)}
                className="data-[state=checked]:bg-primary/80"
              />
              <Label htmlFor="skip-enhancement" className="text-sm">Skip Prompt Enhancement</Label>
            </div>

            <div className="space-y-4">
              <Button 
                onClick={generateImage} 
                disabled={loading} 
                className="w-full bg-primary/80 hover:bg-primary transition-colors duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                    <span>Generating...</span>
                  </div>
                ) : "Generate Image"}
              </Button>
              <Button 
                onClick={clearPrompt} 
                variant="outline" 
                className="w-full border-border/30 hover:bg-background/20 transition-colors duration-200"
              >
                Clear
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 h-screen overflow-hidden p-6 flex items-center justify-center">
        {image ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="group relative max-w-[90%] max-h-[90%] transition-transform duration-300">
              <img
                src={image}
                alt="Generated"
                className="rounded-xl shadow-2xl max-w-full max-h-[85vh] object-contain transition-all duration-300 group-hover:shadow-3xl"
                onClick={() => setLightboxOpen(true)}
              />
              {overlayVisible && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-xl flex items-center justify-center transition-opacity duration-300">
                  <div className="text-white p-6 max-w-[80%]">
                    <p className="text-lg leading-relaxed">{enhancedPrompt}</p>
                    <button 
                      onClick={toggleOverlay} 
                      className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 flex space-x-3">
                <Button
                  onClick={saveImage}
                  variant="secondary"
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Download Image
                </Button>
                <Button
                  onClick={toggleOverlay}
                  variant="secondary"
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  View Enhanced Prompt
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4 max-w-md mx-auto p-8 rounded-xl bg-card/20 backdrop-blur-sm border border-border/30">
            <p className="text-xl font-medium text-foreground/80">Your generated image will appear here</p>
            <p className="text-sm text-muted-foreground">Enter a prompt in the sidebar to get started</p>
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