import Router from 'express';
import { getUserControllerLimit, 
    updateUser, 
    banUser
 } from '../controller/pageUserController.js';

const r = Router();
r.get('/admin/user', getUserControllerLimit);
r.patch('/admin/user-update/:userId', updateUser);
r.patch('/admin/ban-user/:userId', banUser);

export default r;