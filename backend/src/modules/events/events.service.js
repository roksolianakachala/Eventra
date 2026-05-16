const { supabaseAuth, supabaseAdmin } = require('../../config/db.config'); 


const getAllEvents = async (filter = {}) => {
    const { category, date, limit = 10 } = filter; 

    let query = supabaseAuth.from('events').select('*'); 

    if (category && category.trim() !== '') { 
        query = query.eq('category', category); 
    } 

    if (date && date.trim() !== '') {
        const startDay = `${date}T00:00:00.000Z`; 
        const endDay = `${date}T23:59:59.000Z`; 

        query = query.gte('start_time', startDay).lte('start_time', endDay); 
    } 

    query = query.limit(parseInt(limit)).order('start_time', { ascending: true }); 

    const { data, error } = await query; 

    if (error) {
        throw new Error(`Помилка отримання даних з бази: ${error.message}`);
    }

    return data; 
}

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

const deleteEvent = async (creatorId, eventId) => {
    const { data, error } = await supabaseAdmin
        .from('events') 
        .delete() 
        .eq('id', eventId)
        .eq('creator_id', creatorId) 
        .select(); 

    if (error) {
        throw new Error(`Помилка бази даних: ${error.message}`);
    }

    if (!data || data.length === 0) {
        throw new Error('Подію не знайдено або ви не маєте прав на її видалення'); 
    } 
    
    return data[0]; 
};

const uploadBannerImage = async (file) => { 
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `banners/${fileName}`;

    const { data, error } = await supabaseAdmin.storage
        .from('event-banners')
        .upload(filePath, file.buffer, {
            contentType: file.mimetype,
            upsert: true
        });

    if (error) {
        throw new Error(`Помилка Supabase Storage: ${error.message}`);
    }

    const { data: publicUrlData } = supabaseAdmin.storage
        .from('event-banners')
        .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
};

module.exports = { 
    getAllEvents, 
    findEvent, 
    createNewEvent,
    deleteEvent, 
    uploadBannerImage 
}; 