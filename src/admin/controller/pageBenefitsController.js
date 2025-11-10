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
        let { limit, offset } = req.query;
        
        limit = limit ? parseInt(limit, 10) : 10;
        offset = offset ? parseInt(offset, 10) : 0;
        
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

        // Asegurar que los campos opcionales tengan valores por defecto válidos
        const normalizedData = {
            name: benefitData.name,
            q_of_codes: benefitData.q_of_codes !== undefined && benefitData.q_of_codes !== null 
                ? parseInt(benefitData.q_of_codes, 10) 
                : 0,
            discount: benefitData.discount !== undefined && benefitData.discount !== null 
                ? parseInt(benefitData.discount, 10) 
                : 0,
            id_business_discount: parseInt(benefitData.id_business_discount, 10)
        };

        const validation = validateBenefitFields(normalizedData);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.message });
        }

        const businessExists = await findOneById(normalizedData.id_business_discount);
        if (!businessExists) {
            return res.status(404).json({ error: 'Negocio no encontrado' });
        }

        const newBenefit = await createBenefitModel(normalizedData);
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

        // Normalizar los campos numéricos si están presentes
        const normalizedData = { ...fieldsToUpdate };
        
        if (fieldsToUpdate.q_of_codes !== undefined) {
            normalizedData.q_of_codes = parseInt(fieldsToUpdate.q_of_codes, 10);
        }
        
        if (fieldsToUpdate.discount !== undefined) {
            normalizedData.discount = parseInt(fieldsToUpdate.discount, 10);
        }
        
        if (fieldsToUpdate.id_business_discount !== undefined) {
            normalizedData.id_business_discount = parseInt(fieldsToUpdate.id_business_discount, 10);
        }

        const validation = validatePartialBenefitFields(normalizedData);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.message });
        }

        if (normalizedData.id_business_discount) {
            const businessExists = await findOneById(normalizedData.id_business_discount);
            if (!businessExists) {
                return res.status(404).json({ error: 'Negocio no encontrado' });
            }
        }

        const updatedBenefit = await updateBenefitModel(benefitId, normalizedData);
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