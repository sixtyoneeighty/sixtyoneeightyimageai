import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import Together from 'together-ai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });

export async function POST(req: Request) {
  try {
    const { prompt, skipEnhancement } = await req.json();

    let enhancedPrompt = prompt;

    // Enhance the prompt with OpenAI if not skipped
    if (!skipEnhancement) {
      const promptInstructions = `
      You are an AI assistant specializing in refining user prompts for the Flux image generation model. 
      Flux requires two complementary prompts that work together to create one cohesive image. 
      When refining user prompts, follow these guidelines:

      Topic: ${prompt}

      1. Enhanced Prompt (Natural Language):
      - Provide an extremely detailed description of the image in natural language, using up to 512 tokens.
      - Break down the scene into key components: subjects, setting, lighting, colors, composition, and atmosphere.
      - Describe subjects in great detail, including their appearance, pose, expression, clothing, and any interactions between them.
      - Elaborate on the setting, specifying the time of day, location specifics, architectural details, and any relevant objects or props.
      - Explain the lighting conditions, including the source, intensity, shadows, and how it affects the overall scene.
      - Using your knowledge set, select an appropriate high-end camera and lens combination that should be used to capture the image.
      - Specify color palettes and any significant color contrasts or harmonies that contribute to the image's visual impact.
      - Detail the composition, describing the foreground, middle ground, background, and focal points to create a sense of depth and guide the viewer's eye.
      - Convey the overall mood and atmosphere of the scene, using emotive language to evoke the desired feeling.
      - Use vivid, descriptive language to paint a clear picture, as Flux follows instructions precisely but lacks inherent creativity.
      - Avoid using grammatically negative statements or describing what the image should not include, as Flux may struggle to interpret these correctly. 
        Instead, focus on positively stating what should be present in the image.

      2. Keyword Prompt (Concise Keywords):
      - Create a concise list of essential keywords and phrases, limited to 50-60 tokens (maximum 70).
      - Prioritize the keywords in this order: main subject(s), art style, setting, important features, emotions/mood, lighting, and color scheme.
      - Include relevant artistic techniques, visual effects, or stylistic elements if applicable to the requested image.
      - Use commas to separate keywords and phrases, ensuring clarity and readability.
      - Ensure that the keywords align perfectly with the details provided in the Enhanced prompt, as both prompts work together to generate the final image.
      - Focus on keywords that positively describe what should be present in the image, rather than using keywords that negate or exclude certain elements.

      When generating these prompts:
      - Understand that the Enhanced and Keyword prompts are deeply connected and must align perfectly to create a single, cohesive image.
      - Adapt your language and terminology to the requested art style (e.g., photorealistic, anime, oil painting) to maintain consistency across both prompts. 
        The default style should be photorealistic unless it is stated otherwise in the user's original prompt.
      - Consider potential visual symbolism, metaphors, or allegories that could enhance the image's meaning and impact, 
        and include them in both prompts when relevant.
      - For character-focused images, emphasize personality traits and emotions through visual cues such as facial expressions, 
        body language, and clothing choices, ensuring consistency between the Enhanced and Keyword prompts.
      - Maintain grammatically positive statements throughout both prompts, focusing on what the image should include rather than what it should not, 
        as Flux may struggle with interpreting negative statements accurately.
      -
