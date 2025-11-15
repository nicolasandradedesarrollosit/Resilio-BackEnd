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
        // Aceptar tanto benefitId/userId (frontend) como idBenefit/idUser (legacy)
        const { 
            idBenefit, 
            idUser, 
            benefitId, 
            userId 
        } = req.body;

        const benefitIdValue = benefitId || idBenefit;
        const userIdValue = userId || idUser;

        // Parse and validate both IDs
        const parsedBenefitId = parseInt(benefitIdValue, 10);
        const parsedUserId = parseInt(userIdValue, 10);

        if (isNaN(parsedBenefitId) || parsedBenefitId <= 0 || 
            isNaN(parsedUserId) || parsedUserId <= 0) {
            return res.status(400).json({ 
                ok: false, 
                message: 'Benefit ID and User ID are required and must be positive integers' 
            });
        }

        // Verificar que el usuario solo pueda canjear beneficios para sí mismo
        // (a menos que sea admin)
        if (req.user.role !== 'admin' && req.user.id !== parsedUserId) {
            return res.status(403).json({ 
                ok: false, 
                message: 'No puedes canjear beneficios para otro usuario' 
            });
        }

        const code = createCode();

        const newRedemption = await postMyBenefits({ 
            idBenefit: parsedBenefitId, 
            idUser: parsedUserId, 
            code 
        });

        res.status(201).json({ 
            ok: true, 
            data: newRedemption,
            message: 'Benefit redeemed successfully'
        });
    }
    catch (err) {
        next(err);
    }
}