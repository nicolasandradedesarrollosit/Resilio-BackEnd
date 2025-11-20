import {
    getMyBenefits,
    postMyBenefits,
    checkBenefitAlreadyRedeemed
} from '../model/myBenefitsModel.js';

import {
    createCode
} from '../../helpers/codeGenerator.js'

export async function handleGetMyBenefits(req, res, next) {
    try {
        const idUser = req.params.idUser;

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

        const parsedBenefitId = parseInt(benefitIdValue, 10);
        const parsedUserId = parseInt(userIdValue, 10);

        if (isNaN(parsedBenefitId) || parsedBenefitId <= 0 || 
            isNaN(parsedUserId) || parsedUserId <= 0) {
            return res.status(400).json({ 
                ok: false, 
                message: 'El id de beneficio y el id de usuario deben ser enteros positivos' 
            });
        }

        // Verificar que el usuario solo pueda canjear beneficios para sí mismo
        // Comparar como números para evitar problemas de tipo
        const authenticatedUserId = parseInt(req.user.id, 10);
        
        if (authenticatedUserId !== parsedUserId) {
            console.log('[myBenefits] Intento de canje no autorizado:', {
                authenticatedUserId,
                parsedUserId,
                match: authenticatedUserId === parsedUserId
            });
            return res.status(403).json({ 
                ok: false, 
                message: 'No puedes canjear beneficios para otro usuario' 
            });
        }

        // Verificar si el beneficio ya fue canjeado por este usuario
        const alreadyRedeemed = await checkBenefitAlreadyRedeemed({ 
            idBenefit: parsedBenefitId, 
            idUser: parsedUserId 
        });

        if (alreadyRedeemed) {
            return res.status(409).json({ 
                ok: false, 
                message: 'Ya has canjeado este beneficio anteriormente',
                code: 'ALREADY_REDEEMED'
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

