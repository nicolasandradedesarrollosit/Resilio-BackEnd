import Router from 'express';
import { getUserControllerLimit } from '../controller/pageUserController.js';

const r = Router();
r.get('/admin/user', getUserControllerLimit);

export default r;