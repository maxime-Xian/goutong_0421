#!/usr/bin/env node

/**
 * Gene Extractor - 智慧基因自动提取模块
 * 从 memory/*.md 文件中提取结构化智慧基因，写入 knowledge/patterns/判断类/，并自动更新索引。
 *
 * 版本: v1.0 | 日期: 2026-03-30
 * 维护者: Guardian (vC)
 *
 * Usage:
 *   node extract.js [--dry-run] [--all] [--date=YYYY-MM-DD] [--verbose]
 */

const fs = require('fs');
const path = require('path');
const https = require('https'); // For making HTTP requests

// --- Configuration ---
const WORKSPACE_DIR = process.env.OPENCLAW_WORKSPACE || path.join(process.env.HOME, '.openclaw/workspace');
const MEMORY_DIR = path.join(WORKSPACE_DIR, 'memory');
const KNOWLEDGE_PATTERNS_DIR = path.join(WORKSPACE_DIR, 'knowledge', 'patterns', '判断类');
const CASE_INDEX_FILE = path.join(MEMORY_DIR, 'case_index.md');
const GENE_SCHEMA_FILE = path.join(__dirname, 'gene_schema.json');

const EXCLUDE_MEMORY_FILES = ['learning_protocol.md', 'case_index.md', 'episodes']; // Exclude these from being processed as raw memory
const DAYS_TO_PROCESS = 7; // Default: process last 7 days of memory files
const KIMI_REQUEST_TIMEOUT_MS = 180000;
const KIMI_MAX_RETRIES = 2;

// ============================================================
// Kimi / Moonshot 配置
// ============================================================
const MOONSHOT_CONFIG = {
    baseUrl: 'https://api.moonshot.cn/v1',
    model: 'kimi-k2.5',
    apiKey: ''
};

// ============================================================
// 从 openclaw.json 读取 Kimi 运行配置
// ============================================================
function getMoonshotRuntimeConfig() {
    try {
        const configPath = path.join(process.env.HOME, '.openclaw/openclaw.json');
        if (fs.existsSync(configPath)) {
            const cfg = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            const provider = cfg?.models?.providers?.moonshot || {};
            const baseUrl = typeof provider.baseUrl === 'string' && provider.baseUrl.trim()
                ? provider.baseUrl.trim().replace(/\/+$/, '')
                : MOONSHOT_CONFIG.baseUrl;
            const model = provider?.model || provider?.models?.[0]?.id || MOONSHOT_CONFIG.model;

            return {
                baseUrl,
                model,
                apiKey: provider?.apiKey || ''
            };
        }
    } catch (e) {
        console.error('Error reading Moonshot config from openclaw.json:', e.message);
    }
    return { ...MOONSHOT_CONFIG };
}

// --- Utilities ---
function parseArgs() {
    const args = {};
    process.argv.slice(2).forEach(arg => {
        if (arg.startsWith('--')) {
            const [key, value] = arg.slice(2).split('=');
            args[key] = value || true;
        }
    });
    return args;
}

const args = parseArgs();
const DRY_RUN = args['dry-run'];
const PROCESS_ALL = args['all'];
const SPECIFIC_DATE = args['date'];
const SPECIFIC_FILE = args['file'];
const VERBOSE = args['verbose'];

function log(...messages) {
    if (VERBOSE) {
        console.log('[GENE EXTRACTOR]', ...messages);
    }
}

function ensureDirExists(dirPath) {
    fs.mkdirSync(dirPath, { recursive: true });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function collectMemoryFilesRecursive(dirPath) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    const files = [];

    for (const entry of entries) {
        if (entry.name.startsWith('.')) continue;
        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
            if (entry.name === 'episodes') continue;
            files.push(...collectMemoryFilesRecursive(fullPath));
            continue;
        }

        if (!entry.isFile()) continue;
        if (!entry.name.endsWith('.md')) continue;
        if (EXCLUDE_MEMORY_FILES.includes(entry.name)) continue;
        files.push(fullPath);
    }

    return files;
}

function normalizeMoonshotErrorMessage(parsed, raw) {
    return parsed?.error?.message
        || parsed?.error?.type
        || parsed?.base_resp?.status_msg
        || raw.trim();
}

