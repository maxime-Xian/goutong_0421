---
name: meme-generator
description: A tool for creating memes. It overlays top and bottom text onto a base image using ffmpeg. Use this when you want to create visual content for social engagement or emphasis.
---

# meme-generator

This skill allows the agent to create memes by adding text overlays to images.

## Usage

```javascript
const memeGen = require('./skills/meme-generator');
const result = memeGen.createMeme('/path/to/base.jpg', 'TOP TEXT', 'BOTTOM TEXT');
if (result.success) {
  // result.path is the path to the generated meme
}
```

## Features
- Overlays top and bottom text.
- Automatically handles text escaping for ffmpeg.
- Stores generated memes in `skills/meme-generator/assets/`.
