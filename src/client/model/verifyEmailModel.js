import { pool } from '../../config/db.js';

export async function createTokenVerification(user_id, hashToken, expire_minutes = 60){
    const { rows } = await pool.query(
        `
            INSERT INTO email_verifications 
            (user_id, token_hash, expires_at)
            VALUES ($1, $2, NOW() + ($3 || ' minutes')::interval)
            RETURNING id, user_id, expires_at, used
        `,
        [user_id, hashToken, String(expire_minutes)]
    );
    return rows[0];
}

export async function consumeTokenVerification(hashToken) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const sel = await client.query(
      `SELECT * FROM email_verifications
       WHERE token_hash=$1 AND used=false AND expires_at>NOW()
       FOR UPDATE`,
      [hashToken]
    );
    const token = sel.rows[0];
    if (!token) { await client.query('ROLLBACK'); return null; }
    await client.query(`UPDATE email_verifications SET used=true WHERE id=$1`, [token.id]);
    await client.query('COMMIT');
    return token;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}