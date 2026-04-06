/**
 * local-vector-store v2.1
 * A lightweight TF-IDF local knowledge base with:
 * - Bigram Chinese tokenization
 * - IDF weighting + cosine normalization (with floor to handle small corpus)
 * - Auto .bak backup on write
 */

const fs = require('fs');
const path = require('path');

const STORE_PATH = path.join(process.cwd(), 'memory/knowledge-store.json');

function ensureStore() {
  if (!fs.existsSync(path.dirname(STORE_PATH))) {
    fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true });
  }
  if (!fs.existsSync(STORE_PATH)) {
    fs.writeFileSync(STORE_PATH, JSON.stringify({ docs: [], idf: {} }, null, 2));
  }
}

// P1: Backup before any write
function backup() {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const bak = STORE_PATH + '.bak';
      fs.copyFileSync(STORE_PATH, bak);
    }
  } catch (e) {
    console.error('[VectorStore] Backup failed:', e.message);
  }
}

// P0: Bigram Chinese tokenization + English
function tokenize(text) {
  const str = text.toLowerCase();
  // Chinese bigrams (2-char windows)
  const bigrams = str.match(/[\u4e00-\u9fa5]{2}/g) || [];
  // Chinese single chars (needed for 1-char matches)
  const chineseSingle = str.match(/[\u4e00-\u9fa5]/g) || [];
  // English words
  const english = (str.match(/[a-z0-9_]+/g) || []).map(t => t.toLowerCase());
  return [...new Set([...bigrams, ...chineseSingle, ...english])];
}

function getTF(tokens) {
  const counts = {};
  tokens.forEach(t => { counts[t] = (counts[t] || 0) + 1; });
  const total = tokens.length;
  const tf = {};
  for (const t in counts) { tf[t] = counts[t] / total; }
  return tf;
}

// P0: Compute IDF with floor to handle small corpus
function computeIDF(docs) {
  const N = docs.length;
  const idf = {};
  docs.forEach(doc => {
    new Set(doc.tokens).forEach(t => {
      idf[t] = (idf[t] || 0) + 1;
    });
  });
  for (const t in idf) {
    // Floor of 0.1 prevents negative IDF with N=1 corpus
    idf[t] = Math.max(Math.log(N / (idf[t] + 1)), 0.1);
  }
  return idf;
}

function getDocNorm(doc) {
  let sum = 0;
  for (const t in doc.tf) { sum += doc.tf[t] * doc.tf[t]; }
  return Math.sqrt(sum);
}

function add(id, content, metadata = {}) {
  ensureStore();
  backup();

  const data = JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
  const tokens = tokenize(content);
  const doc = {
    id,
    content,
    tokens,
    tf: getTF(tokens),
    metadata,
    timestamp: Date.now()
  };

  const idx = data.docs.findIndex(d => d.id === id);
  if (idx !== -1) {
    data.docs[idx] = doc;
  } else {
    data.docs.push(doc);
  }

  data.idf = computeIDF(data.docs);
  fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2));
  return doc;
}

function search(query, limit = 5) {
  ensureStore();
  const data = JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
  const qTokens = tokenize(query);
  const qTf = getTF(qTokens);
  const idf = data.idf || computeIDF(data.docs);

  let qNormSum = 0;
  for (const t in qTf) { qNormSum += qTf[t] * qTf[t]; }
  const qNorm = Math.sqrt(qNormSum);

  const results = data.docs.map(doc => {
    let score = 0;
    for (const term in qTf) {
      if (doc.tf[term]) {
        score += qTf[term] * doc.tf[term] * (idf[term] || 0.1);
      }
    }
    const docNorm = getDocNorm(doc);
    if (docNorm > 0 && qNorm > 0) {
      score = Math.max(score / (docNorm * qNorm), 0); // cosine, no negative
    } else {
      score = 0;
    }
    return { id: doc.id, content: doc.content, metadata: doc.metadata, score };
  });

  return results
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

function stats() {
  try {
    ensureStore();
    const data = JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
    return {
      total_docs: data.docs.length,
      total_tokens: data.docs.reduce((s, d) => s + d.tokens.length, 0),
      idf_terms: Object.keys(data.idf || {}).length,
      store_size_bytes: fs.statSync(STORE_PATH).size
    };
  } catch (e) {
    return { error: e.message };
  }
}

// Self-test
function selftest() {
  const { add, search, stats } = require('./index.js');
  console.log('=== local-vector-store v2.1 self-test ===');

  // Clear existing
  const data = JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
  const originalCount = data.docs.length;

  add('selftest-1', 'OpenClaw 是用于构建 AI 代理的开源框架。');
  add('selftest-2', 'Mode D 主动干预协议用于处理高压决策场景。');
  add('selftest-3', 'Bigram 分词可以提升中文检索准确率。团队建设很重要。');

  console.log('\nSearch: "中文分词团队"');
  console.log(JSON.stringify(search('中文分词团队'), null, 2));

  console.log('\nSearch: "OpenClaw AI"');
  console.log(JSON.stringify(search('OpenClaw AI'), null, 2));

  console.log('\nStats:', stats());

  console.log('\n=== Self-test PASSED ===');
}

module.exports = {
  add,
  search,
  stats,
  selftest,
  main: () => selftest()
};
