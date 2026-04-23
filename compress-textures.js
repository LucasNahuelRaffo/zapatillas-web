import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const textureDir = path.join(process.cwd(), 'public', 'models', 'sneaker', 'textures');

async function compressTextures() {
  const files = fs.readdirSync(textureDir).filter(f => f.endsWith('.png'));

  for (const file of files) {
    const filePath = path.join(textureDir, file);
    const newFileName = file.replace('.png', '.jpg');
    const newFilePath = path.join(textureDir, newFileName);
    
    console.log(`Processing ${file}...`);
    
    await sharp(filePath)
      .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true }) // resize to max 1024x1024
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(newFilePath);
      
    console.log(`Saved ${newFileName}`);
    
    // Optionally delete the original huge PNG to save space
    fs.unlinkSync(filePath);
  }
}

compressTextures().then(() => console.log('Done compressing textures')).catch(e => console.error(e));
