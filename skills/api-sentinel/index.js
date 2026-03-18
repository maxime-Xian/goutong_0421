/**
 * api-sentinel
 * Actionable error and update reporting.
 */

const REMEDIATIONS = {
  "User location is not supported": "MiniMax API is regionally restricted in your area. Solution: Switch to a provider available in China (e.g., Kimi, DeepSeek) or use a global proxy.",
  "Integration key missing (FEISHU_APP_ID)": "Feishu credentials are not set. Solution: Add FEISHU_APP_ID and FEISHU_APP_SECRET to your ~/.openclaw/.env file.",
  "API Error: invalid param": "API authentication failed. Solution: Verify your FEISHU_APP_ID and FEISHU_APP_SECRET are correct and the app is published.",
  "Network request for 'sendMessage' failed": "Connectivity issue with Telegram. Solution: Check your network or verify the botToken in openclaw.json."
};

function analyze(text) {
  const needsNotification = text.includes('❌') || text.includes('⚠️') || text.includes('🆕') || text.includes('LLM error');
  let remediations = [];

  for (const [error, fix] of Object.entries(REMEDIATIONS)) {
    if (text.includes(error)) {
      remediations.push(`- **Problem**: ${error}\n  **Fix**: ${fix}`);
    }
  }

  let message = '';
  if (needsNotification) {
    message = `## 🛰️ API Sentinel Report\n\n${text}\n\n`;
    if (remediations.length > 0) {
      message += `### 💡 Suggested Actions:\n${remediations.join('\n')}\n`;
    }
  }

  return {
    needsNotification,
    message,
    foundRemediations: remediations.length > 0
  };
}

module.exports = {
  analyze,
  main: () => {
    const testInput = "❌ Error: User location is not supported for the API use.";
    const result = analyze(testInput);
    console.log(JSON.stringify(result, null, 2));
    return result;
  }
};
