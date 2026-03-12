#!/usr/bin/env node

/**
 * HTML Image Updater
 * Run this AFTER you've optimized your images
 * Usage: node update-html-images.js
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const HTML_FILES = [
  'index.html',
  'imagem_elevada_v1.html',
  'imagem_elevada_v2.html',
  'imagem_elevada_v3.html',
  'imagem_elevada_v4.html',
  'imagem_elevada_v5.html',
  'imagem_elevada_v7_portfolio_image_gallery.html',
  'imagem_elevada_v8_portfolio_carousell_2_rows.html',
  'imagem_elevada_v9_portfolio_carousell_3_rows_working.html',
];

// Image extensions to process
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif'];

function findWebPVersion(imagePath) {
  const webpPath = imagePath.replace(/\.(jpg|jpeg|png|gif)$/i, '.webp');
  if (fs.existsSync(webpPath)) {
    return webpPath;
  }
  return null;
}

function wrapInPictureElement(imagePath) {
  const webpPath = findWebPVersion(imagePath);
  if (!webpPath) {
    // No WebP version found, return original
    return `<img src="${imagePath}" alt="description" loading="lazy">`;
  }
  
  // Extract relative path
  const originalExt = path.extname(imagePath).toLowerCase();
  const originalFile = path.basename(imagePath);
  
  return `<picture>
  <source srcset="${webpPath}" type="image/webp">
  <img src="${imagePath}" alt="description" loading="lazy">
</picture>`;
}

function updateHtmlFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Find all img tags with .jpg, .jpeg, .png, .gif sources
    const imgRegex = /<img[^>]*src=["']([^"']+\.(jpg|jpeg|png|gif))["'][^>]*>/gi;
    
    let matches;
    let updated = false;
    
    while ((matches = imgRegex.exec(content)) !== null) {
      const originalTag = matches[0];
      const imagePath = matches[1];
      
      if (!imagePath.endsWith('.webp')) {
        const webpPath = findWebPVersion(imagePath);
        if (webpPath) {
          const pictureElement = wrapInPictureElement(imagePath);
          content = content.replace(originalTag, pictureElement);
          updated = true;
          console.log(`  ✓ Updated: ${imagePath} → with WebP fallback`);
        }
      }
    }
    
    if (updated) {
      fs.writeFileSync(filePath, content, 'utf-8');
      return { success: true, updated: true };
    } else {
      return { success: true, updated: false };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

console.log('🖼️  HTML Image Updater\n');
console.log('This script will update your HTML files to use WebP images with fallbacks.\n');

const baseDir = process.cwd();
let totalUpdated = 0;
let totalFiles = 0;

HTML_FILES.forEach(htmlFile => {
  const filePath = path.join(baseDir, htmlFile);
  
  if (fs.existsSync(filePath)) {
    console.log(`Processing: ${htmlFile}`);
    const result = updateHtmlFile(filePath);
    
    if (result.success) {
      totalFiles++;
      if (result.updated) totalUpdated++;
      console.log(`  ${result.updated ? '✅' : '⊘'} No WebP images found to update\n`);
    } else {
      console.log(`  ❌ Error: ${result.error}\n`);
    }
  }
});

console.log(`\n✅ Complete!`);
console.log(`   Processed: ${totalFiles} files`);
console.log(`   Updated: ${totalUpdated} files with WebP fallbacks`);
