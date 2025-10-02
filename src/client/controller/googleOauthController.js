import supabase from '../../others/config/supabase.js';
import {
  signJWT,
  signRefresh
} from '../util/tokens.js';
import { findOneByEmail, createUserWithGoogle, addGoogleToExistingUser } from '../model/userModel.js';

export const googleAuth = async (req, res) => {
  try {
    const { supabaseToken, email, googleId } = req.body;

    if (!supabaseToken || !email || !googleId) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(supabaseToken);

    if (error || !user) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    if (user.email !== email) {
      return res.status(401).json({ error: 'Los datos no coinciden' });
    }

    let dbUser = await findOneByEmail(email);

    if (dbUser) {
      if (!dbUser.google_id && !dbUser.googleId && !dbUser.googleid) {
        dbUser = await addGoogleToExistingUser(dbUser.id, googleId);
      }
    } else {
      const nombre = user.user_metadata?.full_name || email.split('@')[0];

      dbUser = await createUserWithGoogle({
        name: nombre,
        email,
        googleId,
        role: 'user'
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

    const expiresRefresh = 1000 * 60 * 60 * 24 * 7; 

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      domain: process.env.NODE_ENV === 'production' ? process.env.COOKIE_DOMAIN : undefined,
      path: '/api',
      maxAge: expiresRefresh
    });

    res.json({
      accessToken
    });

  } catch (error) {
    console.error('Error en googleAuth:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};