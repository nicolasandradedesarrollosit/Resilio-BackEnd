import { pool } from '../../config/db.js';

export async function getUserModelLimit(limit, offset) {
    const { rows } = await pool.query(`
        SELECT * FROM users
        ORDER BY id DESC 
        LIMIT $1 OFFSET $2`, 
        [limit, offset]);
    return rows;    
}

export async function updateUserData(userId, fieldsToUpdate) {
  const allowedFields = ['name', 'province', 'city', 'phone_number', 'role'];
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
    return await getUserData(userId);
  }

  const query = `UPDATE users
    SET ${fields.join(',\n        ')},
        updated_at = NOW()
    WHERE id = $${paramIndex}
    RETURNING name, ispremium, role, email, phone_number, city, province, email_verified`;
  
  values.push(userId);

  const { rows } = await pool.query(query, values);
  return rows[0] || null;
}

export async function banUnbanUserModel (id) {
    const { rows } = await pool.query(`
        UPDATE users
        SET is_banned = NOT is_banned
        WHERE id = $1`, 
        [id]);
    return rows[0];
}