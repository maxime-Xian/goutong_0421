/**
 * agent-reach-advisor
 * Specialized logic for agent-reach lifecycle and reporting.
 */

const UPGRADE_COMMAND = "pip install --upgrade https://github.com/Panniantong/agent-reach/archive/main.zip";

function analyze(output) {
  const hasIssues = output.includes('❌') || output.includes('⚠️');
  const hasUpdates = output.includes('🆕') || output.toLowerCase().includes('new version available');
  
  let recommendations = [];
  
  if (hasUpdates) {
    recommendations.push(`🆕 **New version detected!**\nTo upgrade agent-reach, run:\n\`${UPGRADE_COMMAND}\``);
  }
  
  if (output.includes('❌')) {
    recommendations.push("❌ **Critical failure detected in one or more channels.**\nCheck your credentials and API connectivity for the failing platforms.");
  }
  
  if (output.includes('⚠️')) {
    recommendations.push("⚠️ **Warnings found.**\nSome channels may be degraded. Review the specific channel logs for details.");
  }

  const message = recommendations.length > 0 
    ? `### 🕵️ agent-reach Analysis\n\n${recommendations.join('\n\n')}`
    : "✅ agent-reach check passed with no issues.";

  return {
    hasIssues,
    hasUpdates,
    message,
    upgradeCommand: UPGRADE_COMMAND
  };
}

module.exports = {
  analyze,
  main: () => {
    const mockOutput = "👁️ Agent Reach Check\n📦 Version: v1.2.0\n🆕 v1.3.0 available\n⚠️ Reddit channel timeout\n❌ LinkedIn session expired";
    const result = analyze(mockOutput);
    console.log(JSON.stringify(result, null, 2));
    return result;
  }
};
