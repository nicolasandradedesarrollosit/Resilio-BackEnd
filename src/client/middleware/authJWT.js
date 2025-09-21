import {verifyAccess} from '../util/tokens.js';

export async function requireAuth(req, res, next){
    const cab = req.headers.authorization || '';
    const [bearer, token] = cab.split(' ');
    if(bearer !== 'Bearer' || !token) return res.status(401).json({ ok: false, message: 'Token no enviado' });
    try{
        const payload = verifyAccess(token);
        req.usuario = 
        {
            id: payload.sub,
            email: payload.email,
            role: payload.role 
        };
        next();
    }
    catch{
        return res.status(401).json({ ok: false, message: 'Token inválido o expirado' })
    }
}