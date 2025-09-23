import { pool } from '../../others/config/db.js';

export async function createUser({ name, province, city, phone_number, email, hash }){
    const { rows }= await pool.query(
        `INSERT INTO users (name, province, city, phone_number, email, password_hash)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, name, email, phone_number, email_verified, token_version, created_at, role`,
        [name, province, city, phone_number, email, hash]
    )
    return rows[0];
}

export async function findOneByEmail(email) {
    const {rows} = await pool.query(`
            SELECT * FROM users 
            WHERE email = $1
            LIMIT 1`,
            [email]
    );
    return rows[0] || null;
}

export async function findOneById(user_id){
    const {rows} = await pool.query(`
            SELECT * FROM users 
            WHERE id = $1
            LIMIT 1`,
            [user_id]
    );
    return rows[0] || null;
}

export async function patchVerifiedEmail(user_id){
    await pool.query(
        `
            UPDATE users SET email_verified = true, updated_at = NOW()
            WHERE ID = $1
        `,
        [user_id]
    );
}

export async function updatePassword(user_id, new_hash){
    await pool.query(
        `
            UPDATE users SET password_hash = $1, updated_at = NOW()
            WHERE id = $2
        `,
        [new_hash, user_id]
    );
}

export async function increaseTokenVersion(userId) {
  await pool.query(`UPDATE users SET token_version = token_version + 1 WHERE id=$1`, [userId]);
}