import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import { analyzeImage } from '../src/services/geminiVision.service.js';

const imagePath = process.argv[2];
if (!imagePath) {
  console.error('Usage: node scripts/test-gemini-image.js path/to/image.jpg');
  process.exit(2);
}

try {
  const resolvedPath = path.resolve(imagePath);
  const buffer = await fs.readFile(resolvedPath);
  const extension = path.extname(resolvedPath).toLowerCase();
  const mimeType = extension === '.png' ? 'image/png' : extension === '.webp' ? 'image/webp' : 'image/jpeg';
  const result = await analyzeImage({ buffer, mimeType });
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  console.error(`Gemini image analysis failed: ${error.message}`);
  process.exit(1);
}
