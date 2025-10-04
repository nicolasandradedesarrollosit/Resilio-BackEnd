import { getAllEvents } from '../model/eventsModel.js';

export async function fetchAllEvents(req, res, next) {
    try {
        const events = await getAllEvents();
        
        if (!events || events.length === 0) {
            return res.status(404).json({ 
                message: 'No events found',
                data: [] 
            });
        }
        
        res.status(200).json({
            ok: true,
            data: events
        });
    } catch (err) {
        console.error('Error fetching events:', err);
        next(err);
    }
}