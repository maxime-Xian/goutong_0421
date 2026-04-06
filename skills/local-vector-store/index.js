/**
 * local-vector-store - Maxime Loop-OS V3.0 优化版
 * 改进点：更好中文分词 + IDF + Cosine Similarity
 */

const fs = require('fs');
const path = require('path');

const STORE_PATH = path.join(process.cwd(), 'knowledge/knowledge-store.json');

let idfCache = null;  // 全局 IDF 缓存

function ensureStore() {
  const dir = path.dirname(STORE_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(STORE_PATH)) {
    fs.writeFileSync(STORE_PATH, JSON.stringify({ docs: [], meta: { created: Date.now(), version: '3.1' } }, null, 2));
  }
}

function tokenize(text) {
  if (!text) return [];
  text = text.toLowerCase();
  
  // 英文单词
  const english = (text.match(/[a-zA-Z0-9_]+/g) || []);
  
  // 中文：bigram (两个字符) + 单字符
  const chineseBigram = text.match(/[\u4e00-\u9fa5]{2}/g) || [];
  const chineseSingle = text.match(/[\u4e00-\u9fa5]/g) || [];
  
  const tokens = [...english, ...chineseBigram, ...chineseSingle];
  
  // 去重 + 过滤太短的
  return [...new Set(tokens)].filter(t => t.length > 0 && t !== ' ');
}

/** 计算全局 IDF */
function computeIDF(docs) {
  const N = docs.length;
  const df = {};
  docs.forEach(doc => {
    const uniqueTokens = new Set(doc.tokens || []);
    uniqueTokens.forEach(t => {
      df[t] = (df[t] || 0) + 1;
    });
  });
  const idf = {};
  for (const t in df) {
    idf[t] = Math.log((N + 1) / (df[t] + 1)) + 1;  // 平滑 IDF
  }
  return idf;
}

/** 计算向量范数（用于 cosine） */
function norm(tfidf) {
  let sum = 0;
  for (const val of Object.values(tfidf)) sum += val * val;
  return Math.sqrt(sum) || 1;
}

function getTFIDF(tokens, idf) {
  const tf = {};
  tokens.forEach(t => tf[t] = (tf[t] || 0) + 1);
  const total = tokens.length || 1;
  const tfidf = {};
  for (const t in tf) {
    if (idf[t]) {
      tfidf[t] = (tf[t] / total) * idf[t];
    }
  }
  return tfidf;
}

// ─────────────────────────────────────────────────────────────
// 公开 API
// ─────────────────────────────────────────────────────────────

function add(id, content, metadata = {}) {
  ensureStore();
  const data = JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
  
  const tokens = tokenize(content);
  const doc = {
    id,
    content,
    tokens,
    metadata: {
      type: metadata.type || 'unknown',
      tags: metadata.tags || [],
      year: metadata.year,
      risk_level: metadata.risk_level,
      category: metadata.category,
      source: metadata.source || 'L3',
      ...metadata
    },
    timestamp: Date.now()
  };

  const idx = data.docs.findIndex(d => d.id === id);
  if (idx !== -1) data.docs[idx] = doc;
  else data.docs.push(doc);

  // 更新 IDF 缓存
  idfCache = null;

  fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2));
  return doc;
}

function search(query, limit = 8, filters = {}) {
  ensureStore();
  const data = JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
  
  if (!idfCache) idfCache = computeIDF(data.docs);
  const idf = idfCache;

  const qTokens = tokenize(query);
  const qTFIDF = getTFIDF(qTokens, idf);
  const qNorm = norm(qTFIDF);

  let results = data.docs
    .filter(doc => {
      if (filters.type && doc.metadata.type !== filters.type) return false;
      if (filters.tags && filters.tags.length > 0) {
        const hasTag = filters.tags.some(tag => (doc.metadata.tags || []).includes(tag));
        if (!hasTag) return false;
      }
      if (filters.risk_level && doc.metadata.risk_level !== filters.risk_level) return false;
      if (filters.year && doc.metadata.year !== filters.year) return false;
      return true;
    })
    .map(doc => {
      const dTFIDF = getTFIDF(doc.tokens || [], idf);
      const dNorm = norm(dTFIDF);

      // Cosine Similarity
      let dot = 0;
      for (const term in qTFIDF) {
        if (dTFIDF[term]) dot += qTFIDF[term] * dTFIDF[term];
      }
      const score = (dot / (qNorm * dNorm)) || 0;

      return { 
        id: doc.id, 
        content: doc.content.substring(0, 200) + '...', 
        metadata: doc.metadata, 
        score,
        tokens: doc.tokens
      };
    })
    .filter(r => r.score > 0.05)  // 过滤低分
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return results;
}

function remove(id) {
  ensureStore();
  const data = JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
  const originalLength = data.docs.length;
  data.docs = data.docs.filter(d => d.id !== id);
  if (data.docs.length < originalLength) {
    idfCache = null;
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2));
    return true;
  }
  return false;
}

function stats() {
  ensureStore();
  const data = JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
  const byType = {};
  const byRisk = {};
  data.docs.forEach(doc => {
    const type = doc.metadata.type || 'unknown';
    byType[type] = (byType[type] || 0) + 1;
    if (doc.metadata.risk_level) {
      byRisk[doc.metadata.risk_level] = (byRisk[doc.metadata.risk_level] || 0) + 1;
    }
  });
  return {
    total: data.docs.length,
    byType,
    byRisk,
    storePath: STORE_PATH,
    version: data.meta?.version || '3.1'
  };
}

module.exports = { add, search, remove, stats, tokenize };
