import supabase from '../../others/config/supabase.js';
import {
  signJWT,
  signRefresh
} from '../util/tokens.js';
import { findOneByEmail, createUserWithGoogle, addGoogleToExistingUser } from '../model/userModel.js';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export const googleAuth = async (req, res) => {
  try {
    console.log('📥 Recibiendo petición de Google Auth');
    const { supabaseToken, email} = req.body;

    if (!supabaseToken || !email) {
      console.log('❌ Faltan datos requeridos');
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    console.log('🔍 Verificando token de Supabase para:', email);
    const { data: { user }, error } = await supabase.auth.getUser(supabaseToken);

    if (error || !user) {
      console.log('❌ Token inválido:', error?.message);
      return res.status(401).json({ error: 'Token inválido' });
    }

    if (user.email !== email) {
      console.log('❌ Email no coincide');
      return res.status(401).json({ error: 'Los datos no coinciden' });
    }

    const googleIdentity = user.identities.find(i => i.provider === 'google');
    if (!googleIdentity) {
      console.log('❌ No se encontró identidad de Google');
      return res.status(401).json({ error: 'No se encontró identidad de Google' });
    }

    const googleId = googleIdentity.id;
    console.log('✅ Usuario de Google verificado:', email);
    
    let dbUser = await findOneByEmail(email);

    if (dbUser) {
      console.log('👤 Usuario encontrado en DB:', dbUser.id);
      if (!dbUser.google_id && !dbUser.googleId && !dbUser.googleid) {
        console.log('🔗 Vinculando Google ID al usuario existente');
        dbUser = await addGoogleToExistingUser(dbUser.id, googleId);
      }
    } else {
      console.log('🆕 Creando nuevo usuario con Google');
      const nombre = user.user_metadata?.full_name || email.split('@')[0];
      const randomSecret = crypto.randomBytes(48).toString('hex');
      const hashed = await bcrypt.hash(randomSecret, 12);

      dbUser = await createUserWithGoogle({
        name: nombre,
        email,
        googleId,
        role: 'user',
        hashed
      });
      console.log('✅ Usuario creado:', dbUser.id);
    }

    console.log('🔐 Generando tokens JWT...');
    const accessToken = signJWT({
      id: dbUser.id.toString(),
      role: dbUser.role
    });

    const refreshToken = signRefresh({
      id: dbUser.id.toString(),
      token_version: dbUser.token_version ?? 0
    });

    const expiresAccess = 1000 * 60 * 15; 
    const expiresRefresh = 1000 * 60 * 60 * 24 * 7; 

    console.log('🍪 Configurando cookies...');
    console.log('Environment:', process.env.NODE_ENV);
    
    const isProduction = false;
    
    console.log('✅ Autenticación Google completada exitosamente');
    console.log('Usuario ID:', dbUser.id, '| Role:', dbUser.role);

    if (isProduction) {
      const accessCookie = `access_token=${accessToken}; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=${Math.floor(expiresAccess / 1000)}; Partitioned`;
      const refreshCookie = `refresh_token=${refreshToken}; HttpOnly; Secure; SameSite=None; Path=/api; Max-Age=${Math.floor(expiresRefresh / 1000)}; Partitioned`;
      
      res.setHeader('Set-Cookie', [accessCookie, refreshCookie]);
      console.log('🍪 Cookies configuradas manualmente con Partitioned');
    } else {
      res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        path: '/',
        maxAge: expiresAccess
      });
      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        path: '/api',
        maxAge: expiresRefresh
      });
    }

    res.json({
      ok: true,
      message: 'Autenticación exitosa',
      userId: dbUser.id,
      role: dbUser.role
    });

  } catch (error) {
    console.error('Error en googleAuth:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};