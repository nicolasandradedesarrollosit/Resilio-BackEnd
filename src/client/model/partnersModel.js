import { pool } from '../../others/config/db.js';

export async function getAllPartners() {
    try{
    const [rows] = await pool.query(
        `SELECT * FROM benefits_business
        ORDER BY name ASC`
    );
    return rows;
    }
    catch (error) {
        console.error('Error fetching partners:', error);
        throw error;
    }
}