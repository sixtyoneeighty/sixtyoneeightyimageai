import React, { useState } from 'react';
import Image from 'next/image';

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.data && data.data[0] && data.data[0].b64_json) {
        setImage(`data:image/png;base64,${data.data[0].b64_json}`);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error generating image:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold mb-4">AI Text-to-Image Generator</h1>
      <div className="mb-4">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter prompt"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        onClick={generateImage}
        disabled={loading || !prompt}
        className={`w-full py-2 px-4 rounded-md text-white font-semibold ${
          loading || !prompt ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {loading ? 'Generating...' : 'Generate Image'}
      </button>
      {error && (
        <p className="mt-4 text-red-500">{error}</p>
      )}
      {image && (
        <div className="mt-6">
          <Image
            src={image}
            alt="Generated"
            width={400}
            height={400}
            layout="responsive"
            className="rounded-md"
          />
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;