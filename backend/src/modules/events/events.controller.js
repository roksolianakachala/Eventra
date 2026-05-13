const { supabaseAuth } = require('../../config/db.config.js'); 
const eventsService = require('./events.service');

const getEventById = async (req, res) => { 
    try { 
        const eventId = req.params.id;

        if (!eventId) {
            return res.status(400).json({ 
                status: "error", 
                message: "ID події є обов'язковим" 
            });
        }

        const event = await eventsService.findEvent(eventId); 

        if (!event) {
            return res.status(404).json({ 
                status: "error", 
                message: "Подію не знайдено" 
            });
        }

        res.status(200).json({ 
            status: "success", 
            data: event 
        });

    } catch (err) {
        console.error("Помилка при пошуку івенту:", err);
        res.status(500).json({ status: "error", message: err.message }); 
    } 
}; 

const getEvents = async (req, res) => {
    try {
        const { category, date, limit} = req.query; 
        
        const events = await eventsService.getAllEvents({ category, date, limit }); 
        return res.status(200).json({ 
            status: "success", 
            data: events 
        }); 
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message }); 
    } 
} 

const createEvent = async (req, res) => { 
    try {
        const eventData = req.body; 
        const authData = req.headers.authorization; 

        if (!authData) {
            return res.status(401).json({
                status: "error",
                message: "Need authorization header" 
            });
        } 

        const token = authData.split(" ")[1]; 
        const {data: { user }, authError} = await supabaseAuth.auth.getUser(token); 
        
        if (authError || !user) { 
            return res.status(401).json({
                status: "error",
                message: authError.message || "Invalid token"  
            });
        } 
        
        const creatorId = user.id; 
        
        if (!eventData.title || !eventData.category ||  !eventData.access_type || !eventData.start_time || !eventData.location) {
            return res.status(400).json({
                status: "error",
                message: "Відсутні обов'язкові поля"
            });
        } 

        const newEvent = await eventsService.createNewEvent(creatorId, eventData); 

        res.status(201).json({ 
            status: "success", 
            data: newEvent 
        }); 
        
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message }); 
    }
} 

const deleteEvent = async (req, res) => {
    try { 
        const eventId = req.params.id; 
        const userId = req.user.id; 

        const deletedEvent = await eventsService.deleteEvent(userId, eventId); 

        res.status(200).json({ 
            status: "success", 
            message: "Подію успішно видалено",  
            data: deletedEvent 
        }); 
    } catch (err) { 
        res.status(500).json({ status: "error", message: err.message }); 
    } 
}

module.exports = { 
    getEventById, 
    getEvents, 
    createEvent,  
    deleteEvent
}; 
