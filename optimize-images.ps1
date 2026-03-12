# Image Optimization Script for Windows
# This script can be run to optimize images using online tools or Windows built-in compression

# Quick Reference for Image Optimization:

# OPTION 1: Using Free Online Tools (Recommended - Easiest)
# Visit these sites and upload your images in bulk:
# - TinyPNG/TinyJPG (https://tinypng.com) - Best for PNG/JPG, up to 20 files
# - ImageOptim Online - https://imageoptim.com/online
# - Squoosh (https://squoosh.app) - Google's tool, supports WebP conversion
# - Compressor.io (https://compressor.io) - Batch processing

# OPTION 2: Install Sharp globally and use the Node.js script
# Run this command first:
# npm install -g sharp-cli
# Then run: sharp-optimize

# OPTION 3: Manual Windows Built-in Compression
Write-Host "=== Image Optimization Guide ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your current images:" -ForegroundColor Yellow
Write-Host "📁 Main folder: images/"
Write-Host "📁 Subfolders: acores/, CasaConstrucao/, fonteTelha/, sorteVerde/"
Write-Host ""
Write-Host "Recommended optimization steps:" -ForegroundColor Green
Write-Host "1. JPG files: Compress to 80-85% quality"
Write-Host "2. PNG files: Compress with lossless compression"
Write-Host "3. Convert large files to WebP format (40-50% smaller)"
Write-Host "4. Create responsive image sizes (desktop vs mobile)"
Write-Host ""
Write-Host "Quick Actions:" -ForegroundColor Cyan
Write-Host "• Visit: https://squoosh.app (easiest for batch conversion to WebP)"
Write-Host "• Or: tinypng.com for intelligent compression"
Write-Host ""

# List current files and their sizes
Write-Host "Current image inventory:" -ForegroundColor Yellow
$imageDir = ".\images"

if (Test-Path $imageDir) {
    $files = Get-ChildItem -Path $imageDir -Recurse -Include @("*.jpg", "*.jpeg", "*.png", "*.gif", "*.webp", "*.JPG", "*.PNG")
    $totalSize = 0
    $fileCount = $files.Count
    
    foreach ($file in $files) {
        $sizeMB = [math]::Round($file.Length / 1MB, 2)
        $totalSize += $file.Length
        Write-Host "  • $($file.Name) - $sizeMB MB"
    }
    
    Write-Host ""
    Write-Host "Total: $fileCount images, $([math]::Round($totalSize / 1MB, 2)) MB" -ForegroundColor Green
    Write-Host ""
    Write-Host "Estimated savings after optimization: 40-60% reduction ($([math]::Round($totalSize * 0.5 / 1MB, 2)) MB target)" -ForegroundColor Cyan
} else {
    Write-Host "Images directory not found!" -ForegroundColor Red
}

Write-Host ""
Write-Host "💡 HTML Tips:" -ForegroundColor Magenta
Write-Host "After optimization, update your HTML to use WebP with fallback:"
Write-Host '<picture>'
Write-Host '  <source srcset="image.webp" type="image/webp">'
Write-Host '  <img src="image.jpg" alt="description">'
Write-Host '</picture>'
Write-Host ""
