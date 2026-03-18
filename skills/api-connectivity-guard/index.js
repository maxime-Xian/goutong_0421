/**
 * api-connectivity-guard
 * Proactive API connectivity testing.
 */

const ENDPOINTS = [
  { name: 'OpenAI', url: 'https://api.openai.com/v1/models' },
  { name: 'Anthropic', url: 'https://api.anthropic.com/v1/complete' },
  { name: 'Google AI', url: 'https://generativelanguage.googleapis.com' },
  { name: 'MiniMax', url: 'https://api.minimax.chat/v1/text_experience' },
  { name: 'Feishu', url: 'https://open.feishu.cn/open-apis/auth/v3/app_access_token/internal' },
  { name: 'Telegram', url: 'https://api.telegram.org' }
];

async function checkEndpoint(endpoint) {
  const start = Date.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(endpoint.url, { 
      method: 'GET',
      signal: controller.signal 
    });
    clearTimeout(timeoutId);
    
    const duration = Date.now() - start;
    return {
      name: endpoint.name,
      status: response.status,
      ok: response.status < 500, // Even 401/403 means it's reachable
      duration
    };
  } catch (error) {
    return {
      name: endpoint.name,
      status: 'error',
      ok: false,
      error: error.name === 'AbortError' ? 'Timeout' : error.message
    };
  }
}

async function checkAll() {
  const results = await Promise.all(ENDPOINTS.map(checkEndpoint));
  let summary = '### 🌐 API Connectivity Report\n\n';
  
  results.forEach(res => {
    const icon = res.ok ? '✅' : '❌';
    summary += `- ${icon} **${res.name}**: status ${res.status}${res.error ? ` (${res.error})` : ''} [${res.duration || 0}ms]\n`;
  });
  
  const failures = results.filter(r => !r.ok);
  if (failures.length > 0) {
    summary += '\n⚠️ **Issues Detected**: Some endpoints are unreachable. This might be due to regional blocks or network issues.';
  } else {
    summary += '\n✨ All tested endpoints are reachable.';
  }

  return { results, summary };
}

module.exports = {
  checkAll,
  main: async () => {
    console.log('Running API connectivity checks...');
    const report = await checkAll();
    console.log(report.summary);
    return report;
  }
};
