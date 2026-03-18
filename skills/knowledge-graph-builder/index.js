const fs = require('fs');
const path = require('path');

function buildGraph() {
  const nodes = [];
  const edges = [];

  // 1. Process Skills from SKILLS_OVERVIEW.md
  const overviewPath = path.join(process.cwd(), 'SKILLS_OVERVIEW.md');
  if (fs.existsSync(overviewPath)) {
    const content = fs.readFileSync(overviewPath, 'utf8');
    const skillMatches = content.match(/\|\s*\*\*([^*]+)\*\*\s*\|/g);
    if (skillMatches) {
      skillMatches.forEach(m => {
        const name = m.match(/\*\*([^*]+)\*\*/)[1].trim();
        nodes.push({ id: `skill:${name}`, type: 'skill', label: name });
      });
    }
  }

  // 2. Process Significant Events from MEMORY.md
  const memoryPath = path.join(process.cwd(), 'MEMORY.md');
  if (fs.existsSync(memoryPath)) {
    const content = fs.readFileSync(memoryPath, 'utf8');
    const eventMatches = content.match(/\*\*(\d{4}-\d{2}-\d{2})\*\*/g);
    if (eventMatches) {
      eventMatches.forEach(m => {
        const date = m.match(/\*\*([^*]+)\*\*/)[1].trim();
        nodes.push({ id: `event:${date}`, type: 'event', label: date });
      });
    }
  }

  // 3. Simple relationship: if a memory mentions a skill name
  nodes.filter(n => n.type === 'event').forEach(eventNode => {
    const memoryContent = fs.readFileSync(memoryPath, 'utf8');
    nodes.filter(s => s.type === 'skill').forEach(skillNode => {
      if (memoryContent.includes(skillNode.label)) {
        edges.push({ from: eventNode.id, to: skillNode.id, type: 'MENTIONS' });
      }
    });
  });

  return { nodes, edges, summary: `Graph built with ${nodes.length} nodes and ${edges.length} edges.` };
}

module.exports = { buildGraph, main: () => {
  console.log('Building knowledge graph...');
  const graph = buildGraph();
  console.log(JSON.stringify(graph, null, 2));
  return graph;
}};
