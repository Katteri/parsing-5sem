import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';
import './scheduler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const taskScripts = {
  IbimaPublishing: path.resolve(__dirname, './parsing-scripts/ibima-script.js'),
  MDPI: path.resolve(__dirname, './parsing-scripts/mdpi-script.js'),
  Nature: path.resolve(__dirname, './parsing-scripts/nature-script.js'),
  ScienceDirect: path.resolve(__dirname, './parsing-scripts/sd-script.js'),
  Springer: path.resolve(__dirname, './parsing-scripts/springer-script.js'),
};

async function runTask(taskName) {
  return new Promise((resolve, reject) => {
    exec(`node ${taskScripts[taskName]}`, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`Execution error: ${stderr || error.message}`));
      } else {
        console.log(stdout);
        resolve(stdout);
      }
    });
  });
}

export default runTask;
