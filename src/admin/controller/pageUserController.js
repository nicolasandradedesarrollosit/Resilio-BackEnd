import {
    getUserModelLimit
} from '../model/pageUserModel.js';
import { validateUserReq } from '../util/validateUserReq.js';

export async function getUserControllerLimit(req, res, next) {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    try {
        const validation = validateUserReq(req);
        if (!validation.valid) return res.status(400).json({ ok: false, message: validation.message });
        const users = await getUserModelLimit(limit, offset);
        res.json({ ok: true, data: users });
    }
    catch(err){
        next(err);
    }

}