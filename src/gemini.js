import { getApp } from '@react-native-firebase/app';
import { getAI, getGenerativeModel, GoogleAIBackend } from '@react-native-firebase/ai';

export const PROMPT = `Eres un tutor que analiza fotos de apuntes escolares.
Analiza la imagen y responde ÚNICAMENTE con un JSON válido, sin texto adicional ni bloques de código markdown, con esta estructura exacta:
{
  "titulo": "",
  "resumen": "",
  "conceptos_clave": [],
  "preguntas": [
    { "pregunta": "", "opciones": [], "correcta": 0 }
  ]
}
Reglas:
- "titulo": máximo 8 palabras.
- "resumen": entre 3 y 5 oraciones en español.
- "conceptos_clave": entre 4 y 8 conceptos breves.
- "preguntas": exactamente 5 preguntas de opción múltiple basadas solo en el contenido de los apuntes.
- Cada pregunta tiene 4 opciones y "correcta" es el índice (0 a 3) de la opción correcta.
- Si la imagen no es un apunte o es ilegible, responde con titulo "No legible", un resumen que explique el problema, y listas vacías.`;

const ai = getAI(getApp(), { backend: new GoogleAIBackend() });

// Si el modelo da error 404, cambia el nombre aquí (solo hay que tocar esta línea).
const model = getGenerativeModel(ai, {
  model: 'gemini-3.5-flash-lite',
  generationConfig: { responseMimeType: 'application/json' },
});

function conTiempo(promesa, ms) {
  return Promise.race([
    promesa,
    new Promise((_, rechazar) =>
      setTimeout(() => rechazar(new Error('Tiempo de espera agotado')), ms)
    ),
  ]);
}

export async function analizarApunte(base64, mimeType = 'image/jpeg') {
  const result = await conTiempo(
  model.generateContent([PROMPT, { inlineData: { mimeType, data: base64 } }]),
  120000
);
  const texto = result.response.text();
  // Por si el modelo envolviera el JSON en ```json ... ```
  const limpio = texto.replace(/^```json\s*|^```\s*|```\s*$/gim, '').trim();
  return JSON.parse(limpio); // el try/catch está en quien llama
}