function isMoonshotBillingIssue(statusCode, parsed, raw) {
    const message = normalizeMoonshotErrorMessage(parsed, raw).toLowerCase();
    return statusCode === 402
        || message.includes('insufficient')
        || message.includes('balance')
        || message.includes('billing')
        || message.includes('quota')
        || message.includes('recharge')
        || message.includes('欠费')
        || message.includes('余额')
        || message.includes('充值');
}

function emitMoonshotBillingAlert(statusCode, parsed, raw) {
    const message = normalizeMoonshotErrorMessage(parsed, raw);
    console.error('Kimi 账户可能欠费、余额不足或额度不可用，请先检查 Moonshot 平台账单/余额。');
    if (statusCode) {
        console.error(`Kimi HTTP 状态: ${statusCode}`);
    }
    if (message) {
        console.error(`Kimi 账单告警详情: ${message}`);
    }
}

function extractMoonshotTextContent(choiceContent) {
    if (typeof choiceContent === 'string') {
        return choiceContent;
    }
    if (Array.isArray(choiceContent)) {
        return choiceContent
            .map((part) => {
                if (typeof part === 'string') return part;
                if (part?.type === 'text') return part.text || '';
                return '';
            })
            .join('');
    }
    return '';
}

function stripMarkdownCodeFence(text) {
    const trimmed = text.trim();
    const fencedMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
    return fencedMatch ? fencedMatch[1].trim() : trimmed;
}

function findBalancedJsonArray(text) {
    let start = -1;
    let depth = 0;
    let inString = false;
    let escaped = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];

        if (inString) {
            if (escaped) {
                escaped = false;
                continue;
            }
            if (char === '\\') {
                escaped = true;
                continue;
            }
            if (char === '"') {
                inString = false;
            }
            continue;
        }

        if (char === '"') {
            inString = true;
            continue;
        }

        if (char === '[') {
            if (start === -1) {
                start = i;
            }
            depth += 1;
            continue;
        }

        if (char === ']') {
            if (depth > 0) {
                depth -= 1;
                if (depth === 0 && start !== -1) {
                    return text.slice(start, i + 1);
                }
            }
        }
    }

    return start !== -1 ? text.slice(start).trim() : text.trim();
}

function escapeControlCharsInsideJsonStrings(text) {
    let result = '';
    let inString = false;
    let escaped = false;

    for (const char of text) {
        if (inString) {
            if (escaped) {
                result += char;
                escaped = false;
                continue;
            }
            if (char === '\\') {
                result += char;
                escaped = true;
                continue;
            }
            if (char === '"') {
                result += char;
                inString = false;
                continue;
            }
            if (char === '\n') {
                result += '\\n';
                continue;
            }
            if (char === '\r') {
                result += '\\r';
                continue;
            }
            if (char === '\t') {
                result += '\\t';
                continue;
            }
            result += char;
            continue;
        }

        if (char === '"') {
            inString = true;
        }
        result += char;
    }

    return result;
}

function removeTrailingCommas(text) {
    return text.replace(/,\s*([}\]])/g, '$1');
}

function normalizeJsonCandidate(text) {
    return removeTrailingCommas(
        escapeControlCharsInsideJsonStrings(
            findBalancedJsonArray(
                stripMarkdownCodeFence(text)
            )
        )
    ).trim();
}

function parseGenesResponse(text) {
    const candidates = [
        text.trim(),
        stripMarkdownCodeFence(text),
        findBalancedJsonArray(stripMarkdownCodeFence(text)),
        normalizeJsonCandidate(text)
    ];

    let lastError = null;
    for (const candidate of candidates) {
        if (!candidate) continue;
        try {
            const parsed = JSON.parse(candidate);
            if (Array.isArray(parsed)) {
                return parsed;
            }
            if (Array.isArray(parsed?.genes)) {
                return parsed.genes;
            }
        } catch (error) {
            lastError = error;
        }
    }

    throw lastError || new Error('Kimi did not return a valid JSON array.');
}

