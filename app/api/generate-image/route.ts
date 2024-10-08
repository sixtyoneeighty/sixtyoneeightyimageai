import { NextResponse } from 'next/server';
import Together from 'together-ai';

const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    console.log('Received prompt:', prompt);

    // Measure time taken for image generation
    console.time('Image Generation');

    // Generate image using Together.ai
    const response = await together.images.create({
      model: "black-forest-labs/FLUX.1.1-pro",
      prompt: prompt,
      width: 1024,
      height: 768,
      steps: 1,
      n: 1,
    });
    console.timeEnd('Image Generation');

    console.log('API Response:', JSON.stringify(response, null, 2));

    if (!response || !response.data || response.data.length === 0) {
      console.error('No data received from Together.ai');
      return NextResponse.json({ error: 'No data received from image generation API' }, { status: 500 });
    }

    const imageBase64 = response.data[0]?.b64_json;

    if (!imageBase64) {
      console.error('Image data is missing in the response');
      return NextResponse.json({ error: 'Image data is missing in the API response' }, { status: 500 });
    }

    // Return the base64 encoded image data directly
    return NextResponse.json({ imageData: imageBase64 });
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json({ error: 'Failed to generate image', details: error.message }, { status: 500 });
  }
}