import { pool } from '../../config/db.js';

export async function getAllEvents() {
    try{
        const { rows } = await pool.query(
            `SELECT * FROM events
            ORDER BY date DESC`
        );
    return rows;
    }
    catch (error) {
        throw error;
    }
}