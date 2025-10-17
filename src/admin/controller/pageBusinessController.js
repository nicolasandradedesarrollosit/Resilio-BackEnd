import {
    getBusiness,
    createBusiness,
    updateBusiness,
    findOneById,
    deleteBusiness
} from '../model/pageBusinessModel.js';
import {
    validateLimitOffset
} from '../../helpers/validateLimitOffset.js';
import {
    validateBusinessFields,
    validatePartialBusinessFields
} from '../../helpers/validateBusinessFields.js';

export async function getBusinessController(req, res, next) {
    try {
        const { limit, offset } = req.query;

        const isValid = validateLimitOffset(limit, offset);
        if (!isValid.valid) {
            return res.status(400).json({ error: isValid.message });
        }

        const business = await getBusiness(limit, offset);
        res.status(200).json(business);
    }
    catch (err) {
        next(err);
    }
}

export async function createBusinessController(req, res, next) {
    try {
        const businessData = req.body;

        const isValid = validateBusinessFields(businessData);
        if (!isValid.valid) {
            return res.status(400).json({ error: isValid.message });
        }
        
        const newBusiness = await createBusiness(businessData);
        res.status(201).json(newBusiness);
    }
    catch (err) {
        next(err);
    }
}

export async function updateBusinessController(req, res, next) {
    try {
        const businessId = parseInt(req.params.id, 10);
        const fieldsToUpdate = req.body;

        const isValid = validatePartialBusinessFields(fieldsToUpdate);
        if (!isValid.valid) {
            return res.status(400).json({ error: isValid.message });
        }

        const updatedBusiness = await updateBusiness(businessId, fieldsToUpdate);
        if (!updatedBusiness) {
            return res.status(404).json({ error: 'Negocio no encontrado' });
        }

        res.status(200).json(updatedBusiness);
    }
    catch (err) {
        next(err);
    }
}

export async function deleteBusinessController(req, res, next) {
    try {
        const businessId = parseInt(req.params.id, 10);

        const deleted = await deleteBusiness(businessId);
        if (!deleted) {
            return res.status(404).json({ error: 'Negocio no encontrado' });
        }

        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}