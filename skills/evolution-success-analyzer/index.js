const fs = require('fs');
const path = require('path');

function analyze() {
  const eventsPath = path.join(process.cwd(), 'skills/evolver/assets/gep/events.jsonl');
  if (!fs.existsSync(eventsPath)) return { error: 'Events log not found' };

  const lines = fs.readFileSync(eventsPath, 'utf8').trim().split('\n');
  const events = lines.map(l => {
    try { return JSON.parse(l); } catch(e) { return null; }
  }).filter(e => e && e.type === 'EvolutionEvent');

  const stats = {
    totalCycles: events.length,
    successCount: 0,
    averageScore: 0,
    intentDistribution: {},
    geneUsage: {}
  };

  let totalScore = 0;
  events.forEach(e => {
    if (e.outcome && e.outcome.status === 'success') stats.successCount++;
    totalScore += (e.outcome ? e.outcome.score || 0 : 0);
    
    const intent = e.intent || 'unknown';
    stats.intentDistribution[intent] = (stats.intentDistribution[intent] || 0) + 1;

    if (e.genes_used && Array.isArray(e.genes_used)) {
      e.genes_used.forEach(g => {
        stats.geneUsage[g] = (stats.geneUsage[g] || 0) + 1;
      });
    }
  });

  stats.averageScore = stats.totalCycles > 0 ? (totalScore / stats.totalCycles).toFixed(2) : 0;
  stats.successRate = stats.totalCycles > 0 ? ((stats.successCount / stats.totalCycles) * 100).toFixed(1) + '%' : '0%';

  let summary = `### 🏆 Evolution Success Analysis\n\n`;
  summary += `- **Total Cycles**: ${stats.totalCycles}\n`;
  summary += `- **Success Rate**: ${stats.successRate}\n`;
  summary += `- **Avg Score**: ${stats.averageScore}\n\n`;
  summary += `**Intents:**\n` + Object.entries(stats.intentDistribution).map(([k,v]) => `  - ${k}: ${v}`).join('\n') + '\n';

  return { stats, summary };
}

module.exports = { analyze, main: () => {
  const result = analyze();
  console.log(result.summary || result.error);
  return result;
}};
