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
    </div>
  );
};

export default ImageGenerator;
