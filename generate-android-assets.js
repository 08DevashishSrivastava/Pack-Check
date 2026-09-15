import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOGO_SRC = path.resolve(__dirname, '../../client/public/logo.png');
const RES_DIR = path.resolve(__dirname, '../../client/android/app/src/main/res');

const MIPMAP_SIZES = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192,
};

const SPLASH_PORT_SIZES = {
  'drawable-port-mdpi': [320, 480],
  'drawable-port-hdpi': [480, 800],
  'drawable-port-xhdpi': [720, 1280],
  'drawable-port-xxhdpi': [960, 1600],
  'drawable-port-xxxhdpi': [1280, 1920],
};

const SPLASH_LAND_SIZES = {
  'drawable-land-mdpi': [480, 320],
  'drawable-land-hdpi': [800, 480],
  'drawable-land-xhdpi': [1280, 720],
  'drawable-land-xxhdpi': [1600, 960],
  'drawable-land-xxxhdpi': [1920, 1280],
};

async function generateAssets() {
  console.log('Generating PackCheck Android Launcher Icons & Splash Screens...');
  if (!fs.existsSync(LOGO_SRC)) {
    console.error('Logo source not found:', LOGO_SRC);
    return;
  }

  // 1. Generate Mipmap Launcher Icons
  for (const [folder, size] of Object.entries(MIPMAP_SIZES)) {
    const targetDir = path.join(RES_DIR, folder);
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

    // Square icon with rounded background
    const bg = Buffer.from(
      `<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${Math.round(size * 0.2)}" fill="#0f172a"/></svg>`
    );
    const logoResized = await sharp(LOGO_SRC)
      .resize(Math.round(size * 0.75), Math.round(size * 0.75), { fit: 'inside' })
      .toBuffer();

    await sharp(bg)
      .composite([{ input: logoResized, gravity: 'center' }])
      .png()
      .toFile(path.join(targetDir, 'ic_launcher.png'));

    // Round icon
    const roundBg = Buffer.from(
      `<svg width="${size}" height="${size}"><circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="#0f172a"/></svg>`
    );
    await sharp(roundBg)
      .composite([{ input: logoResized, gravity: 'center' }])
      .png()
      .toFile(path.join(targetDir, 'ic_launcher_round.png'));

    // Foreground icon
    const fg = await sharp(LOGO_SRC)
      .resize(Math.round(size * 0.6), Math.round(size * 0.6), { fit: 'inside' })
      .toBuffer();
    await sharp({
      create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } }
    })
      .composite([{ input: fg, gravity: 'center' }])
      .png()
      .toFile(path.join(targetDir, 'ic_launcher_foreground.png'));

    console.log(`Generated ${folder} (${size}x${size})`);
  }

  // 2. Generate Splash Screens (Portrait & Landscape)
  for (const [folder, [w, h]] of Object.entries(SPLASH_PORT_SIZES)) {
    const targetDir = path.join(RES_DIR, folder);
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

    const logoWidth = Math.round(Math.min(w * 0.65, 450));
    const logoResized = await sharp(LOGO_SRC)
      .resize(logoWidth, null, { fit: 'inside' })
      .toBuffer();

    await sharp({
      create: { width: w, height: h, channels: 4, background: { r: 15, g: 23, b: 42, alpha: 1 } } // #0f172a dark slate
    })
      .composite([{ input: logoResized, gravity: 'center' }])
      .png()
      .toFile(path.join(targetDir, 'splash.png'));

    console.log(`Generated portrait splash in ${folder} (${w}x${h})`);
  }

  for (const [folder, [w, h]] of Object.entries(SPLASH_LAND_SIZES)) {
    const targetDir = path.join(RES_DIR, folder);
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

    const maxW = Math.round(w * 0.6);
    const maxH = Math.round(h * 0.6);
    const logoResized = await sharp(LOGO_SRC)
      .resize(maxW, maxH, { fit: 'inside' })
      .toBuffer();

    await sharp({
      create: { width: w, height: h, channels: 4, background: { r: 15, g: 23, b: 42, alpha: 1 } }
    })
      .composite([{ input: logoResized, gravity: 'center' }])
      .png()
      .toFile(path.join(targetDir, 'splash.png'));

    console.log(`Generated landscape splash in ${folder} (${w}x${h})`);
  }

  // Default drawable/splash.png
  const defaultDrawableDir = path.join(RES_DIR, 'drawable');
  if (!fs.existsSync(defaultDrawableDir)) fs.mkdirSync(defaultDrawableDir, { recursive: true });
  const defaultLogo = await sharp(LOGO_SRC).resize(450, 200, { fit: 'inside' }).toBuffer();
  await sharp({
    create: { width: 600, height: 600, channels: 4, background: { r: 15, g: 23, b: 42, alpha: 1 } }
  })
    .composite([{ input: defaultLogo, gravity: 'center' }])
    .png()
    .toFile(path.join(defaultDrawableDir, 'splash.png'));

  console.log('All PackCheck Android assets successfully generated.');
}

generateAssets().catch(err => console.error('Asset generation error:', err));
