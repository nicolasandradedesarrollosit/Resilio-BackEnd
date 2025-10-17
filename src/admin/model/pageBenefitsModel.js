import { pool } from '../../config/db.js';

export async function getBenefitModel(limit, offset) {
    const { rows } = await pool.query(`
        SELECT * FROM events
        ORDER BY date DESC
        LIMIT $1 OFFSET $2
    `, [limit, offset]);
    return rows;
}

export async function createBenefitModel(eventData) {
    const { name, description, location, date, url_passline, url_image } = eventData;
    const { rows } = await pool.query(
        `
        INSERT INTO events (name, q_of_codes, location, discount, url_image_benefit, id_business_discount, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW())
        RETURNING *
        `,
        [name, description, location, date, url_passline, url_image]
    );

    return rows[0];
}

export async function updateBenefitModel(benefitId, fieldsToUpdate) {
    const allowedFields = ['name', 'description', 'location', 'date', 'url_passline', 'url_image_event', 'q_of_codes', 'discount', 'id_business_discount'];
    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (fieldsToUpdate.url_image !== undefined) {
        fieldsToUpdate.url_image_event = fieldsToUpdate.url_image;
        delete fieldsToUpdate.url_image;
    }

    for (const [key, value] of Object.entries(fieldsToUpdate)) {
        if (allowedFields.includes(key)) {
            fields.push(`${key} = $${paramIndex}`);
            values.push(value);
            paramIndex++;
        }
    }

    if (fields.length === 0) {
        return await getBenefitModel(benefitId);
    }

    const query = `UPDATE events
        SET ${fields.join(',\n        ')}
        WHERE id = $${paramIndex}
        RETURNING name, description, location, date, url_passline, url_image_event`;

    values.push(benefitId);

    const { rows } = await pool.query(query, values);
    return rows[0] || null;
}

export async function deleteBenefitModel (id) {
    const { rows } = await pool.query(`
        DELETE FROM events
        WHERE id = $1
        RETURNING *`, 
        [id]);
    return rows[0];
}