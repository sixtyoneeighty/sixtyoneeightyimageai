# AI Text-to-Image Generator

This is a Progressive Web App (PWA) that generates images from text descriptions using AI. It utilizes Together.ai's API for image generation and OpenAI's API for optional prompt enhancement.

## Features

- Text-to-image generation using Together.ai's FLUX.1.1-pro model
- Optional prompt enhancement using OpenAI's GPT-4 model
- Responsive design with a dark mode option
- Progressive Web App capabilities for offline use and easy installation

## Getting Started

1. Clone this repository
2. Install dependencies with `npm install`
3. Create a `.env.local` file in the root directory and add your API keys:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   TOGETHER_API_KEY=your_together_api_key_here
   ```
4. Run the development server with `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

This app is designed to be deployed on Vercel. Follow these steps:

1. Push your code to a GitHub repository
2. Connect your GitHub account to Vercel
3. Import the project from GitHub to Vercel
4. In the Vercel dashboard, add the environment variables (OPENAI_API_KEY and TOGETHER_API_KEY)
5. Deploy the application

## Technologies Used

- Next.js
- React
- Tailwind CSS
- shadcn/ui
- OpenAI API
- Together.ai API

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.