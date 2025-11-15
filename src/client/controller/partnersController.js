import { getAllPartners } from '../model/partnersModel.js';

export async function fetchAllPartners(req, res, next) {
    try {
        // Si el usuario está autenticado, pasar su ID para incluir info de canjeados
        const userId = req.user?.id || null;
        
        const partners = await getAllPartners(userId);
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
        next(error);
    }
}