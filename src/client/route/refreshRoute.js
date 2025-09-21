import { Router } from 'express';
import { refreshToken } from "../controller/tokenController.js";

const r = Router();

r.post('/refresh', refreshToken)

export default r;