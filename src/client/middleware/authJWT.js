import {verifyAccess} from '../util/tokens.js';

export async function requireAuth(req, res, next){
    if (req.method === 'OPTIONS') {
        return next();
    }
    
    try {
        const token = req.cookies?.access_token;
        
        if (!token) {
            console.log('❌ requireAuth: No token found');
            console.log('📦 Cookies recibidas:', Object.keys(req.cookies || {}));
            console.log('🌐 Origin:', req.headers.origin);
            console.log('🔍 User-Agent:', req.headers['user-agent']);
            return res.status(401).json({ 
                ok: false, 
                message: 'No autenticado' 
            });
        }
        
        console.log('✅ Token encontrado, verificando...');
        
        const payload = verifyAccess(token);
        
        req.user = {
            id: payload.sub,
            tokenVersion: payload.version
        };
        
        next();
    } catch (error) {
        console.error('requireAuth error:', error.message);
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
        
        const { findOneById } = await import('../model/userModel.js');
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