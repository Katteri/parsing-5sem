import { Service } from 'node-windows';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const svc = new Service({
  name: 'ArticleCollectionService',
  description: 'Service to run article collection tasks on schedule.',
  script: path.join(__dirname, 'index.js'),
});

svc.on('install', () => svc.start());
svc.install();
