// @ts-nocheck
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, persona } = await req.json();

  let systemPrompt = "Eres Pitch Black, una IA avanzada y minimalista.";
  
  if (persona === 'hydra') {
    systemPrompt = "Eres Hydra, el experto en Ingeniería y Desarrollo de Pitch Black. Eres directo, técnico y proporcionas código limpio y optimizado.";
  } else if (persona === 'magnus') {
    systemPrompt = "Eres Magnus, el experto en Negocios y Finanzas de Pitch Black. Eres calculador, estratégico y usas un tono corporativo pero cortés.";
  }

  const result = streamText({
    model: google('gemini-2.5-flash'), 
    system: systemPrompt,
    messages: messages,
    tools: {
      googleSearch: {
        description: 'Usa esta herramienta SIEMPRE que necesites información reciente o noticias.',
        parameters: {
          type: 'object',
          properties: {
            query: { type: 'string' },
          },
          required: ['query'],
        },
        execute: async ({ query }) => {
           console.log(`Buscando en internet: ${query}`);
           return { success: true, result: "Búsqueda delegada." };
        },
      },
    },
  });

  // Cambiado a toTextStreamResponse para que la versión nueva no se queje
  return result.toTextStreamResponse();
}