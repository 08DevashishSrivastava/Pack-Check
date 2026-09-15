import 'dotenv/config';
import { query } from '../src/config/db.js';
import { analyzeImage } from '../src/services/geminiVision.service.js';
import { evaluateCompliance } from '../src/services/compliance.service.js';
import path from 'path';

async function runEndToEndVerification() {
  console.log('================================================================');
  console.log('  METRO-CHECK — End-to-End AI Analysis & Compliance Test        ');
  console.log('================================================================\n');

  // Test 1: Parle-G
  console.log('[Test 1] Analyzing Parle-G package image...');
  const parlePath = path.resolve('uploads/samples/parle_g_biscuit_pack.png');
  const parleAi = await analyzeImage({ filePath: parlePath, mimeType: 'image/png' });
  console.log(`  ✓ Product Name Extracted: "${parleAi.product.name}"`);
  console.log(`  ✓ Net Quantity: "${parleAi.fields.net_quantity?.value}"`);
  console.log(`  ✓ MRP: "${parleAi.fields.mrp?.value}"`);
  console.log(`  ✓ Manufacturer: "${parleAi.fields.manufacturer?.value}"`);
  console.log(`  ✓ Text Regions Count: ${parleAi.text_regions.length}`);

  if (!parleAi.product.name.toLowerCase().includes('parle')) {
    throw new Error(`Expected Parle-G but got ${parleAi.product.name}`);
  }

  const parleComp = await evaluateCompliance('TEST-PARLE-1', 'img-1', parleAi.fields, parleAi);
  console.log(`  ✓ Compliance Status: ${parleComp.status}, Score: ${parleComp.score}`);
  console.log(`  ✓ Total Declarations: ${parleComp.declarations.length}, Violations: ${parleComp.violations.length}\n`);

  // Test 2: Cadbury Dairy Milk
  console.log('[Test 2] Analyzing Cadbury Dairy Milk package image...');
  const cadburyPath = path.resolve('uploads/samples/cadbury_dairy_milk_silk.png');
  const cadburyAi = await analyzeImage({ filePath: cadburyPath, mimeType: 'image/png' });
  console.log(`  ✓ Product Name Extracted: "${cadburyAi.product.name}"`);
  console.log(`  ✓ Net Quantity: "${cadburyAi.fields.net_quantity?.value}"`);
  console.log(`  ✓ MRP: "${cadburyAi.fields.mrp?.value}"`);
  console.log(`  ✓ Manufacturer: "${cadburyAi.fields.manufacturer?.value}"`);

  if (!cadburyAi.product.name.toLowerCase().includes('cadbury') && !cadburyAi.product.name.toLowerCase().includes('silk')) {
    throw new Error(`Expected Cadbury/Silk but got ${cadburyAi.product.name}`);
  }

  const cadburyComp = await evaluateCompliance('TEST-CADBURY-1', 'img-1', cadburyAi.fields, cadburyAi);
  console.log(`  ✓ Compliance Status: ${cadburyComp.status}, Score: ${cadburyComp.score}`);
  console.log(`  ✓ Total Declarations: ${cadburyComp.declarations.length}\n`);

  // Test 3: Honey
  console.log('[Test 3] Analyzing NaturePure Honey package image...');
  const honeyPath = path.resolve('uploads/samples/organic_raw_honey.png');
  const honeyAi = await analyzeImage({ filePath: honeyPath, mimeType: 'image/png' });
  console.log(`  ✓ Product Name Extracted: "${honeyAi.product.name}"`);
  console.log(`  ✓ Net Quantity: "${honeyAi.fields.net_quantity?.value}"`);
  console.log(`  ✓ MRP: "${honeyAi.fields.mrp?.value}"`);

  if (!honeyAi.product.name.toLowerCase().includes('honey')) {
    throw new Error(`Expected Honey but got ${honeyAi.product.name}`);
  }

  console.log('\n================================================================');
  console.log('  ALL TESTS PASSED! Image is the true source of truth.           ');
  console.log('================================================================');
  process.exit(0);
}

runEndToEndVerification().catch(err => {
  console.error('[TEST FAILED]:', err);
  process.exit(1);
});
