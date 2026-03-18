const fs = require('fs');
const path = require('path');

function validateMutation(mutation) {
  const required = ['type', 'id', 'category', 'trigger_signals', 'target', 'expected_effect', 'risk_level', 'rationale'];
  const missing = required.filter(f => !mutation[f]);
  return { valid: missing.length === 0, missing };
}

module.exports = { validateMutation, main: () => {
  const testMutation = { type: 'Mutation', id: 'mut_test', category: 'innovate', trigger_signals: ['test'], target: 'test', expected_effect: 'test', risk_level: 'low', rationale: 'test' };
  const result = validateMutation(testMutation);
  console.log('### 🔬 Mutation Validation');
  console.log(`Valid: ${result.valid}`);
  return result;
}};
