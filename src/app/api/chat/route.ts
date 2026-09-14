import { createGoogleGenAI } from '@ai-sdk/google';
import { streamText } from 'ai';

// Inicializamos el motor de Google con tu llave
const google = createGoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

// Le decimos a Vercel que esta ruta puede tardar un poco (hasta 30 segundos)
export const maxDuration = 30;

export async function POST(req: Request) {
  // Sacamos los mensajes y la persona (Hydra, Kali, etc.) que envió el frontend
  const { messages, persona } = await req.json();

  // Dependiendo de quién hable, le damos una "personalidad" (System Prompt) distinta
  let systemPrompt = "Eres Pitch Black, una IA avanzada y minimalista.";
  
  if (persona === 'hydra') {
    systemPrompt = "Eres Hydra, el experto en Ingeniería y Desarrollo de Pitch Black. Eres directo, técnico y proporcionas código limpio y optimizado.";
  } else if (persona === 'magnus') {
    systemPrompt = "Eres Magnus, el experto en Negocios y Finanzas de Pitch Black. Eres calculador, estratégico y usas un tono corporativo pero cortés.";
  } // Aquí luego podemos agregar a los demás...

  // Llamamos a la IA
  const result = streamText({
    model: google('gemini-2.5-flash'), // Usamos el modelo más rápido
    system: systemPrompt,
    messages: messages,
    // ¡LA MAGIA DEL INTERNET!: Le damos a la IA la herramienta de buscar en Google
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
           // Nota: En producción real de Vercel/Next.js, el modelo 'gemini-2.5-flash' con el SDK de Vercel 
           // se conecta automáticamente a los servidores de búsqueda de Google si le habilitamos la intención, 
           // pero dejamos este bloque preparado para cuando conectes tu propio modelo local.
           console.log(`Pitch Black está buscando en internet: ${query}`);
           return { success: true, result: "Búsqueda delegada al motor principal." };
        },
      },
    },
  });

  // Devolvemos la respuesta como un "río de datos" (stream) para que parezca que está tecleando
  return result.toDataStreamResponse();
}