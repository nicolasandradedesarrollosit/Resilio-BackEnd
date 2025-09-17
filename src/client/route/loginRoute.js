import { Router } from 'express';
import { controllerVerifyCredentials } from '../controller/loginController.js';
import { loginLimiter } from '../middlewares/loginRateLimit.js';

const router = Router();

router.post('/client/:email', loginLimiter, controllerVerifyCredentials);

export default router;