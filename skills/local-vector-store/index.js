/**
 * local-vector-store
 * A lightweight TF-IDF-like local knowledge base.
 */

const fs = require('fs');
const path = require('path');

const STORE_PATH = path.join(process.cwd(), 'memory/knowledge-store.json');

function ensureStore() {
  if (!fs.existsSync(path.dirname(STORE_PATH))) {
    fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true });
  }
  if (!fs.existsSync(STORE_PATH)) {
    fs.writeFileSync(STORE_PATH, JSON.stringify({ docs: [] }, null, 2));
  }
}

function tokenize(text) {
  return text.toLowerCase().match(/\w+/g) || [];
}

function getTF(tokens) {
  const counts = {};
  tokens.forEach(t => { counts[t] = (counts[t] || 0) + 1; });
  const total = tokens.length;
  const tf = {};
  for (const t in counts) { tf[t] = counts[t] / total; }
  return tf;
}

function add(id, content, metadata = {}) {
  ensureStore();
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
  // Replace if exists
  const idx = data.docs.findIndex(d => d.id === id);
  if (idx !== -1) {
    data.docs[idx] = doc;
  } else {
    data.docs.push(doc);
  }
  fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2));
  return doc;
}

function search(query, limit = 5) {
  ensureStore();
  const data = JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
  const qTokens = tokenize(query);
  const qTf = getTF(qTokens);

  const results = data.docs.map(doc => {
    let score = 0;
    for (const term in qTf) {
      if (doc.tf[term]) {
        score += qTf[term] * doc.tf[term]; // Basic cosine-like similarity (numerator only)
      }
    }
    return { id: doc.id, content: doc.content, metadata: doc.metadata, score };
  });

  return results
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

module.exports = {
  add,
  search,
  main: () => {
    console.log('Testing local-vector-store...');
    add('test-1', 'OpenClaw is an open-source framework for building AI agents.');
    add('test-2', 'GEP protocol is used for genome evolution of agents.');
    add('test-3', 'The weather is nice today.');
    
    const results = search('How does OpenClaw help build agents?');
    console.log('Search Results for "OpenClaw build agents":');
    console.log(JSON.stringify(results, null, 2));
    
    return results;
  }
};
