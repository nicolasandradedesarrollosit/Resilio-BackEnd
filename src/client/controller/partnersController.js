import { getAllPartners } from '../model/partnersModel.js';

export async function fetchAllPartners(req, res, next) {
    try {
        const partners = await getAllPartners();
        if (!partners || partners.length === 0) {
            return res.status(404).json({
                message: 'Sin partners encontrados',
                data: []
            });
        }
        res.status(200).json({
            ok: true,
            data: partners
        });
    }
    catch(error){
        console.error("Error enviando partners:", error);
        next(error);
    }
}