const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./src/routes');
const initDb = require('./src/config/initDb');
const { PORT } = require('./src/config/constants');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '../client')));
app.use('/', routes);

app.listen(PORT, async () => {
  await initDb();
  console.log(`Server running on port ${PORT} 🔥`);
});
