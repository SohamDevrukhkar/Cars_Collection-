const fs = require('fs');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let lines = content.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    // Regular expression to match simple string properties
    const match = line.match(/^(\s*[a-zA-Z0-9_]+:\s*)'([^']*(?:\\'[^']*)*|[^']*'[^']*)'(,?)$/);
    if (match) {
        // Just use a simpler regex or replace inner apostrophes
    }
  }
}
