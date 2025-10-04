import getAllEvents from '../model/eventsModel.js';

export async function fetchAllEvents(req, res, next) {
    try{
        const events = getAllEvents();
        if(!events) return res.status(404).json({ message: 'No events found' });
        res.status(200).json(events);
    }
    catch(err){
        console.error(err);
        res.status(500).json({ message: 'Server error' });
        next(err);
    }
}