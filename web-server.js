import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import sequelize from './database.js';
import Article from './models/Article.js';

export const PORT = 3000;

const app = express();
app.use(cors());

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');
  } catch (error) {
    console.error('Database connection error', error);
  }
})();

app.get('/api/articles', async (req, res) => {
  try {
    const articles = await Article.findAll({
      attributes: ['heading', 'date'],
    });
    res.json(articles);
  } catch (error) {
    console.error('Fetching articles error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname)));

app.get('/api/articles', (req, res) => {
  res.json({ message: "Data from server" });
});
