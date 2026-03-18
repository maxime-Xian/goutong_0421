---
name: tavily
description: AI-optimized web search via Tavily API. Returns concise, relevant results for AI agents.
---

# Tavily Search

AI-optimized web search via Tavily API.

## Setup

Set `TAVILY_API_KEY` environment variable.

## Usage

```bash
# Search
node scripts/search.mjs "your query" -n 5

# Extract content from URLs
node scripts/extract.mjs "https://example.com"
```

## Options

- `-n 5` - Number of results (1-20)
- `--deep` - Advanced search depth
- `--topic news` - Search news
- `--days 7` - News from last N days
```