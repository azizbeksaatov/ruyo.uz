import { GoogleGenerativeAI } from '@google/generative-ai';

const key = process.env.GEMINI_API_KEY ?? '';
if (!key) { console.error('Set GEMINI_API_KEY'); process.exit(1); }

const res = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`
);
const data = await res.json() as { models?: { name: string; supportedGenerationMethods?: string[] }[] };
if (!data.models) { console.log(JSON.stringify(data, null, 2)); process.exit(1); }

console.log('Models that support generateContent:');
for (const m of data.models) {
  if (m.supportedGenerationMethods?.includes('generateContent')) {
    console.log(' ', m.name);
  }
}
