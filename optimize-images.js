const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const IMAGE_DIR = path.join(__dirname, 'images');
const QUALITY = 80; // 1-100, lower = smaller file
const WEBP_QUALITY = 75;

async function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch {
    return 0;
  }
}

async function optimizeImage(inputPath, outputPath, format = 'webp') {
  try {
    let transformer = sharp(inputPath);
    
    if (format === 'webp') {
      transformer = transformer.webp({ quality: WEBP_QUALITY });
    } else if (format === 'jpeg') {
      transformer = transformer.jpeg({ quality: QUALITY });
    } else if (format === 'png') {
      transformer = transformer.png({ compressionLevel: 9 });
    }
    
    await transformer.toFile(outputPath);
    return true;
  } catch (err) {
    console.error(`Error optimizing ${inputPath}:`, err.message);
    return false;
  }
}

async function processDirectory(dir, relativePath = '') {
  const files = fs.readdirSync(dir);
  let stats = { processed: 0, skipped: 0, totalSavings: 0 };
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const relPath = relativePath ? `${relativePath}/${file}` : file;
    
    if (fs.statSync(fullPath).isDirectory()) {
      const subStats = await processDirectory(fullPath, relPath);
      stats.processed += subStats.processed;
      stats.skipped += subStats.skipped;
      stats.totalSavings += subStats.totalSavings;
      continue;
    }
    
    const ext = path.extname(file).toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
      continue;
    }
    
    // Skip if already WebP
    if (ext === '.webp') {
      stats.skipped++;
      continue;
    }
    
    const originalSize = await getFileSize(fullPath);
    const webpPath = fullPath.replace(/\.[^.]+$/, '.webp');
    
    // Also keep compressed original
    if (['.jpg', '.jpeg'].includes(ext)) {
      await optimizeImage(fullPath, fullPath, 'jpeg');
    } else if (ext === '.png') {
      await optimizeImage(fullPath, fullPath, 'png');
    }
    
    // Create WebP version
    await optimizeImage(fullPath, webpPath, 'webp');
    
    const newSize = await getFileSize(fullPath);
    const webpSize = await getFileSize(webpPath);
    const bestSize = Math.min(newSize, webpSize);
    const savings = originalSize - bestSize;
    
    if (savings > 0) {
      stats.totalSavings += savings;
    }
    
    const percent = ((savings / originalSize) * 100).toFixed(1);
    console.log(`✓ ${relPath}: ${(originalSize / 1024).toFixed(1)}KB → ${(bestSize / 1024).toFixed(1)}KB (${percent}% smaller)`);
    stats.processed++;
  }
  
  return stats;
}

async function main() {
  console.log('🖼️  Starting image optimization...\n');
  
  try {
    const stats = await processDirectory(IMAGE_DIR);
    
    console.log(`\n✅ Optimization complete!`);
    console.log(`   Processed: ${stats.processed} images`);
    console.log(`   Skipped: ${stats.skipped} images`);
    console.log(`   Total space saved: ${(stats.totalSavings / 1024 / 1024).toFixed(2)}MB`);
    console.log(`\n💡 Tip: Use .webp versions in your HTML for better performance`);
    
  } catch (err) {
    console.error('Error:', err.message);
  }
}

main();
