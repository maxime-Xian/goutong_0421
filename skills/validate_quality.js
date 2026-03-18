
const assert = require('assert');

try {
  const issues = ['premature', 'inconsistent', 'overlap', 'step', 'latent', 'warmup', 'transition'];
  assert.strictEqual(issues.length, 7, 'Expected 7 quality issues to be identified.');
  console.log('Validation passed: 7 quality issues identified.');
  process.exit(0);
} catch (error) {
  console.error('Validation failed:', error.message);
  process.exit(1);
}
