import { pool } from '../../config/db.js';

export async function getBenefitModel(limit, offset) {
    const { rows } = await pool.query(`
        SELECT * FROM benefits
        ORDER BY id DESC
        LIMIT $1 OFFSET $2
    `, [limit, offset]);
    return rows;
}

export async function createBenefitModel(benefitData) {
    const { name, q_of_codes, discount, id_business_discount } = benefitData;
    const { rows } = await pool.query(
        `
        INSERT INTO benefits (name, q_of_codes, discount, id_business_discount, created_at)
        VALUES ($1, $2, $3, $4, NOW())
        RETURNING *
        `,
        [name, q_of_codes, discount, id_business_discount]
    );

    return rows[0];
}

export async function updateBenefitModel(benefitId, fieldsToUpdate) {
    const allowedFields = ['name', 'q_of_codes', 'discount', 'id_business_discount'];
    const fields = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(fieldsToUpdate)) {
        if (allowedFields.includes(key)) {
            fields.push(`${key} = $${paramIndex}`);
            values.push(value);
            paramIndex++;
        }
    }

    if (fields.length === 0) {
        const { rows } = await pool.query(`SELECT * FROM benefits WHERE id = $1`, [benefitId]);
        return rows[0] || null;
    }

    const query = `UPDATE benefits
        SET ${fields.join(',\n        ')}
        WHERE id = $${paramIndex}
        RETURNING *`;

    values.push(benefitId);

    const { rows } = await pool.query(query, values);
    return rows[0] || null;
}

export async function deleteBenefitModel (id) {
    const { rows } = await pool.query(`
        DELETE FROM benefits
        WHERE id = $1
        RETURNING *`, 
        [id]);
    return rows[0];
}