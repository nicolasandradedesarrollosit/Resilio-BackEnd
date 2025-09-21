import { Router } from 'express';
import { 
    register,
    verifyEmail,
    logIn 
} from "../controller/userController.js";

const r = Router();

r.post('/register', register);
r.post('/verify-email', verifyEmail);
r.post('/log-in', logIn);

export default r;