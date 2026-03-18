const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

async function extractFrames(videoPath, intervalSeconds, outputDir) {
  if (!videoPath || !intervalSeconds || !outputDir) {
    console.error("Error: All parameters (videoPath, intervalSeconds, outputDir) are required.");
    return;
  }

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const command = `ffmpeg -i "${videoPath}" -vf "fps=1/${intervalSeconds}" "${outputDir}/frame-%03d.png"`;

  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject(error);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`); // ffmpeg often outputs progress to stderr
      resolve(`Frames extracted to ${outputDir}`);
    });
  });
}

module.exports = {
  extractFrames
};