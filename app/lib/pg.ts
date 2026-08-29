import { Pool } from 'pg';

let pool: Pool;

if (process.env.NODE_ENV === 'production') {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  // Prevent multiple connection instances during Next.js Hot Module Reloading
  const globalWithPg = globalThis as unknown as { _pgPool?: Pool };
  if (!globalWithPg._pgPool) {
    globalWithPg._pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }
  pool = globalWithPg._pgPool;
}

export const query = (text: string, params?: any[]) => pool.query(text, params);
export default pool;