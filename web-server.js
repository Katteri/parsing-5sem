import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(cors());

const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Error connecting to the database', err);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

app.get('/api/articles', (req, res) => {
  const query = 'SELECT heading, date FROM Articles';

  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

export const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname)));

app.get('/api/data', (req, res) => {
  res.json({ message: "Data from server" });
});