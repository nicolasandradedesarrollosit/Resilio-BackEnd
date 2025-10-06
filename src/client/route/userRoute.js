import { Router } from 'express';
import { 
    register,
    verifyEmail,
    logIn,
    returnUserData,
    updateUser
} from "../controller/userController.js";

const r = Router();

r.post('/register', register);
r.post('/verify-email', verifyEmail);
r.post('/log-in', logIn);
r.post('/user-data', returnUserData)
r.patch('/update-user', updateUser);

export default r;