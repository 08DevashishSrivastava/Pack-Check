import dotenv from 'dotenv';
dotenv.config();
import { setupDemoImages } from './src/utils/setupDemoImages.js';
setupDemoImages().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
