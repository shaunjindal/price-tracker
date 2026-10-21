const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();
app.set('trust proxy', 1); // behind Render's proxy
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ status: 'ok', service: 'price-tracker-api' }));
app.use('/api', routes);

// 404
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
});

module.exports = app;
