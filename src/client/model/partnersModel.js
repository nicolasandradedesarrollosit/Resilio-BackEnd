import { pool } from '../../config/db.js';

export async function getAllPartners() {
    try{
        const { rows } = await pool.query(
            `SELECT 
            id.benefits_business as id,
            name.business as name,
            description.benefit_description as description,
            discount.percentage as discount,
            q_of_codes.quantity as codes,
            business.image_url as route_jpg
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