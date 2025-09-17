import rateLimit from "express-rate-limit";

export const registerLimiter = rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 5,
    message: {
        ok: false,
        message: 'Demasiados intentos de registro. Intente nuevamente en 30 minutos.'
    },
    standardHeaders: true,
    legacyHeaders: false
});