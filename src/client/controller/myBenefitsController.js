import {
    getMyBenefits,
    postMyBenefits
} from '../model/myBenefitsModel.js';

import {
    createCode
} from '../../helpers/codeGenerator.js'

export async function handleGetMyBenefits(req, res, next) {
    try {
        const idUser = req.params.idUser;

        // Validate idUser is a valid positive integer
        const parsedId = parseInt(idUser, 10);
        
        if (!idUser || isNaN(parsedId) || parsedId <= 0) {
            return res.status(400).json({
                ok: false, 
                message: 'User ID is required and must be a positive integer'
            });
        }

        const benefits = await getMyBenefits(parsedId);
        res.status(200).json({ok: true, data: benefits});
    }
    catch (err) {
        next(err);
    }
}

export async function postMyBenefitsController(req, res, next) {
    try {
        const { idBenefit, idUser } = req.body;

        // Parse and validate both IDs
        const parsedBenefitId = parseInt(idBenefit, 10);
        const parsedUserId = parseInt(idUser, 10);

        if (isNaN(parsedBenefitId) || parsedBenefitId <= 0 || 
            isNaN(parsedUserId) || parsedUserId <= 0) {
            return res.status(400).json({ 
                ok: false, 
                message: 'idBenefit and idUser are required and must be positive integers' 
            });
        }

        const code = createCode();

        const newRedemption = await postMyBenefits({ 
            idBenefit: parsedBenefitId, 
            idUser: parsedUserId, 
            code 
        });

        res.status(201).json(newRedemption);
    }
    catch (err) {
        next(err);
    }
}