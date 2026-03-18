const fs = require('fs');
const path = require('path');

function generateInsights() {
  const baseDir = path.join(process.cwd(), 'skills/evolver/assets/gep');
  const eventsPath = path.join(baseDir, 'events.jsonl');
  
  if (!fs.existsSync(eventsPath)) return { error: 'Events log not found' };
  
  const lines = fs.readFileSync(eventsPath, 'utf8').trim().split('\n');
  const events = lines.map(l => {
    try { return JSON.parse(l); } catch(e) { return null; }
  }).filter(e => e && e.type === 'EvolutionEvent');
  
  const recent = events.slice(-10);
  const avgBlastFiles = recent.reduce((sum, e) => sum + (e.blast_radius?.files || 0), 0) / recent.length;
  const avgScore = recent.reduce((sum, e) => sum + (e.outcome?.score || 0), 0) / recent.length;
  
  const intents = recent.map(e => e.intent).filter(Boolean);
  const intentCounts = {};
  intents.forEach(i => intentCounts[i] = (intentCounts[i] || 0) + 1);
  
  const insights = [];
  if (avgScore > 0.9) insights.push('System performance is excellent - maintain current strategy.');
  if (avgBlastFiles > 8) insights.push('Blast radius is high - consider smaller targeted changes.');
  if (intentCounts.innovate > 8) insights.push('Heavy innovation bias - may need consolidation phase.');
  if (events.length > 30) insights.push('System has accumulated significant history - consider pattern recognition.');
  if (insights.length === 0) insights.push('No critical issues detected - continue steady evolution.');
  
  let summary = `### 💡 Cycle Insights\n\n`;
  summary += `**Recent Statistics:**\n`;
  summary += `- Events analyzed: ${events.length}\n`;
  summary += `- Avg blast files: ${avgBlastFiles.toFixed(1)}\n`;
  summary += `- Avg score: ${(avgScore * 100).toFixed(0)}%\n\n`;
  summary += `**Recommendations:**\n`;
  insights.forEach(i => summary += `- ${i}\n`);

  return { insights, summary };
}

module.exports = { generateInsights, main: () => {
  const result = generateInsights();
  console.log(result.summary || result.error);
  return result;
}};
