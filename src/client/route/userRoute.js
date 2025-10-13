import { Router } from 'express';
import { 
    register,
    verifyEmail,
    logIn,
    logOut,
    returnUserData,
    updateUser
} from "../controller/userController.js";
import { requireAuth } from "../middleware/authJWT.js";

const r = Router();

// Rutas públicas
r.post('/register', register);
r.post('/verify-email', verifyEmail);
r.post('/log-in', logIn);

// Rutas protegidas (requieren autenticación)
r.post('/log-out', requireAuth, logOut);
r.get('/user-data', requireAuth, returnUserData);
r.patch('/update-user', requireAuth, updateUser);

export default r;