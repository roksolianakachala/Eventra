const supabase = require('../../config/db.config');

const createNewEvent = async (creatorId, eventData) => {
    
    if (new Date(eventData.start_time) < new Date()) {
        throw new Error("Подія не може починатися в минулому часі!");
    }

    const { data, error } = await supabase
        .from('events') 
        .insert([
            {
                creator_id: creatorId, 
                title: eventData.title,
                category: eventData.category,
                access_type: eventData.access_type,
                start_time: eventData.start_time,
                location: eventData.location,

                end_time: eventData.end_time || null,
                description: eventData.description || null,
                price: eventData.price || null,
                capacity: eventData.capacity || null,
                format: eventData.format || null,
                banner_url: eventData.banner_url || null
            }
        ])
        .select(); 

    if (error) {
        throw new Error(`Помилка бази даних: ${error.message}`);
    }

    return data[0]; 
};

module.exports = { 
    createNewEvent 
}; 