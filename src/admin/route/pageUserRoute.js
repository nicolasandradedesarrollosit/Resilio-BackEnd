import Router from 'express';
import { getUserControllerLimit } from '../controller/pageUserController';

const r = Router();
r.get('/admin/user', getUserControllerLimit);

export default r;