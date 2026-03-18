const fs = require('fs');
const path = require('path');
function generateTimeline(limit = 10) {
  const eventsPath = path.join(process.cwd(), 'skills/evolver/assets/gep/events.jsonl');
  if (!fs.existsSync(eventsPath)) return "Log not found.";
  const lines = fs.readFileSync(eventsPath, 'utf8').trim().split('\n');
  const events = lines.map(l => JSON.parse(l)).filter(e => e.type === 'EvolutionEvent').slice(-limit).reverse();
  let md = "| ID | Intent | Status | Radius |\n| :--- | :--- | :--- | :--- |\n";
  events.forEach(e => {
    md += `| ${e.id} | ${e.intent} | ${e.outcome.status === 'success' ? '✅' : '❌'} | ${e.blast_radius.files}f/${e.blast_radius.lines}l |\n`;
  });
  return md;
}
module.exports = { generateTimeline, main: () => console.log(generateTimeline(5)) };
