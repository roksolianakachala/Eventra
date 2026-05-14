const { supabaseAuth, supabaseAdmin } = require('../../config/db.config');

const sendRequest = async (requesterId, receiverId) => {
    const { data: existing } = await supabaseAuth
        .from('friendships')
        .select('*')
        .or(`and(requester_id.eq.${requesterId},receiver_id.eq.${receiverId}),and(requester_id.eq.${receiverId},receiver_id.eq.${requesterId})`);

    if (existing && existing.length > 0) {
        throw new Error("Запит вже існує або ви вже друзі");
    }

    const { data, error } = await supabaseAdmin
        .from('friendships')
        .insert([{ requester_id: requesterId, receiver_id: receiverId, status: 'pending' }])
        .select();

    if (error) throw new Error(`Помилка бази даних: ${error.message}`);
    return data[0];
};

const acceptRequest = async (requestId, receiverId) => {
    const { data: request, error: fetchError } = await supabaseAdmin
        .from('friendships')
        .select('*')
        .eq('id', requestId)
        .single();

    if (fetchError || !request) {
        throw new Error("Запит не знайдено");
    }

    if (request.receiver_id !== receiverId) {
        throw new Error("Ви не можете прийняти чужий запит");
    }

    if (request.status === 'accepted') {
        throw new Error("Запит вже прийнято раніше");
    }

    const { data, error } = await supabaseAdmin
        .from('friendships')
        .update({ status: 'accepted' })
        .eq('id', requestId)
        .select();

    if (error) throw new Error(`Помилка бази даних: ${error.message}`);
    return data[0];
};

module.exports = {
    sendRequest,
    acceptRequest
};