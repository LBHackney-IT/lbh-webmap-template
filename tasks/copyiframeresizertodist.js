import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Recreate __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const srcDir = path.join(__dirname, '../assets/iframe/');
const distDir = path.join(__dirname, '../dist');

// Copy files recursively from src to dist
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

if (fs.existsSync(srcDir)) {
  copyDir(srcDir, distDir);
  // fs.rmSync(srcDir, { recursive: true, force: true });
  console.log('Moved assets to dist successfully!');
} else {
  console.log('Source assets directory does not exist.');
}