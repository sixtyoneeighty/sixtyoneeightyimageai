import { NextResponse } from 'next/server';
import Together from 'together-ai';
import fs from 'fs';
import path from 'path';

const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    // Measure time taken for image generation
    console.time('Image Generation');

    // Generate image using Together.ai
    const response = await together.images.create({
      model: "black-forest-labs/FLUX.1.1-pro",
      prompt: prompt, // Use the original prompt directly
      width: 1024,
      height: 768,
      steps: 1,
      n: 1,
    });
    console.timeEnd('Image Generation');

    if (!response || !response.data || response.data.length === 0) {
      throw new Error('No image output received from Together.ai');
    }

    const imageBase64 = response.data[0].b64_json;

    // Decode base64 image data
    const imageBuffer = Buffer.from(imageBase64, 'base64');

    // Define the path to save the image
    const imagePath = path.join(__dirname, 'generated_image.png');

    // Save the image to the file system
    fs.writeFileSync(imagePath, imageBuffer);

    return NextResponse.json({ imageUrl: imagePath });
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
}