import 'dotenv/config';
import fs from 'fs/promises';
import { GoogleGenAI } from '@google/genai';

async function test() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const buffer = await fs.readFile('uploads/samples/parle_g_biscuit_pack.png');
  console.log('Sending request...');
  const start = Date.now();
  const res = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
    contents: [
      { text: 'Extract product identity, declarations, and text regions as JSON.' },
      { inlineData: { mimeType: 'image/png', data: buffer.toString('base64') } }
    ],
    config: {
      responseMimeType: 'application/json'
    }
  });
  console.log(`Took ${Date.now() - start}ms`);
  console.log(res.text);
}

test().catch(console.error);
