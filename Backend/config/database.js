const pgPromise = require('pg-promise');
const dotenv = require('dotenv');

dotenv.config();

// PostgreSQL Connection Options
const initOptions = {
  // Initialization options
};

const pgp = pgPromise(initOptions);

// Database connection configuration
const cn = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'digious_crm',
  user: process.env.DB_USER || 'digious_user',
  password: process.env.DB_PASSWORD || 'digious123',
};

// Create database instance
const db = pgp(cn);

// Test the connection
db.connect()
  .then(obj => {
    console.log('✓ Database connection successful');
    obj.done(); // release the connection
  })
  .catch(error => {
    console.error('✗ Database connection error:', error.message);
    process.exit(1);
  });

module.exports = db;
