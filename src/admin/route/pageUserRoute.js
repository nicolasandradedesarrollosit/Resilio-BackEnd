import Router from 'express';
import { getUserControllerLimit, 
    updateUser, 
    banUser
 } from '../controller/pageUserController.js';
import { requireAdmin } from '../../client/middleware/authJWT.js';

const r = Router();

// Todas las rutas de admin requieren autenticación y rol de administrador
r.get('/admin/user', requireAdmin, getUserControllerLimit);
r.patch('/admin/user-update/:userId', requireAdmin, updateUser);
r.patch('/admin/ban-user/:userId', requireAdmin, banUser);

export default r;