import bcrypt from 'bcryptjs';

const salts = 12;

export async function hashPassword(password){
    return bcrypt.hash(password, salts);
}

export async function comparePasswords(password, hash){
    return bcrypt.compare(password, hash);
}