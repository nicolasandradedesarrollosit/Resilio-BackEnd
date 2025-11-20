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
                benefits_redeemed.created_at AS redeemed_at,
                true AS is_redeemed
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

export async function checkBenefitAlreadyRedeemed({ idBenefit, idUser }) {
    try {
        const { rows } = await pool.query(`
            SELECT id FROM benefits_redeemed
            WHERE id_benefit = $1 AND id_user = $2
            LIMIT 1;
        `, [idBenefit, idUser]);
        return rows.length > 0;
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

// Obtener todos los beneficios con indicador de si están canjeados por el usuario
export async function getAllBenefitsWithRedeemedStatus(idUser) {
    try {
        const { rows } = await pool.query(`
            SELECT 
                bb.id,
                bb.name,
                b.name AS business_name,
                b.location,
                bb.category_id,
                bb.discount,
                bb.q_of_codes AS codes,
                b.url_image_business AS route_jpg,
                CASE 
                    WHEN br.id IS NOT NULL THEN true 
                    ELSE false 
                END AS is_redeemed,
                br.code AS redeemed_code,
                br.created_at AS redeemed_at
            FROM benefits_business bb
            INNER JOIN business b ON bb.id_business_discount = b.id
            LEFT JOIN benefits_redeemed br ON bb.id = br.id_benefit AND br.id_user = $1
            ORDER BY bb.id DESC;
        `, [idUser]);
        return rows;
    }
    catch (err) {
        throw err;
    }
}