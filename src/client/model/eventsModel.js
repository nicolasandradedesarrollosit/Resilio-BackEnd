import { pool } from '../../others/config/db.js';

export async function getAllEvents() {
    const { rows } = await pool.query(
        `SELECT * FROM events
        ORDER BY event_date DESC`
    )
    return rows;
}