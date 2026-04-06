#!/usr/bin/env node
/**
 * Auto-Updater Script (Robust Edition)
 * 自动且鲁棒地更新所有已安装的 skills，跳过单个故障点。
 */

import { execSync } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const WORKSPACE_DIR = join(__dirname, '..', '..', '..');

console.log('🔧 OpenClaw Skills Auto-Updater (Robust)');
console.log('=========================================');
console.log(`📁 Workspace: ${WORKSPACE_DIR}`);
console.log(`🕐 Started: ${new Date().toLocaleString('zh-CN')}`);
console.log('');

// 1. 检查 clawhub
try {
  execSync('which clawhub', { stdio: 'ignore' });
} catch {
  console.error('❌ Error: clawhub CLI 未安装');
  console.log('   请运行: npm i -g clawhub');
  process.exit(1);
}

// 2. 获取已安装的 skills 列表
let skills = [];
try {
  const listOutput = execSync('clawhub list', { 
    cwd: WORKSPACE_DIR, 
    encoding: 'utf8',
    timeout: 30000 
  });
  skills = listOutput
    .split('\n')
    .map(line => line.trim().split(/\s+/)[0])
    .filter(name => name && name.length > 0);
  
  console.log(`📋 发现 ${skills.length} 个已安装的 skills。`);
} catch (e) {
  console.error('❌ Error: 无法获取已安装列表，停止更新。');
  process.exit(1);
}

console.log('');
console.log('🔄 开始逐个更新...');
console.log('');

let successCount = 0;
let failCount = 0;
let skippedCount = 0;

for (const skill of skills) {
  process.stdout.write(`👉 Updating ${skill.padEnd(25)}... `);
  try {
    const updateOutput = execSync(`clawhub update ${skill} --no-input`, { 
      cwd: WORKSPACE_DIR, 
      encoding: 'utf8',
      timeout: 60000,
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    if (updateOutput.includes('Already up to date')) {
      console.log('✅ [Latest]');
      skippedCount++;
    } else {
      console.log('✅ [Updated]');
      successCount++;
    }
  } catch (error) {
    const stderr = error.stderr || error.message || '';
    if (stderr.includes('Skill not found')) {
      console.log('❌ [Not Found on Remote]');
      failCount++;
    } else if (stderr.includes('Rate limit')) {
      console.log('⏳ [Rate Limited]');
      failCount++;
      console.log('   (建议 5 分钟后再试)');
      break; // 频率限制通常是全局的
    } else {
      console.log('❌ [Failed]');
      failCount++;
      // console.error(`   Debug: ${stderr.trim().split('\n')[0]}`);
    }
  }
}

console.log('');
console.log('=========================================');
console.log(`✅ 更新完成！`);
console.log(`📈 统计: 成功 ${successCount} | 跳过 ${skippedCount} | 失败 ${failCount}`);
console.log(`✨ 完成时间: ${new Date().toLocaleString('zh-CN')}`);
