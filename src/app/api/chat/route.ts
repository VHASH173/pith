import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';

// Inicializamos el motor de Google con tu llave
const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

// Le decimos a Vercel que esta ruta puede tardar un poco
export const maxDuration = 30;

export async function POST(req: Request) {
  // Sacamos los mensajes y la persona
  const { messages, persona } = await req.json();

  let systemPrompt = "Eres Pitch Black, una IA avanzada y minimalista.";
  
  if (persona === 'hydra') {
    systemPrompt = "Eres Hydra, el experto en Ingeniería y Desarrollo de Pitch Black. Eres directo, técnico y proporcionas código limpio y optimizado.";
  } else if (persona === 'magnus') {
    systemPrompt = "Eres Magnus, el experto en Negocios y Finanzas de Pitch Black. Eres calculador, estratégico y usas un tono corporativo pero cortés.";
  }

  // Llamamos a la IA usando la función corregida
  const result = streamText({
    model: google('gemini-2.5-flash'), 
    system: systemPrompt,
    messages: messages,
    tools: {
      googleSearch: {
        description: 'Usa esta herramienta SIEMPRE que necesites información reciente, noticias, datos en tiempo real, o cuando el usuario pregunte por algo que no sabes con seguridad.',
        parameters: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'La frase exacta para buscar en Google' },
          },
          required: ['query'],
        },
        execute: async ({ query }) => {
           console.log(`Pitch Black está buscando en internet: ${query}`);
           return { success: true, result: "Búsqueda delegada al motor principal." };
        },
      },
    },
  });

  return result.toDataStreamResponse();
}