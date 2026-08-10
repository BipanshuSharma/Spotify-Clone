require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/db/db');

async function startServer() {
  try {
    await connectDB();
  } catch (error) {
    console.warn('Continuing without MongoDB connection for development.');
  }

  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
}

startServer();