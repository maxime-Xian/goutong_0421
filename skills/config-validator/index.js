const fs = require('fs');
const path = require('path');

function validate() {
  const results = [];
  const envPath = path.join(process.cwd(), '.env');
  const configPath = path.join(process.cwd(), 'openclaw.json');

  // 1. Check .env
  if (fs.existsSync(envPath)) {
    const env = fs.readFileSync(envPath, 'utf8');
    const requiredEnv = ['FEISHU_APP_ID', 'FEISHU_APP_SECRET', 'OPENCLAW_MASTER_ID'];
    requiredEnv.forEach(key => {
      const exists = new RegExp(`^${key}=`, 'm').test(env);
      results.push({ target: '.env', key, status: exists ? '✅' : '❌' });
    });
  } else {
    results.push({ target: '.env', key: 'FILE', status: '❌ MISSING' });
  }

  // 2. Check openclaw.json
  if (fs.existsSync(configPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      const keys = ['botToken', 'channel'];
      keys.forEach(key => {
        results.push({ target: 'openclaw.json', key, status: config[key] ? '✅' : '⚠️ EMPTY' });
      });
    } catch (e) {
      results.push({ target: 'openclaw.json', key: 'JSON', status: '❌ INVALID' });
    }
  }

  const summary = results.map(r => `[${r.target}] ${r.key}: ${r.status}`).join('\n');
  return { results, summary };
}

module.exports = { validate, main: () => {
  console.log('Validating configuration...');
  const { summary } = validate();
  console.log(summary);
  return summary;
}};
