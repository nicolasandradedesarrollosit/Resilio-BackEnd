import { pool } from '../../others/config/db.js';

export async function getAllEvents() {
    try{
        const { rows } = await pool.query(
            `SELECT * FROM events
            ORDER BY date DESC`
        );
    return rows;
    }
    catch (error) {
        console.error('Error fetching events:', error);
        throw error;
    }
}