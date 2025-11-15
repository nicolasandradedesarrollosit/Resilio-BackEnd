import { pool } from "../config/db.js";

async function findOneCode(code) {
    try {
        const {rows} = await pool.query(`
            SELECT * FROM benefits_redeemed WHERE code = $1
        `, [code]);
        return rows[0] || null;
    } catch (err) {
        throw new Error(`Error finding code: ${err.message}`);
    }
}

/**
 * @returns {string}
 */
function generateRandomCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters[randomIndex];
        
        if ((i + 1) % 2 === 0 && i < 7) {
            code += '-';
        }
    }
    
    return code; 
}

/**
 * @returns {Promise<string>} 
 * @throws {Error}
 */
export async function createCode() {
    const maxAttempts = 10;
    
    try {
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const code = generateRandomCode();
            const existingCode = await findOneCode(code);
            
            if (!existingCode) {
                return code;
            }
            
        }
        
        throw new Error(`No se pudo generar un código único después de ${maxAttempts} intentos`);
        
    } catch (err) {
        throw new Error(`Error creating code: ${err.message}`);
    }
}