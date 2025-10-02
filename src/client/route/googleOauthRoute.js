import { Router } from 'express';
import { 
    googleAuth
} from '../controller/googleOauthController.js'

const r = Router();

r.post('/auth/google', googleAuth);

export default r;