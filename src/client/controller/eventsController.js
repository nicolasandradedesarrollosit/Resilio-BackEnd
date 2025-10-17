import { getAllEvents } from '../model/eventsModel.js';

export async function fetchAllEvents(req, res, next) {
    try {
        const events = await getAllEvents();
        
        if (!events || events.length === 0) {
            return res.status(404).json({ 
                message: 'Sin eventos encontrados',
                data: [] 
            });
        }
        
        res.status(200).json({
            ok: true,
            data: events
        });
    } catch (error) {
        next(error);
    }
}