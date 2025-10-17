import {
    getBusiness,
    createBusiness,
    updateBusiness,
    findOneById,
    deleteBusiness
} from '../model/pageBusinessModel.js';

export async function getBusinessController(req, res, next) {
    try {
        const { limit, offset } = req.query;

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