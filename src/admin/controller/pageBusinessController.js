import {
    getBusiness,
    createBusiness,
    updateBusiness,
    deleteBusiness
} from '../model/pageBusinessModel.js';
import {
    validateLimitOffset
} from '../../helpers/validateLimitOffset.js';
import {
    validateBusinessFields,
    validatePartialBusinessFields
} from '../../helpers/validateBusinessFields.js';
import { uploadToSupabaseBusiness, deleteFromSupabaseBusiness } from "../../services/supabaseStorage.js";

export async function getBusinessController(req, res, next) {
    try {
        let { limit, offset } = req.query;

        limit = limit ? parseInt(limit, 10) : 10;
        offset = offset ? parseInt(offset, 10) : 0;

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

export async function uploadBusinessImageController(req, res, next) {
    try {
        const allowedMimes = ['image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml', 'image/png', 'image/gif'];
        const maxSize = 5 * 1024 * 1024;

        if (!req.body || !req.body.image || !req.body.fileName || !req.body.mimeType) {
            return res.status(400).json({ 
                error: 'Faltan datos requeridos. Se necesita: image (base64), fileName y mimeType.'
            });
        }

        // Validate fileName to prevent path traversal attacks
        const fileName = req.body.fileName;
        if (typeof fileName !== 'string' || fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
            return res.status(400).json({ 
                error: 'Nombre de archivo inválido.' 
            });
        }

        if (fileName.length > 255) {
            return res.status(400).json({ 
                error: 'Nombre de archivo demasiado largo (máximo 255 caracteres).' 
            });
        }

        if (!allowedMimes.includes(req.body.mimeType)) {
            return res.status(400).json({ 
                error: 'Tipo de archivo no permitido. Solo se aceptan JPG, JPEG, WEBP, SVG, PNG y GIF.' 
            });
        }

        let base64Data = req.body.image;
        if (base64Data.includes('base64,')) {
            base64Data = base64Data.split('base64,')[1];
        }

        const fileBuffer = Buffer.from(base64Data, 'base64');

        if (fileBuffer.length > maxSize) {
            return res.status(400).json({ 
                error: 'El archivo es demasiado grande. Máximo 5MB.' 
            });
        }

        const result = await uploadToSupabaseBusiness(
            fileBuffer, 
            fileName, 
            req.body.mimeType, 
            'business'
        );

        res.status(200).json({
            message: 'Imagen subida exitosamente',
            filename: result.path,
            url: result.url
        });
    } catch (err) {
        next(err);
    }
}

export async function updateBusinessController(req, res, next) {
    try {
        const businessId = parseInt(req.params.id, 10);
        const fieldsToUpdate = req.body;
        if (isNaN(businessId)) {
            return res.status(400).json({ error: 'Invalid business ID.' });
        }

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

        if (isNaN(businessId)) {
            return res.status(400).json({ error: 'Invalid business ID.' });
        }

        const deleted = await deleteBusiness(businessId);
        if (!deleted) {
            return res.status(404).json({ error: 'Negocio no encontrado' });
        }

        if (deleted.url_image_business) {
            try {
                const imagePath = deleted.url_image_business.includes('/')
                    ? deleted.url_image_business.split('/').slice(-2).join('/')
                    : deleted.url_image_business;

                await deleteFromSupabaseBusiness(imagePath);
            } catch (imgError) {
            }
        }

        res.status(200).json({ message: 'Negocio eliminado exitosamente.', business: deleted });
    }
    catch (err) {
        next(err);
    }
}