import { modelRegister } from "../model/registerModel.js";

export async function controllerRegister(req, res) {
  try {
    const { name, email, password } = req.body ?? {};

    if (
      typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string' ||
      !name.trim() || !email.trim() || !password.trim()
    ) {
      return res.status(400).json({ ok: false, message: 'Error de credenciales' });
    }

    const usuario = await modelRegister({ name, email, password });

    return res.status(201).json({
      ok: true,
      message: 'Registro hecho con éxito',
      data: usuario
    });
  } catch (err) {
    if (err?.code === 'EMAIL_DUP' || err?.message?.toLowerCase() === 'correo ya registrado') {
      return res.status(409).json({ ok: false, message: 'Correo ya registrado' });
    }

    console.error('Error en controllerRegister:', err);
    return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
  }
}
