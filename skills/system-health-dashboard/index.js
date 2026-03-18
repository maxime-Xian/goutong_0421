/**
 * system-health-dashboard
 * Unified health reporting.
 */

const fs = require('fs');
const path = require('path');

async function generateReport() {
  let report = "# 🏥 System Health Dashboard\n\n";
  report += "Generated on: " + new Date().toISOString() + "\n\n";

  // 1. Resource Profile
  try {
    const profiler = require('../resource-profiler');
    report += "## 📊 Resources\n";
    report += profiler.getProfile().summary + "\n";
  } catch (e) {
    report += "## 📊 Resources\n⚠️ resource-profiler not available.\n\n";
  }

  // 2. API Connectivity
  try {
    const guard = require('../api-connectivity-guard');
    const apiStatus = await guard.checkAll();
    report += "## 🌐 Connectivity\n";
    report += apiStatus.summary + "\n";
  } catch (e) {
    report += "## 🌐 Connectivity\n⚠️ api-connectivity-guard not available.\n\n";
  }

  // 3. Skills Status
  const overviewPath = path.join(process.cwd(), 'SKILLS_OVERVIEW.md');
  if (fs.existsSync(overviewPath)) {
    report += "## 🛠️ Skills Catalog\n";
    report += "Detailed list available in [SKILLS_OVERVIEW.md](./SKILLS_OVERVIEW.md)\n\n";
  }

  return report;
}

module.exports = {
  generateReport,
  main: async () => {
    console.log('Generating Dashboard...');
    const report = await generateReport();
    console.log(report);
    return report;
  }
};
