import { pool } from '../../others/config/db.js';

export async function getEventsModelimit(limit, offset) {
    const { rows } = await pool.query(`
        SELECT * FROM events
        ORDER BY id DESC 
        LIMIT $1 OFFSET $2`, 
        [limit, offset]);
    return rows;
}

export async function createEventModel(eventData) {
    const { name, description, location, date, url_passline, url_image } = eventData;
    const { rows } = await pool.query(`
        INSERT INTO events (name, description, location, date, url_passline, url_image_event)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id`, 
        [name, description, location, date, url_passline, url_image]);
    return rows[0];
}

export async function updateEventModel(userId, fieldsToUpdate) {
    const allowedFields = ['name', 'description', 'location', 'date', 'url_passline', 'url_image_event'];
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
        return await getEventData(userId);
    }

    const query = `UPDATE events
        SET ${fields.join(',\n        ')},
            updated_at = NOW()
        WHERE id = $${paramIndex}
        RETURNING name, description, location, date, url_passline, url_image_event`;

    values.push(userId);

    const { rows } = await pool.query(query, values);
    return rows[0] || null;
}

export async function deleteEventModel (id) {
    const { rows } = await pool.query(`
        DELETE FROM events
        WHERE id = $1`, 
        [id]);
    return rows[0];
}