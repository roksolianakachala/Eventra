const express = require('express');
const router = express.Router();

const authenticate = require('../../middlewares/auth.middleware');
const friendsController = require('./friends.controller.js');


router.post('/request/:receiverId', authenticate, friendsController.sendFriendRequest);

module.exports = router;