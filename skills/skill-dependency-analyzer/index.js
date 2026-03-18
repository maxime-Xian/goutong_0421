const fs = require('fs');
const path = require('path');
function analyze() {
  const skillsDir = path.join(process.cwd(), 'skills');
  const skills = fs.readdirSync(skillsDir).filter(f => fs.statSync(path.join(skillsDir, f)).isDirectory());
  const map = {};
  skills.forEach(skill => {
    const indexPath = path.join(skillsDir, skill, 'index.js');
    if (fs.existsSync(indexPath)) {
      const content = fs.readFileSync(indexPath, 'utf8');
      const matches = content.match(/require\(['"]\.\/skills\/([^'"]+)['"]\)/g) || [];
      map[skill] = matches.map(m => m.match(/skills\/([^'"]+)/)[1]);
    }
  });
  return map;
}
module.exports = { analyze, main: () => {
  const result = analyze();
  console.log(JSON.stringify(result, null, 2));
  return result;
}};
