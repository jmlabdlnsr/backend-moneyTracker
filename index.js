const express = require('express');
const cors = require('cors');
const path = require('path');
const initializeDatabase = require('./src/dbInit');
const seedDefaultCategories = require('./src/seed');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Expense Tracker API' });
});

// Start server and initialize DB
async function startServer() {
  await initializeDatabase();
  await seedDefaultCategories();
  
  // Routes will be added here
  app.use('/api/auth', require('./src/routes/authRoutes'));
  app.use('/api/categories', require('./src/routes/categoryRoutes'));
  app.use('/api/transactions', require('./src/routes/transactionRoutes'));
  app.use('/api/summary', require('./src/routes/summaryRoutes'));

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();
