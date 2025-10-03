import { 
    verifyRefresh,
    signJWT

} from "../util/tokens.js";
import { findOneById } from "../model/userModel.js";

export async function refreshToken(req, res){
    try{
        const tokenCookie = req.cookies?.refresh_token;
        if(!tokenCookie) return res.status(401).json({ ok: false, message: 'Falta refresh token' });

        const payload = verifyRefresh(tokenCookie);
        const user = await findOneById(payload.sub);

        if(!user || !user.is_active) return res.status(401).json({ ok: false, message: 'Usuario inválido' });

        if(payload.version !== user.token_version) return res.status(401).json({ ok: false, message: 'Refresh token inválido' });

        const newAccess = signJWT(user);

        return res.json({ ok: true, data: { accessToken: newAccess } });
    }
    catch{
        return res.status(401).json({  ok: false, message: 'Refresh inválido o expirado'});
    }
}

export async function destroyToken(req, res){
    
}