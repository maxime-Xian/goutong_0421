
const fs = require('fs');
const path = require('path');

const MEMORY_DIR = path.join(__dirname, '../../memory');
const LOGS_ARCHIVE_DIR = path.join(__dirname, '../../logs/archive');
const KNOWLEDGE_DIR = path.join(__dirname, '../../knowledge');
const GUARDIAN_MEMORY_DIR = path.join(__dirname, '../../memory/guardian');

// Ensure directories exist
[LOGS_ARCHIVE_DIR, KNOWLEDGE_DIR, GUARDIAN_MEMORY_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

function getFilesInDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
        return [];
    }
    return fs.readdirSync(dirPath).map(file => path.join(dirPath, file));
}

function isOlderThan30Days(filePath) {
    const stats = fs.statSync(filePath);
    const mtime = new Date(stats.mtime);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return mtime < thirtyDaysAgo;
}

function extractGene(content) {
    // A very basic example of gene extraction: looking for keywords
    // This part would need significant AI/NLP enhancement for real-world use
    const genes = [];
    if (content.includes('决策')) genes.push('决策：' + content.split('决策')[1].split('\\n')[0].trim());
    if (content.includes('规则')) genes.push('规则：' + content.split('规则')[1].split('\\n')[0].trim());
    if (content.includes('反省')) genes.push('反省：' + content.split('反省')[1].split('\\n')[0].trim());
    return genes.join('\\n');
}

function consolidateMemory() {
    const memoryFiles = getFilesInDirectory(MEMORY_DIR);
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const consolidationReportPath = path.join(KNOWLEDGE_DIR, `consolidation-report-${currentMonth}.md`);
    let reportContent = `# 🧠 记忆固化报告 - ${currentMonth}\n\n`;
    reportContent += `## 处理时间: ${new Date().toISOString()}\n\n`;
    reportContent += `## 💡 提炼的智慧基因 (Layer 2 Gene Pool)\n\n`;

    let genePoolContent = '';
    const genePoolPath = path.join(GUARDIAN_MEMORY_DIR, 'gene_pool.md');
    if (fs.existsSync(genePoolPath)) {
        genePoolContent = fs.readFileSync(genePoolPath, 'utf8');
    }

    reportContent += `## 📁 归档的一次性事实记录 (Layer 4 Archive)\n\n`;

    for (const filePath of memoryFiles) {
        if (!filePath.endsWith('.md') || !isOlderThan30Days(filePath)) {
            continue;
        }

        const fileName = path.basename(filePath);
        const content = fs.readFileSync(filePath, 'utf8');
        const extractedGenes = extractGene(content);

        if (extractedGenes) {
            reportContent += `- 从 \`${fileName}\` 提炼出基因：\\n${extractedGenes.split('\\n').map(g => `  - ${g}`).join('\\n')}\\n`;
            genePoolContent += `### From ${fileName} (${new Date().toISOString()})\\n${extractedGenes}\\n\\n`;
        } else {
            // Assume it's an "one-time fact record" if no specific genes extracted
            reportContent += `- 归档文件：\`${fileName}\` (无明显基因提炼)\\n`;
            fs.renameSync(filePath, path.join(LOGS_ARCHIVE_DIR, fileName));
        }
    }

    fs.writeFileSync(genePoolPath, genePoolContent);
    fs.writeFileSync(consolidationReportPath, reportContent);

    console.log(`记忆固化完成！报告已生成于: ${consolidationReportPath}`);
    console.log(`智慧基因池已更新: ${genePoolPath}`);
}

consolidateMemory();
