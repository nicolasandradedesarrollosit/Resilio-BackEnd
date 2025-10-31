import { pool } from '../../config/db.js';

export async function getAllPartners() {
    try{
        const { rows } = await pool.query(
            `SELECT
                benefits_business.id AS id,
                benefits_business.name AS name,
                business.name AS business_name,
                business.location AS location,
                benefits_business.category_id AS category_id,
                benefits_business.discount AS discount,
                benefits_business.q_of_codes AS codes,
                business.url_image_business AS route_jpg
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