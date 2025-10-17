import supabase from '../../config/supabase.js';
import {
  signJWT,
  signRefresh
} from '../../helpers/tokens.js';
import { findOneByEmail, createUserWithGoogle, addGoogleToExistingUser } from '../model/userModel.js';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export const googleAuth = async (req, res) => {
  try {
    const { supabaseToken, email} = req.body;

    if (!supabaseToken || !email) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(supabaseToken);

    if (error || !user) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    if (user.email !== email) {
      return res.status(401).json({ error: 'Los datos no coinciden' });
    }

    const googleIdentity = user.identities.find(i => i.provider === 'google');
    if (!googleIdentity) {
      return res.status(401).json({ error: 'No se encontró identidad de Google' });
    }

    const googleId = googleIdentity.id;
    
    let dbUser = await findOneByEmail(email);

    if (dbUser) {
      if (!dbUser.google_id && !dbUser.googleId && !dbUser.googleid) {
        dbUser = await addGoogleToExistingUser(dbUser.id, googleId);
      }
    } else {
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
    }

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
    
    const isProduction = process.env.NODE_ENV === 'production';

    if (isProduction) {
      const accessCookie = `access_token=${accessToken}; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=${Math.floor(expiresAccess / 1000)}; Partitioned`;
      const refreshCookie = `refresh_token=${refreshToken}; HttpOnly; Secure; SameSite=None; Path=/api; Max-Age=${Math.floor(expiresRefresh / 1000)}; Partitioned`;
      
      res.setHeader('Set-Cookie', [accessCookie, refreshCookie]);
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
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};