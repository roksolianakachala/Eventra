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

const acceptFriendRequest = async (req, res) => {
    try {
        const receiverId = req.user.id; // Той, хто приймає запит (поточний юзер)
        const requestId = req.params.requestId; // ID самого запиту з URL

        const updatedRequest = await friendsService.acceptRequest(requestId, receiverId);
        
        res.status(200).json({ 
            status: "success", 
            message: "Запит у друзі прийнято",
            data: updatedRequest 
        });
    } catch (err) {
        res.status(400).json({ status: "error", message: err.message });
    }
};

module.exports = {
    sendFriendRequest,
    acceptFriendRequest
};