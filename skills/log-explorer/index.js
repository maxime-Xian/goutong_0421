const fs = require('fs');
const path = require('path');
function analyzeLogs(logDir, pattern = /error/i) {
  if (!fs.existsSync(logDir)) return { success: false, error: 'Directory not found' };
  const files = fs.readdirSync(logDir).filter(f => f.endsWith('.json') || f.endsWith('.jsonl') || f.endsWith('.log'));
  const results = {};
  files.forEach(file => {
    const content = fs.readFileSync(path.join(logDir, file), 'utf8');
    const lines = content.split('\n');
    lines.forEach(line => {
      if (pattern.test(line)) {
        results[file] = (results[file] || 0) + 1;
      }
    });
  });
  return { success: true, issues: results };
}
module.exports = { analyzeLogs, main: () => {
  console.log('Exploring logs in workspace...');
  const result = analyzeLogs(path.join(process.cwd(), 'logs'));
  console.log(JSON.stringify(result, null, 2));
  return result;
}};
