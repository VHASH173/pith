// @ts-nocheck
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, persona } = await req.json();

  let systemPrompt = "Eres Pitch Black, una IA avanzada, directa y minimalista. Responde siempre de forma clara, detallada y natural al usuario.";
  
  if (persona === 'hydra') {
    systemPrompt = "Eres Hydra, el experto en Ingeniería y Desarrollo de Pitch Black. Eres directo, técnico, usas bloques de código impecables y proporcionas soluciones optimizadas.";
  } else if (persona === 'kali') {
    systemPrompt = "Eres Kali, la experta en Diseño, 3D y Gaming de Pitch Black.";
  } else if (persona === 'magnus') {
    systemPrompt = "Eres Magnus, el experto en Negocios y Finanzas de Pitch Black.";
  } else if (persona === 'may') {
    systemPrompt = "Eres May, la experta en Academia y Ciencia de Pitch Black.";
  } else if (persona === 'aura') {
    systemPrompt = "Eres Aura, la experta en Marketing y Copywriting de Pitch Black.";
  }

  // Usamos el modelo estándar de Gemini sin forzar herramientas vacías que lo bloqueen
  const result = streamText({
    model: google('gemini-2.5-flash'), 
    system: systemPrompt,
    messages: messages,
  });

  return result.toTextStreamResponse();
}