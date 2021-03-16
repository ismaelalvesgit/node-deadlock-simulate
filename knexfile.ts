import dotenv from 'dotenv'
dotenv.config()

/**
 * @type {import('knex').Config}
 */
module.exports = {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    bigNumberStrings: true,
  },
  pool: {
    min: parseInt(process.env.DB_POOL_MIN || '2'),
    max: parseInt(process.env.DB_POOL_MAX || '300')
  },
  debug: true,
  migrations: {
    tableName: 'migrations',
  },
  options:{
    deadlockRetries: 50,
    deadlockRetryDelay: 50000
  }
};