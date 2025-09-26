import {
    createUser,
    findOneByEmail,
    patchVerifiedEmail,
} from '../model/userModel.js';
import { 
    hashPassword,
    comparePasswords
 } from '../util/hashing.js';
import {
    generateRandomToken,
    hashToken,
    signJWT,
    signRefresh
} from '../util/tokens.js';
import {
    consumeTokenVerification,
    createTokenVerification
} from '../model/verifyEmailModel.js';
import { sendMail } from '../util/mailer.js';
import { 
    validateFieldsRegister,
    validateFieldsLogIn
 } from '../util/validateUserFields.js';

const URL_FRONT = process.env.URL_FRONT || 'http:/localhost:5173';

export async function register(req, res, next){
    try{
    const {name, province, city, phone_number, email, password} = req.body;

    const exists = await findOneByEmail(email);
    if(exists) return res.status(409).json({ ok: false, message: 'Error de credenciales' });

    const isValid = validateFieldsRegister(name, province, city, phone_number, email, password);
    if(!isValid) res.status(400).json({ ok: false, message: 'Error de credenciales' });

    const hash = await hashPassword(password)
    const user = await createUser({name, province, city, phone_number, email, hash});

    const tokenPlano = generateRandomToken(32);
    const tokenHashed = hashToken(tokenPlano);

    await createTokenVerification(user.id, tokenHashed, 60);
    const link = `${URL_FRONT}/verify-email?token=${tokenPlano}`;

    await sendMail({
        forWho: user.email,
        subject: 'Verificá tu mail',
        html: `<p>Hola ${user.name},</p><p>Confirmá tu email haciendo clic <a href="${link}">aquí</a>. Caduca en 60 minutos.</p>`
    });

    res.status(201).json({ ok:true, message: 'Usuario creado. Verifica tu casilla de mail para poder iniciar sesión. Caduca en 60 minutos.' });
    }   
    catch(err){
        next(err);
    }
}

export async function verifyEmail(req, res, next){
    try{
        const { token } = req.body;
        const tokenHashed = hashToken(token);

        const register = await consumeTokenVerification(tokenHashed);
        if(!register) return res.status(400).json({ ok: false, message: 'Token invalido o expirado'});

        await patchVerifiedEmail(register.user_id);
        return res.status(201).json({ ok:true, message: 'Email verificado correctamente' });
    }
    catch(err){
        next(err);
    }
}

export async function logIn(req, res, next){
    try{
        const {email, password} = req.body;
        const isValid = validateFieldsLogIn(email, password);
        if(!isValid) return res.status(400).json({ ok: false, message: 'Error de credenciales' });
        const user = await findOneByEmail(email);
        if(!user || !user.is_active) return res.status(401).json({ ok: false, message: 'Error de credenciales' });

        const ok = await comparePasswords(password, user.password_hash);
        if(!ok) return res.status(401).json({ ok: false, message: 'Error de credenciales' });
        if(!user.email_verified) return res.status(403).json({ ok: false, message: 'Tienes que confirmar tu casilla de correo' });

        const accessToken = signJWT(user);
        const refreshToken = signRefresh(user);
        const expiresRefresh = 1000 * 60 * 60 * 24 * 7;

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',       
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            domain: process.env.NODE_ENV === 'production' ? process.env.COOKIE_DOMAIN : undefined,
            path: '/api',
            maxAge: expiresRefresh
        });

        return res.json({
            ok: true,
            data: {
                accessToken
            }
        })
    }
    catch(err){
        next(err);
    }
}

