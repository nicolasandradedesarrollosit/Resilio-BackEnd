import {
    getBenefitModel,
    createBenefitModel,
    updateBenefitModel,
    deleteBenefitModel
} from '../model/pageBenefitsModel.js';
import {
    findOneById
} from '../model/pageBusinessModel.js';
import { 
    validateLimitOffset
} from '../../helpers/validateLimitOffset.js';
import {
    validateBenefitFields,
    validatePartialBenefitFields
} from '../../helpers/validaBenefitFields.js';

export async function getBenefitsController(req, res, next) {
    try {
        const { limit, offset } = req.query;
        
        const isValid = validateLimitOffset(limit, offset);
        if (!isValid.valid) {
            return res.status(400).json({ error: isValid.message });
        }

        const benefits = await getBenefitModel(limit, offset);
        res.status(200).json(benefits);
    }
    catch (err) {
        next(err);
    }
}

export async function createBenefitController(req, res, next) {
    try {
        const benefitData = req.body;

        const validation = validateBenefitFields(benefitData);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.message });
        }

        const businessExists = await findOneById(benefitData.id_business_discount);
        if (!businessExists) {
            return res.status(404).json({ error: 'Negocio no encontrado' });
        }

        const newBenefit = await createBenefitModel(benefitData);
        res.status(201).json(newBenefit);
    }
    catch (err) {
        next(err);
    }
}

export async function updateBenefitController(req, res, next) {
    try {
        const benefitId = parseInt(req.params.id, 10);
        const fieldsToUpdate = req.body;

        if (isNaN(benefitId)) {
            return res.status(400).json({ error: 'ID de beneficio inválido' });
        }

        const validation = validatePartialBenefitFields(fieldsToUpdate);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.message });
        }

        if (fieldsToUpdate.id_business_discount) {
            const businessExists = await findOneById(fieldsToUpdate.id_business_discount);
            if (!businessExists) {
                return res.status(404).json({ error: 'Negocio no encontrado' });
            }
        }

        const updatedBenefit = await updateBenefitModel(benefitId, fieldsToUpdate);
        if (!updatedBenefit) {
            return res.status(404).json({ error: 'Beneficio no encontrado' });
        }

        res.status(200).json(updatedBenefit);
    }
    catch (err) {
        next(err);
    }
}

export async function deleteBenefitController(req, res, next) {
    try {
        const benefitId = parseInt(req.params.id, 10);
        
        if (isNaN(benefitId)) {
            return res.status(400).json({ error: 'ID de beneficio inválido' });
        }

        const deleted = await deleteBenefitModel(benefitId);
        if (!deleted) {
            return res.status(404).json({ error: 'Beneficio no encontrado' });
        }
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}