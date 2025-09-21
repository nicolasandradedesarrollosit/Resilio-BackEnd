import { pool } from '../../others/config/db.js';

export async function createTokenReset(user_id, token_hash, expires_minutes = 60){
    const { rows } = await pool.query(
        `INSERT INTO password_resets
        (user_id, token_hash, expires_at)
        VALUES ($1, $2, NOW() + ($3 || ' minutes')::interval)
        RETURNING id, user_id, expires_at, used`,
        [user_id, token_hash, expires_minutes]
    )
    return rows[0];
}

export async function consumeTokenReset(hashToken) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const sel = await client.query(
      `SELECT * FROM password_resets
       WHERE token_hash=$1 AND used=false AND expires_at>NOW()
       FOR UPDATE`,
      [hashToken]
    );
    const token = sel.rows[0];
    if (!token) { await client.query('ROLLBACK'); return null; }
    await client.query(`UPDATE password_resets SET used=true WHERE id=$1`, [token.id]);
    await client.query('COMMIT');
    return token;
  } 
  catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } 
  finally {
    client.release();
  }
}