const fs = require('fs');
const path = require('path');

function validateEvent(event) {
  const required = ['type', 'id', 'schema_version', 'intent', 'signals', 'genes_used', 'mutation_id', 'personality_state', 'blast_radius', 'outcome'];
  const missing = required.filter(f => !event[f]);
  return { valid: missing.length === 0, missing };
}

module.exports = { validateEvent, main: () => {
  const testEvent = { type: 'EvolutionEvent', id: 'evt_test', schema_version: '1.5.0', intent: 'innovate', signals: ['test'], genes_used: ['test_gene'], mutation_id: 'mut_test', personality_state: {}, blast_radius: {}, outcome: {} };
  const result = validateEvent(testEvent);
  console.log('### 🔬 Evolution Event Validation');
  console.log(`Valid: ${result.valid}`);
  return result;
}};
