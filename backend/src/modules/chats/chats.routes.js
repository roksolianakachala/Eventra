const express = require("express");
const authenticate = require("../../middlewares/auth.middleware");
const chatsController = require("./chats.controller");

const router = express.Router();

router.use(authenticate);

router.get("/", chatsController.getChats);
router.post("/find-or-create", chatsController.findOrCreateChat);
router.get("/:chatId/messages", chatsController.getMessages);
router.post("/:chatId/messages", chatsController.sendMessage);
router.patch("/:chatId/read", chatsController.markAsRead);

module.exports = router;
