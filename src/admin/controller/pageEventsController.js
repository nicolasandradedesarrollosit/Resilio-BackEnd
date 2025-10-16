import { 
    getEventsModelimit,
    deleteEventModel,
    updateEventModel,
    createEventModel
} from "../model/pageEventsModel.js";
import { validateUserReq } from "../util/validateUserReq.js";
import { validateEventReq, validatePartialEventReq } from "../util/validateEventReq.js";

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

        res.status(200).json({ message: 'Event deleted successfully.', event: deletedEvent });
    } catch (err) {
        next(err);
    }
}

export async function uploadEventImageController(req, res, next) {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No se ha proporcionado ninguna imagen.' });
        }

        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/events/${req.file.filename}`;

        res.status(200).json({
            message: 'Imagen subida exitosamente',
            filename: req.file.filename,
            url: imageUrl,
            path: req.file.path
        });
    } catch (err) {
        next(err);
    }
}
