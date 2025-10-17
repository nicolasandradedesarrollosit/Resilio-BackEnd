import {verifyAccess} from '../helpers/tokens.js';

export async function requireAuth(req, res, next){
    if (req.method === 'OPTIONS') {
        return next();
    }
    
    try {
        const token = req.cookies?.access_token;
        
        if (!token) {
            return res.status(401).json({ 
                ok: false, 
                message: 'No autenticado' 
            });
        }
        
        const payload = verifyAccess(token);
        
        req.user = {
            id: payload.sub,
            tokenVersion: payload.version
        };
        
        next();
    } catch (error) {
        return res.status(401).json({ 
            ok: false, 
            message: 'Token inválido o expirado' 
        });
    }
}

export async function requireAdmin(req, res, next){
    if (req.method === 'OPTIONS') {
        return next();
    }
    
    try {
        const token = req.cookies?.access_token;
        
        if (!token) {
            return res.status(401).json({ 
                ok: false, 
                message: 'No autenticado' 
            });
        }
        
        const payload = verifyAccess(token);
        
        req.user = {
            id: payload.sub,
            tokenVersion: payload.version
        };
        
        const { findOneById } = await import('../client/model/userModel.js');
        const user = await findOneById(payload.sub);
        
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ 
                ok: false, 
                message: 'No autorizado - Se requiere rol de administrador' 
            });
        }
        
        req.user.role = user.role;
        next();
    } catch (error) {
        return res.status(401).json({ 
            ok: false, 
            message: 'Token inválido o expirado' 
        });
    }
}