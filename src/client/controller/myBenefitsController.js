import {
    getMyBenefits
} from '../model/myBenefitsModel.js';

export async function handleGetMyBenefits(req, res, next) {
    try {
        const idUser = req.params.idUser;

        if (!idUser) return res.status(400).json({ok: false, message: 'User ID is required'});

        const benefits = await getMyBenefits(idUser);
        res.status(200).json({ok: true, data: benefits});
    }
    catch (err) {
        next(err);
    }
}