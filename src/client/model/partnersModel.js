import { pool } from '../../config/db.js';

export async function getAllPartners() {
    try{
        const { rows } = await pool.query(
            `SELECT 
            benefits_business.id as id,
            business.name as name,
            business.location as location,
            benefits_business.discount as discount,
            benefits_business.q_of_codes as codes,
            business.url_image_business as route_jpg
            FROM benefits_business
            INNER JOIN business ON benefits_business.id_business_discount = business.id
            ORDER BY benefits_business.id DESC;`
        );
        return rows;
    }
    catch (error) {
        throw error;
    }
}