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
        email: user.email,
        role: user.role 
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