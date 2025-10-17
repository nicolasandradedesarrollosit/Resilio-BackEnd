import { 
    getEventsModelimit,
    deleteEventModel,
    updateEventModel,   
    createEventModel
} from "../model/pageEventsModel.js";
import { validateUserReq } from "../util/validateUserReq.js";
import { validateEventReq, validatePartialEventReq } from "../util/validateEventReq.js";
import { uploadToSupabase, deleteFromSupabase } from "../util/supabaseStorage.js";

export async function getEventsController(req, res, next) {
    try {
        const { limit, offset } = req.query;
        
        const validation = validateUserReq(req);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.message });
        }

        const events = await getEventsModelimit( limit, offset );
        res.status(200).json(events);
    } catch (err) {
        next(err);
    }
}

export async function createEventController(req, res, next) {
    try {
        const eventData = req.body;
        const validation = validateEventReq(eventData);

        if (!validation.valid) return res.status(400).json({ error: validation.message });

        const newEvent = await createEventModel(eventData);
        res.status(201).json(newEvent);
    } catch (err) {
        next(err);
    }
}

export async function updateEventController(req, res, next) {
    try {
        const eventId = parseInt(req.params.id, 10);
        const fieldsToUpdate = req.body;

        if (isNaN(eventId)) {
            return res.status(400).json({ error: 'Invalid event ID.' });
        }

        const validation = validatePartialEventReq(fieldsToUpdate);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.message });
        }

        const updatedEvent = await updateEventModel(eventId, fieldsToUpdate);
        if (!updatedEvent) {
            return res.status(404).json({ error: 'Event not found.' });
        }

        res.status(200).json(updatedEvent);
    } catch (err) {
        next(err);
    }
}

export async function deleteEventController(req, res, next) {
    try {
        const eventId = parseInt(req.params.id, 10);

        if (isNaN(eventId)) {
            return res.status(400).json({ error: 'Invalid event ID.' });
        }

        const deletedEvent = await deleteEventModel(eventId);
        if (!deletedEvent) {
            return res.status(404).json({ error: 'Event not found.' });
        }

        if (deletedEvent.url_image_event) {
            try {
                const imagePath = deletedEvent.url_image_event.includes('/')
                    ? deletedEvent.url_image_event.split('/').slice(-2).join('/')
                    : deletedEvent.url_image_event;
                
                console.log('🗑️ Eliminando imagen de Supabase:', imagePath);
                await deleteFromSupabase(imagePath);
                console.log('✅ Imagen eliminada de Supabase');
            } catch (imgError) {
                console.error('⚠️ Error al eliminar imagen de Supabase:', imgError.message);
            }
        }

        res.status(200).json({ message: 'Event deleted successfully.', event: deletedEvent });
    } catch (err) {
        next(err);
    }
}

export async function uploadEventImageController(req, res, next) {
    try {
        console.log('📝 Datos recibidos:', {
            hasBody: !!req.body,
            bodyKeys: req.body ? Object.keys(req.body) : [],
            hasImage: !!req.body?.image,
            hasFileName: !!req.body?.fileName,
            hasMimeType: !!req.body?.mimeType,
            imageLength: req.body?.image?.length
        });

        const allowedMimes = ['image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml', 'image/png', 'image/gif'];
        const maxSize = 5 * 1024 * 1024;

        if (!req.body || !req.body.image || !req.body.fileName || !req.body.mimeType) {
            return res.status(400).json({ 
                error: 'Faltan datos requeridos. Se necesita: image (base64), fileName y mimeType.',
                received: req.body ? Object.keys(req.body) : []
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

        console.log('📤 Subiendo a Supabase...', {
            fileName: req.body.fileName,
            mimeType: req.body.mimeType,
            bufferSize: fileBuffer.length
        });

        const result = await uploadToSupabase(
            fileBuffer, 
            req.body.fileName, 
            req.body.mimeType, 
            'events'
        );

        console.log('✅ Imagen subida exitosamente:', result);

        res.status(200).json({
            message: 'Imagen subida exitosamente',
            filename: result.path,
            url: result.url
        });
    } catch (err) {
        console.error('❌ Error al subir imagen:', {
            message: err.message,
            stack: err.stack,
            body: req.body ? Object.keys(req.body) : 'no body'
        });
        res.status(500).json({ 
            error: 'Error al subir la imagen',
            details: err.message 
        });
    }
}
