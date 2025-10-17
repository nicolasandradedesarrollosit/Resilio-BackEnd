import { findOneByEmail, updatePassword } from "../model/userModel.js";
import { generateRandomToken, hashToken } from "../../helpers/tokens.js";
import { hashPassword } from "../../helpers/hashing.js";
import { consumeTokenReset, createTokenReset } from "../model/passwordResetModel.js";
import { sendMail } from "../../helpers/mailer.js";

export async function mailRecoverPassword(req, res, next){
    try{
        const URL_FRONT = process.env.URL_FRONT;
        const { email } = req.body;
        const user = await findOneByEmail(email);
        if(!user) return res.json({ ok: true, message: 'Si el email existe, se enviará un enlace'});

        const tokenPlano = generateRandomToken(32);
        const tokenHashed = hashToken(tokenPlano);
        await createTokenReset(user.id, tokenHashed , 60);

        const link = `${URL_FRONT}/restablecer-contraseña?token=${tokenPlano}`;

        await sendMail({
            forWho: user.email,
            subject: 'Restablecer contraseña',
            html: `<p>Hola ${user.name},</p><p>Para restablecer tu contraseña hacé clic <a href="${link}">aquí</a>. Válido por 30 minutos.</p>`
        });

        return res.json({ ok: true, message: 'Si el email existe, se enviará un enlace' });
    }
    catch(err){
        next(err)
    }
}

export async function recoverPassword(req, res, next){  
    try{
        const {token, newPassword} = req.body;
        const tokenHashed = hashToken(token);
        const register = await consumeTokenReset(tokenHashed);
        if(!register) return res.status(400).json({ ok:false, message: 'Token inválido o expirado' });

        const newHash = await hashPassword(newPassword);
        await updatePassword(register.user_id, newHash);
        return res.json({ ok: true, message: 'Contraseña reestablecida' });
    }
    catch(err){
        next(err);
    }
}