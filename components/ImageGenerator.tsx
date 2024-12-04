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
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <div className="w-[350px] min-w-[350px] h-screen border-r border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-8 overflow-y-auto">
        <div className="space-y-16">
          <div className="flex justify-center pt-8">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={200}
              height={100}
              className="w-[180px] h-auto"
              priority
            />
          </div>

          <div className="space-y-8">
            <div className="space-y-2">
              <Label htmlFor="prompt">Your Vision</Label>
              <Textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Share your vision here. Our AI will refine and enhance your idea to create a stunning image."
                className="min-h-[120px] resize-none bg-background/50"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="skip-enhancement"
                checked={skipEnhancement}
                onCheckedChange={(checked) => setSkipEnhancement(checked as boolean)}
              />
              <Label htmlFor="skip-enhancement" className="text-sm">Skip Prompt Enhancement</Label>
            </div>

            <div className="space-y-4">
              <Button onClick={generateImage} disabled={loading || !prompt.trim()} className="w-full">
                {loading ? "Generating..." : "Generate Image"}
              </Button>
              <Button onClick={clearPrompt} variant="outline" className="w-full" disabled={!prompt.trim()}>
                Clear
              </Button>
            </div>

            {error && (
              <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 h-screen overflow-hidden p-6 flex items-center justify-center bg-background/95">
        {image ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="group relative max-w-[90%] max-h-[90%]">
              <img
                src={image}
                alt="Generated"
                className="rounded-lg shadow-xl max-w-full max-h-[85vh] object-contain"
                onClick={() => setLightboxOpen(true)}
              />
              {overlayVisible && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-white p-4">
                    <p>{enhancedPrompt}</p>
                    <button onClick={toggleOverlay} className="mt-2 text-sm text-gray-300">Close</button>
                  </div>
                </div>
              )}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  onClick={saveImage}
                  variant="secondary"
                  className="shadow-lg"
                >
                  Download Image
                </Button>
                <Button
                  onClick={toggleOverlay}
                  variant="secondary"
                  className="shadow-lg"
                >
                  View Enhanced Prompt
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            <p className="text-lg">Your generated image will appear here</p>
            <p className="text-sm mt-2">Enter a prompt in the sidebar to get started</p>
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