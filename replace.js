const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

function processFile(file) {
  if (!file.endsWith('.tsx') && !file.endsWith('.ts')) return;
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  // Replace $ followed by number (e.g., $500, $5,200)
  content = content.replace(/\$([0-9])/g, '₹$1');
  
  // Replace $${ (e.g., $${cost}) with ₹${
  content = content.replace(/\$\$\{/g, '₹${');
  
  // Replace Amount ($) with Amount (₹)
  content = content.replace(/Amount \(\$\)/g, 'Amount (₹)');
  
  // Replace currency = "$" with currency = "₹"
  content = content.replace(/currency = "\$"/g, 'currency = "₹"');

  // Replace >$< with >₹<
  content = content.replace(/>\$</g, '>₹<');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated: ' + file);
  }
}

['app', 'components'].forEach(dir => walk(path.join(process.cwd(), dir), processFile));
