// database.config.ts
export default {
  client: 'pg',
  connection: {
    host : process.env.DB_HOST || 'localhost',
    port : process.env.DB_POST || 5432,
    database: process.env.DB_NAME || 'secureAPI',
    user:     process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || ''
  }
};