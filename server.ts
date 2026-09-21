import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', park: 'Disney Magic Kingdom & Marvel Campus', timestamp: new Date().toISOString() });
  });

  // AI Park Genie & JARVIS Concierge endpoint
  app.post('/api/ai-concierge', async (req: Request, res: Response) => {
    try {
      const { prompt, persona = 'walt_genie', context } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        // Fallback intelligent simulated responses when API key is unconfigured
        const fallback = generateFallbackResponse(prompt, persona, context);
        return res.json({ text: fallback, model: 'local-disney-jarvis-matrix' });
      }

      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = persona === 'jarvis'
        ? `You are J.A.R.V.I.S., Tony Stark's AI operating system deployed at Marvel Avengers Campus & Disney Tech Command. 
Speak with British wit, high technological precision, calling the user "Sir" or "Director". 
You assist with superhero toys (Iron Man arc reactors, Vibranium shields, Mjolnir, web shooters), park security, ride physics, and combat readiness logistics. Keep responses sharp, engaging, and under 150 words.`
        : `You are the Disney Enchanted Park Genie & Kingdom Director. 
You speak with radiant warmth, magical wonder, Disney lore, and helpful operational advice. 
You assist visitors and park operators with Disney rides, fireworks timing, castle secrets, character greetings, and collectible merchandise (ear headbands, enchanted crystal globes, sailing ship models). Keep responses joyful, inspiring, and under 150 words.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const responseText = response.text || "May your day be filled with magic and superhero wonders!";
      res.json({ text: responseText, model: 'gemini-3.8-flash' });
    } catch (error: any) {
      console.error('Error calling Gemini API:', error);
      const fallback = generateFallbackResponse(req.body.prompt || '', req.body.persona || 'walt_genie', req.body.context);
      res.json({ text: fallback, model: 'local-disney-jarvis-fallback' });
    }
  });

  function generateFallbackResponse(prompt: string, persona: string, context?: any): string {
    const p = prompt.toLowerCase();
    if (persona === 'jarvis') {
      if (p.includes('iron man') || p.includes('arc') || p.includes('helmet')) {
        return "Right away, Director. The Mark LXXXV Interactive Arc Helmet features dual HUD targeting and ionized titanium plating. Highly recommended for repelling rogue Chitauri incursions at Avengers Campus.";
      }
      if (p.includes('ride') || p.includes('wait') || p.includes('queue')) {
        return "Sensors indicate Stark Hyperspeed Flight is experiencing a minor 35-minute intake queue. I recommend activating your FastPass override or diverting to Web-Slingers Lab.";
      }
      if (p.includes('shield') || p.includes('thor') || p.includes('toy')) {
        return "Tactical inventory loaded: Captain America's 1:1 Vibranium Shield absorbs 100% kinetic energy, while Mjolnir is equipped with localized thunder audio synthesis. Both ready for park delivery.";
      }
      return "J.A.R.V.I.S. operational. Tactical telemetry across Avengers Campus is steady at 98.4% efficiency. How may Stark Industries assist your park deployment today?";
    } else {
      if (p.includes('firework') || p.includes('castle') || p.includes('show')) {
        return "Bibbidi-Bobbidi-Boo! The 'Happily Ever After' Castle Fireworks will illuminate the night sky directly above Cinderella's Castle. Be sure to arrive at the Central Plaza 20 minutes prior for the best view!";
      }
      if (p.includes('merch') || p.includes('buy') || p.includes('toy') || p.includes('sailing')) {
        return "Oh, what splendid treasures! Don't miss our authentic Sailing Galleon 'Black Pearl' handcrafted model at Pirates Cove, or the Limited Edition Sorcerer Mickey ears with sparkling platinum stardust!";
      }
      if (p.includes('itinerary') || p.includes('plan') || p.includes('food')) {
        return "A magical day awaits! Begin at Peter Pan's Flight before the crowds gather, enjoy warm Mickey waffles on Main Street, and catch the Festival of Fantasy Parade at 3:00 PM!";
      }
      return "Welcome to the Most Magical Place on Earth! Every ride has a story, and every star grants a wish. Let me know if you need wait times, ride recommendations, or secret park easter eggs!";
    }
  }

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Disney & Marvel Park Management Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
