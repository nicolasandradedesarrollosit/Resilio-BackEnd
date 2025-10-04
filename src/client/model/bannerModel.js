import { pool } from '../../others/config/db.js';

export async function sendDataBanner (){
    const { rows } = await pool.query(
        `SELECT * FROM top_banner
        LIMIT 1`);
        return rows[0]; 
}
