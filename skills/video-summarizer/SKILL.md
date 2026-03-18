---
name: video-summarizer
description: A tool that uses ffmpeg to extract frames from video files at specified intervals, enabling agents to analyze the visual content using image-based models. Use when you need to 'watch' or summarize a video without human intervention.
---

### Usage:

The `video-summarizer` skill allows you to extract keyframes from a video at specified intervals. This is useful for visual analysis by image models, or for creating summaries of video content.

#### `extractFrames(videoPath, intervalSeconds, outputDir)`

Extracts frames from a video at a given interval.

- `videoPath`: (string, required) The path to the input video file.
- `intervalSeconds`: (number, required) The interval in seconds at which to extract frames.
- `outputDir`: (string, required) The directory where the extracted frames will be saved.

Example:
```
print(default_api.exec(command="node -e 'require(\"./skills/video-summarizer\").extractFrames(\"input.mp4\", 5, \"output_frames\")'"))
```