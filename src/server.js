import 'dotenv/config';
import pkg from 'pg';
const { Pool } = pkg;

const CS = process.env.URL_DB || process.env.DATABASE_URL;
console.log('DB URL (masked):', CS ? CS.replace(/\/\/.*?:.*?@/,'//****:****@') : 'undefined');

export const pool = new Pool({
  connectionString: CS,
  ssl: { rejectUnauthorized: false },  
  keepAlive: true,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
});

export async function probarConexion() {
  const { rows } = await pool.query('SELECT NOW() ahora');
  console.log('DB OK:', rows[0].ahora);
}

import express from 'express';
import { probarConexion, pool } from './config/db.js';

const app = express();
app.get('/salud/db', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT 1 AS ok');
    res.json({ ok: true, db: rows[0].ok });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.listen(PORT, async () => {
  try { await probarConexion(); } catch(e) { console.error('DB FAIL:', e.message); }
  console.log('API en :', PORT);
});

import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';

const PORT = Number(process.env.PORT || '0.0.0.0');
app.listen(PORT, () => console.log(`Servidor siendo escuchado en el puerto ${PORT}`));
