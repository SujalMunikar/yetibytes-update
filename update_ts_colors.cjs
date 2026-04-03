const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  content = content.replace(/blue-/g, 'green-');
  content = content.replace(/cyan-/g, 'emerald-');
  content = content.replace(/indigo-/g, 'teal-');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated', filePath);
  }
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      replaceInFile(fullPath);
    }
  }
}

processDirectory(path.join(__dirname, 'src'));
console.log('Theme files updated successfully.');
