import { pool } from '../../others/config/db.js';

export async function getUserModelLimit(limit, offset) {
    const { rows } = await pool.query(`
        SELECT * FROM users
        ORDER BY id DESC 
        LIMIT $1 OFFSET $2`, 
        [limit, offset]);
    return rows;    
}