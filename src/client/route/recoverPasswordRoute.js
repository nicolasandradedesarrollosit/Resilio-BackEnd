import { Router } from 'express';
import { 
    mailRecoverPassword,
    recoverPassword
} from '../controller/recoverPasswordController.js';

const r = Router();

r.post('/forgot-password', mailRecoverPassword);
r.post('/reset-password', recoverPassword);

export default r;