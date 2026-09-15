import 'dotenv/config';
import fs from 'fs/promises';

async function testRest() {
  const buffer = await fs.readFile('uploads/samples/parle_g_biscuit_pack.png');
  const base64 = buffer.toString('base64');
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  
  console.log(`Calling REST API for ${model}...`);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  
  const start = Date.now();
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: 'Analyze this product package label and extract JSON with product_name, brand, net_quantity, mrp, manufacturer, date, consumer_care, country_of_origin.' },
          { inline_data: { mime_type: 'image/png', data: base64 } }
        ]
      }],
      generationConfig: {
        response_mime_type: 'application/json'
      }
    })
  });
  
  console.log(`Status: ${res.status} ${res.statusText}, took ${Date.now() - start}ms`);
  const data = await res.json();
  console.log('Result:', JSON.stringify(data, null, 2));
}

testRest().catch(console.error);