// ============================================================
// 调用 Kimi / Moonshot
// ============================================================
async function callKimi(systemPrompt, userContent) {
    const runtimeConfig = getMoonshotRuntimeConfig();
    const apiKey = runtimeConfig.apiKey;
    if (!apiKey) {
        console.error('Kimi API Key 未配置');
        return { text: null, retryable: false };
    }

    const body = {
        model: runtimeConfig.model,
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userContent }
        ],
        temperature: 1,
        max_tokens: 8192,
    };

    return new Promise((resolve, reject) => {
        const data = JSON.stringify(body);
        const urlObj = new URL(`${runtimeConfig.baseUrl}/chat/completions`);
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port || 443,
            path: urlObj.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data),
                'Authorization': `Bearer ${apiKey}`,
            }
        };

        const req = https.request(options, (res) => {
            let raw = '';
            res.on('data', chunk => raw += chunk);
            res.on('end', () => {
                let parsed = null;
                if (raw.trim()) {
                    try {
                        parsed = JSON.parse(raw);
                    } catch {
                        parsed = null;
                    }
                }

                if (res.statusCode && res.statusCode >= 400) {
                    console.error(`Kimi HTTP error: ${res.statusCode} ${res.statusMessage || ''}`.trim());
                    const retryable = res.statusCode === 429
                        || normalizeMoonshotErrorMessage(parsed, raw).toLowerCase().includes('overloaded');
                    if (isMoonshotBillingIssue(res.statusCode, parsed, raw)) {
                        emitMoonshotBillingAlert(res.statusCode, parsed, raw);
                    }
                    if (raw.trim()) {
                        console.error('Kimi raw response:', raw.slice(0, 1200));
                    }
                    resolve({ text: null, retryable });
                    return;
                }

                try {
                    const response = parsed || JSON.parse(raw);
                    if (response.error || response.base_resp?.status_code) {
                        if (isMoonshotBillingIssue(res.statusCode, response, raw)) {
                            emitMoonshotBillingAlert(res.statusCode, response, raw);
                        } else {
                            console.error('Kimi API error:', normalizeMoonshotErrorMessage(response, raw));
                        }
                        resolve({
                            text: null,
                            retryable: normalizeMoonshotErrorMessage(response, raw).toLowerCase().includes('overloaded')
                        });
                        return;
                    }

                    const text = extractMoonshotTextContent(
                        response?.choices?.[0]?.message?.content
                    );
                    if (!text) {
                        console.error('Kimi returned no text content.');
                        if (raw.trim()) {
                            console.error('Kimi raw response:', raw.slice(0, 1200));
                        }
                        resolve({
                            text: null,
                            retryable: Boolean(response?.choices?.[0]?.message?.reasoning_content)
                        });
                        return;
                    }
                    resolve({ text, retryable: false });
                } catch (e) {
                    console.error('解析失败:', e.message);
                    if (raw.trim()) {
                        console.error('Kimi raw response:', raw.slice(0, 1200));
                    }
                    resolve({ text: null, retryable: false });
                }
            });
        });

        req.on('error', (e) => {
            console.error('请求失败:', e.message);
            reject(e);
        });

        req.setTimeout(KIMI_REQUEST_TIMEOUT_MS, () => {
            req.destroy(new Error(`Kimi request timeout after ${KIMI_REQUEST_TIMEOUT_MS / 1000}s`));
        });

        req.write(data);
        req.end();
    });
}

