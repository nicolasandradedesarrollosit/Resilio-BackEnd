import {
    createUser,
    findOneByEmail,
    patchVerifiedEmail,
    findOneById,
    getUserData,
    updateUserData
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
    validateFieldsLogIn,
    validateFieldsUpdate
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
        const expiresAccess = 1000 * 60 * 15;
        const expiresRefresh = 1000 * 60 * 60 * 24 * 7;

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
            maxAge: expiresAccess
        };

        const refreshCookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/api',
            maxAge: expiresRefresh
        };

        res.cookie('access_token', accessToken, cookieOptions);
        res.cookie('refresh_token', refreshToken, refreshCookieOptions);

        return res.json({
            ok: true,
            message: 'Inicio de sesión exitoso'
        })
    }
    catch(err){
        next(err);
    }
}

export async function returnUserData(req, res, next){
    try{
        const userId = req.user?.id;
        
        if(!userId) return res.status(401).json({ ok: false, message: 'No autenticado' });
        
        const exists = await findOneById(userId);
        if(!exists) return res.status(404).json({ ok: false, message: 'Usuario no encontrado' });

        const dataUser = await getUserData(userId);
        
        if(!dataUser) return res.status(404).json({ ok: false, message: 'Datos no encontrados' });
        
        return res.status(200).json({ ok: true, data: dataUser });
    }
    catch (err){
        next(err);
    }
}

export async function updateUser(req, res, next) {
    try {
        const userId = req.user?.id;
        
        if (!userId) return res.status(401).json({ ok: false, message: 'No autenticado' });

        const { name, province, city, phone_number } = req.body;
        
        if (!name && !province && !city && !phone_number) {
            return res.status(400).json({ ok: false, message: 'No se proporcionaron campos para actualizar' });
        }

        const exists = await findOneById(userId);
        if (!exists) return res.status(404).json({ ok: false, message: 'Usuario no encontrado' });

        const fieldsToUpdate = {};
        if (name !== undefined) fieldsToUpdate.name = name;
        if (province !== undefined) fieldsToUpdate.province = province;
        if (city !== undefined) fieldsToUpdate.city = city;
        if (phone_number !== undefined) fieldsToUpdate.phone_number = phone_number;

        const fieldsArray = Object.values(fieldsToUpdate);

        const isValid = validateFieldsUpdate(fieldsArray);

        if(!isValid) return res.status(400).json({ ok: false, message: 'Error en los campos proporcionados' });

        const updatedUser = await updateUserData(userId, fieldsToUpdate);

        return res.status(200).json({ 
            ok: true, 
            message: 'Usuario actualizado correctamente', 
            data: updatedUser 
        });
    } catch (err) {
        next(err);
    }
}

export async function logOut(req, res, next) {
    try {
        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/'
        };

        const refreshCookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/api'
        };

        res.clearCookie('access_token', cookieOptions);
        res.clearCookie('refresh_token', refreshCookieOptions);

        return res.json({ 
            ok: true, 
            message: 'Sesión cerrada correctamente' 
        });
    } catch (err) {
        next(err);
    }
}