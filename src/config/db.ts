import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

export const pool = new Pool({  // Change this to named export
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

export const testConnection = async (): Promise<boolean> => {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    console.log('✅ Database connected');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed');
    return false;
  }
};

// Remove the default export since we're using named exports