// --- Gene Extraction Logic ---
async function extractGenesFromFile(filePath) {
    log(`Processing file: ${filePath}`);
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);

    // Skip processing if content is too short to be meaningful
    if (content.trim().length < 100) { // arbitrary threshold
        log(`Skipping ${fileName}: content too short.`);
        return [];
    }

    const systemPrompt = [
        `你是 Guardian 的元认知进化引擎。从以下记忆片段中提取「智慧基因」—— 可复用的认知模式。智慧基因是 Guardian 过去经历中提炼出的可复用认知模式。`,
        `要求：`,
        `1. 只提取有明确教训、决策、规则、反省或模式的内容，跳过单纯的事实记录、问候语或重复信息。`,
        `2. 每条基因的核心内容（content）长度应在 50 到 300 字之间。`,
        `3. 用中文输出。`,
        `4. 标注类型：`,
        `   - "DEC" (决策): 重要选择的背景、理由、结果。`,
        `   - "RUL" (规则): 工作原则、方法论、行动指南。`,
        `   - "REF" (反省): 对错误的复盘、教训、内化。`,
        `   - "PAT" (模式): 重复出现的问题/趋势/解决方案。`,
        `5. 给每条基因打质量分（0.0-1.0之间，精确到小数点后一位）。`,
        `6. 提供简短标题（title），不超过30字。`,
        `7. 提供原始上下文摘要（context），不超过200字，帮助理解基因来源。`,
        `8. 提供适用场景描述（applicability），不超过100字。`,
        `9. 提供 Guardian 的自我备注或反思（guardian_note），不超过150字。`,
        // Corrected lines: ensure backticks are correctly escaped for the JS string, but not over-escaped.
        `- \`source_file\` 字段填写原始记忆文件的相对路径，例如 \`memory/2026-03-30.md\`。`,
        `- \`extracted_at\` 字段填写当前提取的ISO 8601时间戳。`,
        `- \`id\` 字段格式为 \`gene_YYYYMMDD_NNN\`，其中 NNN 是该文件内基因的顺序编号，例如 \`gene_20260330_001\`。`,
        `13. \`tags\` 字段为数组，包含 #开头的标签。`,
        `14. 严格遵循 JSON 数组格式输出，不要包含任何额外文字或 markdown 格式，直接是 \`[ { ... }, { ... } ]\`。`,
        `请严格参考以下 JSON Schema 进行输出：`,
        `${fs.readFileSync(GENE_SCHEMA_FILE, 'utf8')}`
    ].join('\n');

    const userContent = [
        `以下是记忆片段：`,
        `---`,
        `文件: ${fileName}`,
        `内容:`,
        `${content}`,
        `---`
    ].join('\n');

    let llmResponseText = null;

    for (let attempt = 0; attempt <= KIMI_MAX_RETRIES; attempt++) {
        try {
            const result = await callKimi(systemPrompt, userContent);
            llmResponseText = result?.text || null;

            if (!llmResponseText) {
                if (!result?.retryable || attempt === KIMI_MAX_RETRIES) {
                    console.error(`Kimi API returned no text for ${fileName}.`);
                    return [];
                }
                const waitMs = (attempt + 1) * 15000;
                console.error(`Kimi retrying ${fileName} in ${waitMs / 1000}s...`);
                await sleep(waitMs);
                continue;
            }

            const genes = parseGenesResponse(llmResponseText);
            log(`Extracted ${genes.length} genes from ${fileName}`);
            return genes;
        } catch (error) {
            console.error(`Error extracting genes from ${fileName}:`, error);
            if (llmResponseText) {
                console.error('Kimi text response preview:', llmResponseText.slice(0, 2000));
            }
            if (attempt === KIMI_MAX_RETRIES) {
                return [];
            }
            const waitMs = (attempt + 1) * 15000;
            console.error(`Kimi retrying ${fileName} after parse failure in ${waitMs / 1000}s...`);
            await sleep(waitMs);
        }
    }

    return [];
}

function generateGeneFileName() {
    const today = new Date().toISOString().split('T')[0];
    return `YYYY-MM-DD_gene.md`.replace('YYYY-MM-DD', today);
}

function formatGeneAsMarkdown(gene) {
    const extractedAt = gene.extracted_at || new Date().toISOString(); // Fallback if missing
    const tags = gene.tags ? gene.tags.join(' ') : '';
    const guardianNote = gene.guardian_note ? `**Guardian 备注**:${gene.guardian_note}` : '';

    return `
---

gene_${gene.id} ${gene.category === 'DEC' ? '🔵 决策' : gene.category === 'RUL' ? '🟢 规则' : gene.category === 'REF' ? '🟡 反省' : gene.category === 'PAT' ? '🟣 模式' : '⚪ 未知'}

**${gene.title}**

${gene.content}

> 上下文：${gene.context}

**适用场景**: ${gene.applicability}
**标签**: ${tags}
**来源**: ${gene.source_file}
**提取时间**: ${extractedAt}
**质量评分**: ${gene.quality_score}
${guardianNote}
`.trim();
}

