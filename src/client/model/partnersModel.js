import { pool } from '../../config/db.js';

export async function getAllPartners() {
    try{
    const { rows } = await pool.query(
        `SELECT * FROM benefits_business
        ORDER BY name ASC`
    );
    return rows;
    }
    catch (error) {
        throw error;
    }
}