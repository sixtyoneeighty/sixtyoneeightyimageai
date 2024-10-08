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
      response_format: "b64_json"
    });

    console.timeEnd('Image Generation');
    console.log(response.data[0].b64_json);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error generating image:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to generate image', details: errorMessage }, { status: 500 });
  }
}