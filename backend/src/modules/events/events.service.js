const { supabaseAuth, supabaseAdmin } = require('../../config/db.config'); 

const findEvent = async (eventId) => { 
    const { data, error } = await supabaseAuth
        .from('events')
        .select('*')          
        .eq('id', eventId)    
        .single(); 

    if (error && error.code === 'PGRST116') { 
        return null; 
    }

    if (error) {
        throw new Error(`Помилка пошуку в базі: ${error.message}`); 
    }

    return data; 
};

const createNewEvent = async (creatorId, eventData) => {
    
    if (new Date(eventData.start_time) < new Date()) {
        throw new Error("Подія не може починатися в минулому часі!");
    }

    const { data, error } = await supabaseAdmin
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