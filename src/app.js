// backend/src/app.js
const express = require('express');
const cors = require('cors');

const snakeRoutes = require('./routes/snakeRoutes');

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

// Health check 
app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/api/snake', snakeRoutes);

app.get('/', (req, res) => {
  res.send('GameHub backend is running');
});

module.exports = app;
