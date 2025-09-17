import { pool } from '../../others/config/db.js';
import bcrypt from 'bcryptjs';

export async function modelRegister({ name, email, password }) {
  if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
    throw new Error('Credenciales inválidas');
  }
  if (!name.trim() || !email.trim() || !password.trim()) {
    throw new Error('Los campos no pueden estar vacíos');
  }
  if (password.length < 8) {
    throw new Error('La cantidad de caracteres de la contraseña debe ser mayor a 8');
  }
  if (email.length > 255 || password.length > 72) {
    throw new Error('Credenciales demasiado largas');
  }

  const emailNormalizado = email.toLowerCase();
  const saltRounds = Number(process.env.SALT_ROUNDS ?? 12);
  const hash = await bcrypt.hash(password, saltRounds);

  const sql = `
    INSERT INTO client (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING id, name, email, created_at
  `;
  const params = [name, emailNormalizado, hash];

  try {
    const { rows } = await pool.query(sql, params);
    return rows[0];
  } catch (err) {
    if (err.code === '23505') {
      const e = new Error('Correo ya registrado');
      e.code = 'EMAIL_DUP';
      throw e;
    }
    throw err;
  }
}
