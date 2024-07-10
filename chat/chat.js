const { uuid } = require("../helpers");
const Chat = require("../models/Chat");
const User = require("../models/User");
const Message = require("../models/Message");

// TODO 1
const mapChatParticipants = async (chat, userId) => {
  const participantIds = chat.participants.filter((id) => id !== userId);
  const participants = await User.find(
    { id: { $in: participantIds } },
    { personName: 1, personSurname: 1, _id: 0 }
  );

  return {
    id: chat.id,
    participants: chat.participants,
    name: participants
      .map((p) => `${p.personName} ${p.personSurname}`)
      .join(", "),
  };
};

const chatRouter = (app) => {
  app.get("/api/chats", async (req, res) => {
    const { userId } = req.query;
    const chats = await Chat.find(
      {
        participants: { $in: [userId] },
      },
      { _id: 0 }
    );
    const response = await Promise.all(
      chats.map((chat) => mapChatParticipants(chat._doc, userId))
    );
    res.send(response);
  });


  app.post("/api/chats", async (req, res) => {
    const { userId } = req.query; // TODO 3 we need to pass it from UI
    const chat = new Chat({
      participants: req.body.participants,
      id: uuid(),
    });

    await chat.save();
    // console.log('chat._doc', chat._doc)
    const response = await mapChatParticipants(chat._doc, userId)

    res.send(response);
  });

  app.delete("/api/chats/:chatId", async (req, res) => {
    const { chatId } = req.params;

    await Chat.deleteOne({ id: chatId });
    await Message.deleteMany({ chatId: chatId });

    res.send(null);
  });

  app.get("/api/messages/:chatId", async (req, res) => {
    const { chatId } = req.params;

    const messages = await Message.find({ chatId });

    res.send(messages);
  });

  app.post("/api/messages/:chatId", async (req, res) => {
    const { chatId } = req.params;
    const { userId } = req.query;
    const { content } = req.body;

    const message = new Message({
      id: uuid(),
      content,
      createdAt: Date.now(),
      authorId: userId,
      chatId,
      isDeleted: false,
    });

    await message.save();

    res.send(message);
    // All chats related to users;
  });

  app.patch("/api/messages/:messageId", async (req, res) => {
    const { messageId } = req.params;
    const { content } = req.body;
    // const { userId } = req.query;
    // Double-check that you are an author of the message.

    const updatedMessage = await Message.findOneAndUpdate(
      { id: messageId },
      { content },
      { new: true }
    );

    res.send(updatedMessage);
  });

  app.delete("/api/messages/:messageId", async (req, res) => {
    const { messageId } = req.params;
    // const { content } = req.body;

    await Message.findOneAndUpdate(
        { id: messageId },
        { isDeleted: true },
        { new: true }
    );

    res.send(null);
  });
};

module.exports = { chatRouter };
