import { pool } from '../../config/db.js';

export async function getAllPartners(userId = null) {
    try{
        // Si hay userId, devolver solo beneficios NO canjeados
        if (userId) {
            const { rows } = await pool.query(
                `SELECT
                    bb.id AS id,
                    bb.name AS name,
                    b.name AS business_name,
                    b.location AS location,
                    bb.category_id AS category_id,
                    bb.discount AS discount,
                    bb.q_of_codes AS codes,
                    b.url_image_business AS route_jpg,
                    false AS is_redeemed
                FROM benefits_business bb
                INNER JOIN business b ON bb.id_business_discount = b.id
                LEFT JOIN benefits_redeemed br ON bb.id = br.id_benefit AND br.id_user = $1
                WHERE br.id IS NULL
                ORDER BY bb.id DESC;`,
                [userId]
            );
            return rows;
        }
        
        // Sin userId, devolver todos los beneficios
        const { rows } = await pool.query(
            `SELECT
                benefits_business.id AS id,
                benefits_business.name AS name,
                business.name AS business_name,
                business.location AS location,
                benefits_business.category_id AS category_id,
                benefits_business.discount AS discount,
                benefits_business.q_of_codes AS codes,
                business.url_image_business AS route_jpg,
                false AS is_redeemed
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