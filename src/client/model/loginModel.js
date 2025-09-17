import { pool } from '../../others/config/db.js';
import bcrypt from 'bcryptjs';

export async function modelVerifyCredentials({ email, password }) {
  if (typeof email !== 'string' || typeof password !== 'string') {
    throw new Error('Credenciales inválidas');
  }
  if (!email.trim() || !password.trim()) {
    throw new Error('Credenciales inválidas');
  }
  if (password.length < 8) {
    throw new Error('Credenciales inválidas');
  }
  if (email.length > 255 || password.length > 72) {
    throw new Error('Credenciales inválidas');
  }

  const emailNormalized = email.toLowerCase();
  const user = await findOneByEmail({ email: emailNormalized });
  if (!user) throw new Error('Credenciales inválidas');

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error('Credenciales inválidas');

  const { password: _omit, ...safeUser } = user;
  return safeUser;
}

async function findOneByEmail({ email }) {
  const params = [email];
  const sql = `
    SELECT id, name, email, password, is_influencer, plan_type
    FROM client
    WHERE email = $1
    LIMIT 1
  `;
  const { rows } = await pool.query(sql, params);
  return rows[0];
}