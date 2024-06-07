import { createPool } from 'mysql2';

const pool = createPool({
  host: process.env.DATABASE_HOST!,
  user: process.env.DATABASE_USER!,
  password: process.env.DATABASE_PASSWORD!,
  database: process.env.DATABASE_NAME!,
  port: parseInt(process.env.DATABASE_PORT!)
});

pool.getConnection((error, connection) => {
  if (error) {
    console.error('Error connecting to db:', error);
    return;
  }
  console.log('Connected to db');
  connection.release();
});

const executeQuery = (query: string, params: any) => {
  return new Promise((resolve, reject) => {
    pool.query(query, params, (error, results) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(results);
    });
  })
}

export default executeQuery;