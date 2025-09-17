import { Router } from 'express';
import { controllerRegister } from '../controller/registerController.js';
import { registerLimiter } from '../middlewares/registerRateLimit.js';

const router = Router();

router.post('/client', registerLimiter, controllerRegister);

export default router;