const eventsService = require('./events.service');

const getEventById = (req, res) => {
    try { 
        const eventId = parseInt(req.params.id);

        if (isNaN(eventId)) {
            return res.status(400).json({ 
                status: "error", 
                message: "ID події має бути числом" 
            });
        }

        const event = eventsService.findEvent(eventId);

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

    } catch (error) {
        res.status(500).json({ status: "error", message: "Помилка сервера" });
    }
}; 

const createEvent = async (req, res) => { 
    try {
        const eventData = req.body; 

        if (!eventData.title || !eventData.category ||  !eventData.access_type || !eventData.start_time || !eventData.location) {
            return res.status(400).json({
                status: "error",
                message: "Відсутні обов'язкові поля"
            });
        } 

        const creatorId = "123e4567-e89b-12d3-a456-426614174000"; // ТИМЧАСОВО, замінити на реальний ID користувача після реалізації аутентифікації 
        
        const newEvent = await eventsService.createNewEvent(creatorId, eventData); 

        res.status(201).json({ 
            status: "success", 
            data: newEvent 
        }); 
        
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message }); 
    }
} 

module.exports = { 
    getEventById, 
    createEvent 
}; 
