const fs = require('fs');
const path = require('path');

function validateCapsule(capsule) {
  const required = ['type', 'id', 'schema_version', 'trigger', 'gene', 'summary', 'confidence'];
  const missing = required.filter(f => !capsule[f]);
  return { valid: missing.length === 0, missing };
}

module.exports = { validateCapsule, main: () => {
  const testCapsule = { type: 'Capsule', id: 'test_001', schema_version: '1.5.0', trigger: ['test'], gene: 'test_gene', summary: 'test', confidence: 0.95 };
  const result = validateCapsule(testCapsule);
  console.log('### 🔬 Capsule Validation');
  console.log(`Valid: ${result.valid}`);
  return result;
}};
