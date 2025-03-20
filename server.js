const express = require('express');
const cors = require('cors');
const path = require("path");
require('dotenv').config();

const sequelize = require('./config/database');
const Routes = require('./routes/routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', Routes);

const PORT = process.env.PORT || 5000;
console.log(PORT);

(async () => {
  try {
    await sequelize.sync(); // Sync database models
    console.log('✅ Database synced...');
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  } catch (error) {
    console.error('❌ Error starting server:', error);
  }
})();
