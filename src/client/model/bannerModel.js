import { pool } from '../../others/config/db.js';

export async function sendDataBanner() {
    try {
            const { rows } = await pool.query(
                `SELECT * FROM top_banner
                ORDER BY created_at DESC
                LIMIT 1`
            );
        return rows[0] || null;
    } catch (error) {
        console.error("Database error in sendDataBanner:", error);
        throw error;
    }
}
