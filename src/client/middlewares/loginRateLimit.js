import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        ok: false,
        message: 'Demasiados intentos de inicio de sesión. Intente nuevamente en 15 minutos.'
    },
    standardHeaders: true,
    legacyHeaders: false
});