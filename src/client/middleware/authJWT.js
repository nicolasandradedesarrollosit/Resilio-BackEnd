import {verifyAccess} from '../util/tokens.js';

/**
 * Middleware para verificar autenticación mediante access_token en cookie
 */
export async function requireAuth(req, res, next){
    try {
        const token = req.cookies?.access_token;
        
        if (!token) {
            console.log('requireAuth: No token found in cookies');
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
        console.error('requireAuth error:', error.message);
        return res.status(401).json({ 
            ok: false, 
            message: 'Token inválido o expirado' 
        });
    }
}

/**
 * Middleware para verificar que el usuario es admin
 */
export async function requireAdmin(req, res, next){
    try {
        const token = req.cookies?.access_token;
        
        if (!token) {
            return res.status(401).json({ 
                ok: false, 
                message: 'No autenticado' 
            });
        }
        
        const payload = verifyAccess(token);
        
        // Aquí deberías verificar el rol desde la base de datos
        // Por ahora asumimos que el payload tiene el rol
        req.user = {
            id: payload.sub,
            tokenVersion: payload.version
        };
        
        // Verificar rol de admin (esto debería consultarse en la BD)
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