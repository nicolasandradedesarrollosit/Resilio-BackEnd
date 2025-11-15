import { pool } from '../../config/db.js';


export async function createUser({ name, province, city, phone_number, email, hash }){
    const { rows }= await pool.query(
        `INSERT INTO users (name, province, city, phone_number, email, password_hash)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, name, email, phone_number, email_verified, token_version, created_at, role`,
        [name, province, city, phone_number, email, hash]
    )
    return rows[0];
}

export async function findOneByEmail(email) {
    const {rows} = await pool.query(`
            SELECT * FROM users 
            WHERE email = $1
            LIMIT 1`,
            [email]
    );
    return rows[0] || null;
}

export async function findOneById(user_id){
    const {rows} = await pool.query(`
            SELECT * FROM users 
            WHERE id = $1
            LIMIT 1`,
            [user_id]
    );
    return rows[0] || null;
}

export async function patchVerifiedEmail(user_id){
    await pool.query(
        `
            UPDATE users SET email_verified = true, updated_at = NOW()
            WHERE ID = $1
        `,
        [user_id]
    );
}

export async function updatePassword(user_id, new_hash){
    await pool.query(
        `
            UPDATE users SET password_hash = $1, updated_at = NOW()
            WHERE id = $2
        `,
        [new_hash, user_id]
    );
}

export async function increaseTokenVersion(userId) {
  await pool.query(`UPDATE users SET token_version = token_version + 1 WHERE id=$1`, [userId]);
}


export async function createUserWithGoogle({ name, email, googleId, role = 'user', hashed }) {
  const { rows } = await pool.query(
    `INSERT INTO users
      (name, email, google_id, email_verified, role, token_version, auth_providers, created_at, updated_at, password_hash, phone_number, province, city)
     VALUES
      ($1, $2, $3, true, $4, 0, $5, NOW(), NOW(), $6, $7, $8, $9)
     RETURNING id, name, email, phone_number, email_verified, token_version, role, google_id, auth_providers`,
    [name, email, googleId, role, 'google', hashed, 'No especificado', 'No especificado', 'No especificado' ]
  );
  return rows[0];
}

export async function addGoogleToExistingUser(userId, googleId) {
  const { rows } = await pool.query(
    `UPDATE users
     SET google_id = $1,
         auth_providers = (
           CASE
             WHEN auth_providers IS NULL THEN ARRAY['google']
             WHEN NOT ('google' = ANY(auth_providers)) THEN array_append(auth_providers, 'google')
             ELSE auth_providers
           END
         ),
         updated_at = NOW()
     WHERE id = $2
     RETURNING id, name, email, phone_number, email_verified, token_version, role, google_id, auth_providers`,
    [googleId, userId]
  );
  return rows[0];
}

export async function getUserData(userId){
  const { rows } = await pool.query(
    `SELECT id, name, ispremium, role, email, phone_number, city, province, email_verified, q_of_redeemed, points_user FROM users
    WHERE id = $1`,
    [userId]
  )
  return rows[0] || null;
}

export async function updateUserData(userId, fieldsToUpdate) {
  const allowedFields = ['name', 'province', 'city', 'phone_number'];
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