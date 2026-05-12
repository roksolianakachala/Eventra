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

module.exports = {
    sendRequest
};