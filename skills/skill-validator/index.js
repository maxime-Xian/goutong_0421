const fs = require('fs');
const path = require('path');
function validateSkills() {
  const skillsDir = path.join(process.cwd(), 'skills');
  const skills = fs.readdirSync(skillsDir).filter(f => fs.statSync(path.join(skillsDir, f)).isDirectory());
  const report = { compliant: [], nonCompliant: [] };
  const required = ['index.js', 'SKILL.md', 'package.json'];
  skills.forEach(skill => {
    const missing = required.filter(file => !fs.existsSync(path.join(skillsDir, skill, file)));
    if (missing.length === 0) {
      report.compliant.push(skill);
    } else {
      report.nonCompliant.push({ name: skill, missing });
    }
  });
  return report;
}
module.exports = { validateSkills, main: () => {
  const result = validateSkills();
  console.log(`Audited ${result.compliant.length + result.nonCompliant.length} skills.`);
  console.log(`Non-Compliant: ${result.nonCompliant.length}`);
  if (result.nonCompliant.length > 0) {
    console.log(JSON.stringify(result.nonCompliant, null, 2));
  }
  return result;
}};
