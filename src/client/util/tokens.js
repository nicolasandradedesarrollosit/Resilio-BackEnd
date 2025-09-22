import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export function generateRandomToken(bytes = 32){
    return crypto.randomBytes(bytes).toString('hex');
}

export function hashToken(token){
    return crypto.createHash('sha256').update(token).digest('hex');
}

export function signJWT(user){
    return jwt.sign({
        sub: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        email_verified: user.email_verified,
        is_active: user.is_active,
        phone_number: user.phone_number,
        created_at: user.created_at,
        updated_at: user.updated_at,
        token_version: user.token_version
    }, 
    process.env.JWT_SECRET, 
    {
        expiresIn: '15m',
    }
);
}

export function signRefresh(user){
    return jwt.sign({
        sub: user.id,
        version: user.token_version
    }, 
    process.env.JWT_REFRESH_SECRET,
    {
        expiresIn: '7d'
    }
);
}

export function verifyAccess(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

export function verifyRefresh(token) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
}