---
name: local-vector-store
description: A lightweight local knowledge store that provides simple indexing and retrieval using TF-IDF similarity. Use when you need to store and search through small to medium sets of documents without external dependencies.
---

# local-vector-store

A simple local knowledge base for semantic-like retrieval.

## Usage

```javascript
const store = require('./skills/local-vector-store');

// Add documents
store.add('doc1', 'OpenClaw is an open agent platform.');
store.add('doc2', 'GEP stands for Genome Evolution Protocol.');

// Search
const results = store.search('what is GEP?');
console.log(results);
```

## Features
- Indexing of text documents.
- Basic TF-IDF similarity scoring for retrieval.
- Local persistence in `memory/knowledge-store.json`.
