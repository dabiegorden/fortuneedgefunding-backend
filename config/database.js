const { Sequelize } = require('sequelize');
require('dotenv').config();

// Create Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME,     // Database name
  process.env.DB_USER,     // Username
  process.env.DB_PASS,     // Password
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    
    // Connection pool configuration
    pool: {
      max: 5,      // Maximum number of connection in pool
      min: 0,      // Minimum number of connection in pool
      acquire: 30000,  // Maximum time, in milliseconds, that pool will try to get connection before throwing error
      idle: 10000  // Maximum time, in milliseconds, that a connection can be idle before being released
    },

    // Optional: Additional configuration for production
    ...(process.env.NODE_ENV === 'production' && {
      dialectOptions: {
        ssl: {
          rejectUnauthorized: true
        }
      }
    }),

    // Timezone configuration
    timezone: '+00:00' // Set to UTC, adjust as needed
  }
);

// Test the database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

// Run connection test if not in test environment
if (process.env.NODE_ENV !== 'test') {
  testConnection();
}

module.exports = sequelize;