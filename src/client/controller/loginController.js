import { modelVerifyCredentials } from "../model/loginModel.js";
import jwt from 'jsonwebtoken';

export async function controllerVerifyCredentials(req, res) {
  try {
    const { email = '', password = '' } = req.body ?? {};
    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !email.trim() || !password.trim()
    ) {
      return res.status(400).json({ ok: false, message: 'Error de credenciales' });
    }

    const credentials = await modelVerifyCredentials({ email, password });

    const token = jwt.sign(
      {
        id: credentials.id,
        name: credentials.name,
        email: credentials.email,
        isInfluencer: credentials.is_influencer,
        planType: credentials.plan_type
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    return res.status(200).json({ ok: true, token });
  } catch (err) {
    if (err?.message === 'Credenciales inválidas') {
      return res.status(401).json({ ok: false, message: 'Credenciales inválidas' });
    }
    return res.status(500).json({ ok: false, message: 'Error interno en el servidor' });
  }
}