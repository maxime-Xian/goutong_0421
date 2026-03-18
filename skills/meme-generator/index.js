/**
 * meme-generator
 * Overlays text on images to create memes.
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const FONT_PATH = '/System/Library/Fonts/ArialHB.ttc';

function createMeme(imagePath, topText = '', bottomText = '', outputName = null) {
  if (!fs.existsSync(imagePath)) {
    return { success: false, error: 'Source image does not exist.' };
  }

  const fileName = path.basename(imagePath, path.extname(imagePath));
  const finalOutputName = outputName || `meme_${fileName}_${Date.now()}.jpg`;
  const outputDir = path.join(__dirname, 'assets');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const outputPath = path.join(outputDir, finalOutputName);

  try {
    // Helper to escape text for ffmpeg drawtext filter
    const esc = (t) => t.replace(/'/g, "\\'").replace(/:/g, "\\:");
    
    // Construct ffmpeg filters
    // top text: x centered, y=20
    // bottom text: x centered, y=h-text_h-20
    const filter = [
      `drawtext=fontfile='${FONT_PATH}':text='${esc(topText)}':fontsize=48:fontcolor=white:borderw=3:bordercolor=black:x=(w-text_w)/2:y=20`,
      `drawtext=fontfile='${FONT_PATH}':text='${esc(bottomText)}':fontsize=48:fontcolor=white:borderw=3:bordercolor=black:x=(w-text_w)/2:y=h-text_h-20`
    ].join(',');

    const command = `ffmpeg -i "${imagePath}" -vf "${filter}" "${outputPath}" -y`;
    execSync(command, { stdio: 'ignore' });

    return {
      success: true,
      path: outputPath,
      name: finalOutputName
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  createMeme,
  main: () => {
    console.log('Testing meme-generator...');
    // Create a dummy image for testing
    const testBase = path.join(__dirname, 'assets', 'test_base.jpg');
    try {
      execSync(`ffmpeg -f lavfi -i color=c=blue:s=640x480:d=1 -vframes 1 "${testBase}" -y`, { stdio: 'ignore' });
      
      const result = createMeme(testBase, 'HELLO', 'WORLD');
      console.log('Result:', JSON.stringify(result, null, 2));
      
      // Cleanup
      if (fs.existsSync(testBase)) fs.unlinkSync(testBase);
      if (result.success && fs.existsSync(result.path)) fs.unlinkSync(result.path);
      
      return result;
    } catch (e) {
      console.error('Test failed:', e.message);
      return { success: false, error: e.message };
    }
  }
};
