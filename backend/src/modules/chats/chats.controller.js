const chatsService = require("./chats.service");

function handleError(res, error) {
  const status = error.status || 500;

  res.status(status).json({
    status: "error",
    message: error.message || "Помилка сервера",
  });
}

async function getChats(req, res) {
  try {
    const chats = await chatsService.getChats(req.user.id);

    res.json({
      status: "success",
      data: chats,
    });
  } catch (error) {
    handleError(res, error);
  }
}

async function getMessages(req, res) {
  try {
    const messages = await chatsService.getMessages(req.user.id, req.params.chatId, {
      limit: req.query.limit,
      before: req.query.before,
    });

    res.json({
      status: "success",
      data: messages,
    });
  } catch (error) {
    handleError(res, error);
  }
}

async function sendMessage(req, res) {
  try {
    const message = await chatsService.sendMessage(
      req.user.id,
      req.params.chatId,
      req.body.content
    );

    res.status(201).json({
      status: "success",
      data: message,
    });
  } catch (error) {
    handleError(res, error);
  }
}

async function markAsRead(req, res) {
  try {
    const result = await chatsService.markAsRead(req.user.id, req.params.chatId);

    res.json({
      status: "success",
      data: result,
    });
  } catch (error) {
    handleError(res, error);
  }
}

async function findOrCreateChat(req, res) {
  try {
    const chat = await chatsService.findOrCreateChat(req.user.id, req.body.participantId);

    res.status(chat.created ? 201 : 200).json({
      status: "success",
      data: chat,
    });
  } catch (error) {
    handleError(res, error);
  }
}

module.exports = {
  findOrCreateChat,
  getChats,
  getMessages,
  markAsRead,
  sendMessage,
};
