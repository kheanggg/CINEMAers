import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DATABASE_HOST,
  port: 5432,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  ssl: {
    rejectUnauthorized: false, // Allow self-signed certificates
  },
});

export const query = async (text: string, params?: any[]) => {
  return pool.query(text, params);
};
