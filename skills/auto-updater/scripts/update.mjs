#!/usr/bin/env node
/**
 * Auto-Updater Script
 * 自动更新所有已安装的 skills
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const WORKSPACE_DIR = join(__dirname, '..', '..', '..');

console.log('🔧 OpenClaw Skills Auto-Updater');
console.log('================================');
console.log(`📁 Workspace: ${WORKSPACE_DIR}`);
console.log(`🕐 Started: ${new Date().toLocaleString('zh-CN')}`);
console.log('');

// 检查 clawhub 是否可用
try {
  execSync('which clawhub', { stdio: 'ignore' });
} catch {
  console.error('❌ Error: clawhub CLI 未安装');
  console.log('   请运行: npm i -g clawhub');
  process.exit(1);
}

// 列出当前 skills
console.log('📋 当前已安装的 Skills:');
try {
  const listOutput = execSync('clawhub list', { 
    cwd: WORKSPACE_DIR, 
    encoding: 'utf8',
    timeout: 30000 
  });
  console.log(listOutput || '   (暂无通过 clawhub 安装的 skills)');
} catch (e) {
  console.log('   无法获取列表，继续更新...');
}

console.log('');
console.log('🔄 开始更新所有 Skills...');
console.log('');

try {
  // 执行更新
  const updateOutput = execSync('clawhub update --all --no-input', { 
    cwd: WORKSPACE_DIR, 
    encoding: 'utf8',
    timeout: 120000,
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  console.log('✅ 更新完成！');
  console.log('');
  console.log('📤 输出:');
  console.log(updateOutput || '   所有 skills 已是最新版本');
  
} catch (error) {
  if (error.status === 1 && error.message?.includes('Rate limit')) {
    console.log('⏳ 遇到 API 速率限制，请稍后再试');
  } else {
    console.log('⚠️ 更新过程中出现问题:');
    console.log(error.stderr || error.message || '未知错误');
  }
}

console.log('');
console.log(`✨ 完成时间: ${new Date().toLocaleString('zh-CN')}`);
