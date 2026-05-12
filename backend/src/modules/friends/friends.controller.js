const friendsService = require('./friends.service');

const sendFriendRequest = async (req, res) => {
    try {
        const requesterId = req.user.id; 
        const receiverId = req.params.receiverId; 

        if (requesterId === receiverId) {
            return res.status(400).json({ status: "error", message: "Не можна додати самого себе" });
        }

        const newRequest = await friendsService.sendRequest(requesterId, receiverId);
        
        res.status(201).json({ 
            status: "success", 
            message: "Запит у друзі надіслано",
            data: newRequest 
        });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};

module.exports = {
    sendFriendRequest
};