import {pool} from '../../config/db.js';

export async function getMyBenefits(idUser) {
    try {
        const { rows } = await pool.query(`
            SELECT 
                users.id AS user_id,
                benefits_business.id AS id,
                benefits_business.name AS name,
                business.name AS business_name,
                business.location AS location,
                benefits_business.category_id AS category_id,
                benefits_business.discount AS discount,
                benefits_business.q_of_codes AS codes,
                business.url_image_business AS route_jpg,
                benefits_redeemed.code AS redeemed_code,
                benefits_redeemed.created_at AS redeemed_at
            FROM users 
            INNER JOIN benefits_redeemed ON users.id = benefits_redeemed.id_user
            INNER JOIN benefits_business ON benefits_redeemed.id_benefit = benefits_business.id
            INNER JOIN business ON benefits_business.id_business_discount = business.id
            WHERE users.id = $1
            ORDER BY benefits_redeemed.created_at DESC;
        `, [idUser]);
        return rows;
    }
    catch (err) {
        throw err;
    }
}

export async function postMyBenefits ({ idBenefit, idUser, code }) {
    try {
        const { rows } = await pool.query(`
            INSERT INTO benefits_redeemed (id_benefit, id_user, code)
            VALUES ($1, $2, $3)
            RETURNING *;
        `, [idBenefit, idUser, code]);
        return rows[0];
    }
    catch (err) {
        throw err;
    }
}