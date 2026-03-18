/**
 * resource-profiler
 * System resource profiling tool.
 */

const os = require('os');

function getProfile() {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const memPercent = (usedMem / totalMem * 100).toFixed(2);
  
  const loadAvg = os.loadavg();
  const uptime = os.uptime();
  const uptimeDays = (uptime / 86400).toFixed(2);
  
  const processMem = process.memoryUsage();

  const summary = `### 📟 System Resource Profile\n\n` +
    `- **Memory Usage**: ${memPercent}% (${(usedMem / 1024 / 1024 / 1024).toFixed(2)} GB / ${(totalMem / 1024 / 1024 / 1024).toFixed(2)} GB)\n` +
    `- **CPU Load (1m, 5m, 15m)**: ${loadAvg.join(', ')}\n` +
    `- **System Uptime**: ${uptimeDays} days\n` +
    `- **Process Memory**: RSS ${(processMem.rss / 1024 / 1024).toFixed(2)} MB, Heap ${(processMem.heapUsed / 1024 / 1024).toFixed(2)} MB\n`;

  return {
    memory: { totalMem, freeMem, usedMem, memPercent },
    cpu: { loadAvg },
    uptime,
    process: processMem,
    summary
  };
}

module.exports = {
  getProfile,
  main: () => {
    const profile = getProfile();
    console.log(profile.summary);
    return profile;
  }
};
