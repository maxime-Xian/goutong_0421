const fs = require('fs');
const path = require('path');

function getStats(dir, stats = { sloc: 0, files: 0, extensions: {} }) {
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    if (file === 'node_modules' || file === '.git' || file === 'dist') return;
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getStats(fullPath, stats);
    } else {
      stats.files++;
      const ext = path.extname(file) || 'no-extension';
      stats.extensions[ext] = (stats.extensions[ext] || 0) + 1;
      if (['.js', '.md', '.json', '.txt', '.py', '.yml', '.yaml'].includes(ext)) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          stats.sloc += content.split('\n').length;
        } catch (e) {}
      }
    }
  });
  return stats;
}

module.exports = { analyze: () => getStats(process.cwd()), main: () => {
  const stats = getStats(process.cwd());
  console.log(`### 📊 Codebase Statistics`);
  console.log(`- **Total Files**: ${stats.files}`);
  console.log(`- **Estimated SLOC**: ${stats.sloc}`);
  console.log(`\n**File Distribution:**`);
  Object.entries(stats.extensions)
    .sort((a, b) => b[1] - a[1])
    .forEach(([ext, count]) => console.log(`  - ${ext}: ${count}`));
  return stats;
}};
