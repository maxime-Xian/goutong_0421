const fs = require('fs');
const path = require('path');

function detectTrends() {
  const eventsPath = path.join(process.cwd(), 'skills/evolver/assets/gep/events.jsonl');
  if (!fs.existsSync(eventsPath)) return { error: 'Events log not found' };

  const lines = fs.readFileSync(eventsPath, 'utf8').trim().split('\n');
  const events = lines.map(l => {
    try { return JSON.parse(l); } catch(e) { return null; }
  }).filter(e => e && e.type === 'EvolutionEvent');

  const signalCounts = {};
  const geneCounts = {};
  const intentCounts = {};
  
  events.forEach(e => {
    if (e.signals) e.signals.forEach(s => signalCounts[s] = (signalCounts[s] || 0) + 1);
    if (e.genes_used) e.genes_used.forEach(g => geneCounts[g] = (geneCounts[g] || 0) + 1);
    if (e.intent) intentCounts[e.intent] = (intentCounts[e.intent] || 0) + 1;
  });

  const topSignals = Object.entries(signalCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const topGenes = Object.entries(geneCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  let summary = `### 📈 Evolution Trend Analysis\n\n`;
  summary += `**Top Signals:**\n`;
  topSignals.forEach(([sig, count]) => summary += `  - ${sig}: ${count}\n`);
  summary += `\n**Top Genes:**\n`;
  topGenes.forEach(([gene, count]) => summary += `  - ${gene}: ${count}\n`);
  summary += `\n**Intent Distribution:**\n`;
  Object.entries(intentCounts).forEach(([intent, count]) => summary += `  - ${intent}: ${count}\n`);

  return { signalCounts, geneCounts, intentCounts, topSignals, topGenes, summary };
}

module.exports = { detectTrends, main: () => {
  const result = detectTrends();
  console.log(result.summary || result.error);
  return result;
}};
