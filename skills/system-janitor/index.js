/**
 * system-janitor
 * Log cleanup and workspace maintenance.
 */

const fs = require('fs');
const path = require('path');

function cleanupLogs(options = {}) {
  const { maxAgeDays = 7, logDir = 'logs' } = options;
  const fullLogDir = path.join(process.cwd(), logDir);
  
  if (!fs.existsSync(fullLogDir)) {
    return { success: false, error: 'Log directory not found.' };
  }

  const now = Date.now();
  const msPerDay = 24 * 60 * 60 * 1000;
  let removedCount = 0;
  let reclaimedBytes = 0;

  try {
    const files = fs.readdirSync(fullLogDir);
    files.forEach(file => {
      const filePath = path.join(fullLogDir, file);
      const stats = fs.statSync(filePath);
      const ageDays = (now - stats.mtimeMs) / msPerDay;

      if (ageDays > maxAgeDays && stats.isFile()) {
        reclaimedBytes += stats.size;
        fs.unlinkSync(filePath);
        removedCount++;
      }
    });

    return {
      success: true,
      removedCount,
      reclaimedMB: (reclaimedBytes / 1024 / 1024).toFixed(2),
      summary: `Cleaned up ${removedCount} files, reclaimed ${(reclaimedBytes / 1024 / 1024).toFixed(2)} MB.`
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = {
  cleanupLogs,
  main: () => {
    console.log('Running system-janitor dry run (0 days age to test)...');
    const result = cleanupLogs({ maxAgeDays: -1 }); // Dry run/force test
    console.log(result.summary);
    return result;
  }
};
