import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import Together from 'together-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });

// Define interface for Together.ai response
interface TogetherImageResponse {
  data: Array<{
    url: string;
  }>;
}

export async function POST(req: Request) {
  try {
    const { prompt, skipEnhancement } = await req.json();
    console.log('Received request with prompt:', prompt, 'skipEnhancement:', skipEnhancement);

    let enhancedPrompt = prompt;

    // Enhance the prompt with Gemini if not skipped
    if (!skipEnhancement) {
      console.log('Attempting to enhance prompt with Gemini...');
      try {
        const promptInstructions = `
        You are an AI expert specializing in refining user prompts for the Flux image generation model.
        Create a detailed, structured description following this exact format:

        Topic: ${prompt}

        Structure your response with these exact sections:

        Photograph style: [Describe the photography style, lighting setup, and overall mood]

        Setting: [Describe the location, environment, and atmospheric elements]

        Subject: [Describe the main subject(s), including physical characteristics, pose, and expressions]

        Clothing: [Detail the outfit, accessories, and any notable fashion elements]

        Image composition: [Specify framing, angle, perspective, and any specific compositional requirements]

        -- Keywords: [5-7 essential keywords focusing on style, subject, setting, and mood]

        Example Output:
        Photograph style: fashion photoshoot with bright short lighting.

        Setting: A jungle backdrop, light cascading between dense foliage. There is a light mist in the background.

        Subject: A Brazilian woman, around age 30, with long straight hair, and blunt bangs. Her hair is tied back in a low ponytail. She has one hand on her hip, the other hand is extended giving a peace sign.

        Clothing: The woman is wearing a furry leopard skin tank top, a black and white zebra stripe skirt, tan knee-high socks, and a white pith helmet. She is wearing an orange ascot. She has large gold hoop earrings. She has a small chunky white, green and orange charm bracelet.

        Image composition: the woman should be facing the camera in a three quarters view. The image should have cowboy shot framing.

        -- Keywords: fashion portrait, jungle setting, Brazilian model, exotic fashion, dramatic lighting
        `;

        const result = await model.generateContent(promptInstructions);
        const response = await result.response;
        console.log('Gemini response:', response);
        enhancedPrompt = response.text() || prompt;
      } catch (error: any) {
        console.log('Skipping prompt enhancement due to error:', error.message);
        // Don't treat this as an error, just use the original prompt
        enhancedPrompt = prompt;
      }
    }

    // Generate image using Together.ai
    console.log('Attempting to generate image with prompt:', enhancedPrompt);
    try {
      const response = await together.images.create({
        model: "black-forest-labs/FLUX.1.1-pro",
        prompt: enhancedPrompt,
        width: 1440,
        height: 800,
        steps: 1,
        n: 1
      });
      console.log('Full Together.ai response:', JSON.stringify(response, null, 2)); 
      console.log('Together.ai response:', response);
      const togetherResponse = response as TogetherImageResponse;

      if (!togetherResponse?.data?.[0]?.url) {
        throw new Error('No image URL in Together.ai response');
      }

      return NextResponse.json({
        enhancedPrompt,
        imageUrl: togetherResponse.data[0].url
      });
    } catch (error: any) {
      console.error('Together.ai API error:', error.message);
      return NextResponse.json(
        { error: 'Image generation failed', details: error.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('General API error:', error.message);
    return NextResponse.json(
      { error: 'API request failed', details: error.message },
      { status: 500 }
    );
  }
}
