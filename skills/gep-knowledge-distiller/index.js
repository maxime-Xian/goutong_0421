const fs = require('fs');
const path = require('path');

function distill() {
  const capsulesPath = path.join(process.cwd(), 'skills/evolver/assets/gep/capsules.json');
  if (!fs.existsSync(capsulesPath)) return "Capsule log not found.";

  const data = JSON.parse(fs.readFileSync(capsulesPath, 'utf8'));
  const capsules = data.capsules || [];

  if (capsules.length === 0) return "No capsules found.";

  let md = "# GEP Knowledge Base\n\nLessons learned and capabilities acquired through evolution.\n\n";
  
  capsules.forEach(c => {
    md += `## ${c.gene}\n`;
    md += `- **Summary**: ${c.summary}\n`;
    md += `- **Trigger**: ${c.trigger.join(', ')}\n`;
    md += `- **Confidence**: ${(c.confidence * 100).toFixed(1)}%\n\n`;
  });

  const outputPath = path.join(process.cwd(), 'GEP_KNOWLEDGE_BASE.md');
  fs.writeFileSync(outputPath, md);
  return outputPath;
}

module.exports = { distill, main: () => {
  console.log('Distilling evolution knowledge...');
  const result = distill();
  console.log('Knowledge base created at: ' + result);
  return result;
}};
