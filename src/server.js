// server.js
import 'dotenv/config';
import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;

// 1) Connection string
const CS = process.env.URL_DB || process.env.DATABASE_URL;
if (!CS) {
  console.error('❌ Falta URL_DB o DATABASE_URL en las envs');
  process.exit(1);
}
console.log('DB URL (masked):', CS.replace(/\/\/.*?:.*?@/, '//****:****@'));

// 2) Pool PG con SSL
export const pool = new Pool({
  connectionString: CS,
  ssl: { rejectUnauthorized: false },
  keepAlive: true,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// 3) Ping de DB
async function probarConexion() {
  const { rows } = await pool.query('SELECT NOW() ahora');
  console.log('✅ DB OK:', rows[0].ahora);
}

// 4) App Express
const app = express();
app.use(express.json());

app.get('/salud/db', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT NOW() ahora');
    res.json({ ok: true, ahora: rows[0].ahora });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// 5) Listen correcto (PORT numérico, HOST string)
const PORT = Number(process.env.PORT) || 4000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, async () => {
  try { await probarConexion(); } catch (e) { console.error('❌ DB FAIL:', e.message); }
  console.log(`API escuchando en http://${HOST}:${PORT}`);
});