async function updateCaseIndex(genes) {
    const today = new Date().toISOString().split('T')[0];
    const newEntries = genes.map(gene => {
        const tags = gene.tags ? gene.tags.map(tag => tag.replace('#', '')).join(', ') : '';
        return `| ${gene.id} | ${gene.source_file} | ${gene.title} | ${tags} |`;
    }).join('\n');
    const updatedIndex = [
        '案例索引 (Case Index)',
        '',
        `> Last updated: ${today}`,
        '',
        '| Gene ID | 来源文件 | 标题/摘要 | 标签 |',
        '|---|---|---|---|',
        newEntries
    ].join('\n');

    if (DRY_RUN) {
        log('[DRY RUN] Would update case_index.md with:\n', newEntries);
    } else {
        fs.writeFileSync(CASE_INDEX_FILE, updatedIndex, 'utf8');
        log(`Updated ${CASE_INDEX_FILE}`);
    }
}


async function main() {
    log('Gene Extractor started.');
    ensureDirExists(KNOWLEDGE_PATTERNS_DIR);

    const allMemoryFiles = collectMemoryFilesRecursive(MEMORY_DIR);

    let filesToProcess = [];
    if (SPECIFIC_FILE) {
        const requestedPath = path.isAbsolute(SPECIFIC_FILE)
            ? SPECIFIC_FILE
            : path.join(MEMORY_DIR, SPECIFIC_FILE);
        filesToProcess = fs.existsSync(requestedPath) ? [requestedPath] : [];
    } else if (PROCESS_ALL) {
        filesToProcess = allMemoryFiles;
    } else if (SPECIFIC_DATE) {
        filesToProcess = allMemoryFiles.filter(f => path.basename(f).startsWith(SPECIFIC_DATE));
    } else {
        // Default: process recent files
        const today = new Date();
        filesToProcess = allMemoryFiles.filter(f => {
            const fileName = path.basename(f);
            const dateMatch = fileName.match(/(\d{4}-\d{2}-\d{2})/);
            if (dateMatch) {
                const fileDate = new Date(dateMatch[1]);
                const diffTime = Math.abs(today - fileDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays <= DAYS_TO_PROCESS;
            }
            return false;
        });
    }

    if (DRY_RUN) {
        console.log('[DRY RUN] 以下文件将被处理:');
        filesToProcess.forEach(f => console.log(` - ${path.basename(f)}`));
        return;
    }

    if (filesToProcess.length === 0) {
        console.log('没有找到可处理的记忆文件。');
        return;
    }

    let allExtractedGenes = [];
    let globalGeneCounter = 1;
    for (const filePath of filesToProcess) {
        const genes = await extractGenesFromFile(filePath);
        allExtractedGenes = allExtractedGenes.concat(genes.map((gene, index) => ({
            ...gene,
            id: `${new Date().toISOString().split('T')[0].replace(/-/g, '')}_${String(globalGeneCounter++).padStart(3, '0')}`,
            source_file: path.relative(WORKSPACE_DIR, filePath),
            extracted_at: new Date().toISOString(),
        })));
    }

    if (allExtractedGenes.length === 0) {
        console.log('没有提取到任何智慧基因。');
        return;
    }

    const geneFileName = generateGeneFileName();
    const geneFilePath = path.join(KNOWLEDGE_PATTERNS_DIR, geneFileName);

    let geneFileContent = `智慧基因提取 - ${new Date().toISOString().split('T')[0]}\n\n> 自动提取 | 共 ${allExtractedGenes.length} 条 | 来源: memory/*.md\n\n`;
    for (const gene of allExtractedGenes) {
        geneFileContent += formatGeneAsMarkdown(gene) + '\n';
    }
    geneFileContent += `---\n\n_由 Gene Extractor 自动提取 | ${new Date().toISOString()}_`;


    fs.writeFileSync(geneFilePath, geneFileContent, 'utf8');
    log(`Genes written to ${geneFilePath}`);

    await updateCaseIndex(allExtractedGenes);

    console.log(`✅ 基因提取完成`);
    console.log(`📅 日期: ${new Date().toISOString().split('T')[0]}`);
    console.log(`📁 来源文件: ${filesToProcess.length} 个`);
    console.log(`🧬 提取基因: ${allExtractedGenes.length} 条`);
    allExtractedGenes.forEach(gene => {
        const categorySymbol = gene.category === 'DEC' ? '🔵' : gene.category === 'RUL' ? '🟢' : gene.category === 'REF' ? '🟡' : gene.category === 'PAT' ? '🟣' : '⚪';
        console.log(` - gene_${gene.id} ${categorySymbol} ${gene.category} ${gene.title}`);
    });
}

main().catch(console.error);
