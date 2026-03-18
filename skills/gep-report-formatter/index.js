const fs = require('fs');
const path = require('path');

function formatReport(eventData) {
  const template = `**{{intent}}** | Score: {{score}} | Files: {{files}} | Lines: {{lines}}
{{summary}}`;
  
  return template
    .replace('{{intent}}', (eventData.intent || 'unknown').toUpperCase())
    .replace('{{score}}', eventData.outcome?.score ? (eventData.outcome.score * 100).toFixed(0) + '%' : 'N/A')
    .replace('{{files}}', eventData.blast_radius?.files || 0)
    .replace('{{lines}}', eventData.blast_radius?.lines || 0)
    .replace('{{summary}}', eventData.summary || '');
}

module.exports = { formatReport, main: () => {
  const testEvent = {
    intent: 'innovate',
    outcome: { score: 0.95 },
    blast_radius: { files: 3, lines: 120 },
    summary: 'Created cycle-insight-generator for strategic recommendations.'
  };
  console.log('### 📋 GEP Report Output\n');
  console.log(formatReport(testEvent));
  return formatReport(testEvent);
}};
