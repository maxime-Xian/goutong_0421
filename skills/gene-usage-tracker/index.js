const fs = require('fs');
const path = require('path');

function trackGeneUsage() {
  const eventsPath = path.join(process.cwd(), 'skills/evolver/assets/gep/events.jsonl');
  if (!fs.existsSync(eventsPath)) return { error: 'Events log not found' };
  
  const lines = fs.readFileSync(eventsPath, 'utf8').trim().split('\n');
  const geneStats = {};
  
  lines.forEach(line => {
    try {
      const event = JSON.parse(line);
      if (event.genes_used) {
        event.genes_used.forEach(gene => {
          geneStats[gene] = (geneStats[gene] || 0) + 1;
        });
      }
    } catch (e) {}
  });
  
  const sorted = Object.entries(geneStats).sort((a, b) => b[1] - a[1]);
  let summary = '### 📊 Gene Usage Tracking\n\n';
  sorted.forEach(([gene, count]) => summary += `- ${gene}: ${count} uses\n`);
  
  return { geneStats, summary };
}

module.exports = { trackGeneUsage, main: () => {
  const result = trackGeneUsage();
  console.log(result.summary || result.error);
  return result;
}};
