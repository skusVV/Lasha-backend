const { uuid } = require("../helpers");
const Chat = require("../models/Chat");
const User = require("../models/User");
const Message = require("../models/Message");

// TODO 1
const mapChatParticipants = async (chat, userId) => {
  console.log("dawdaw");
  const participantIds = chat.participants.filter((id) => id !== userId);
  console.log(1);
  const participants = await User.find(
    { id: { $in: participantIds } },
    { personName: 1, personSurname: 1, _id: 0 }
  );
  console.log(2);
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
    // if(!userId) {
    //   return res.send([]);
    // }
    // TODO 2 we select all chats, but we
    const chats = await Chat.find(
      {
        participants: { $in: [userId] },
      },
      { _id: 0 }
    );
    // console.log('dawdawdaw', chats)
    //   if(chats.length === 0) {
    //     return res.send([]);
    //   }
    const response = await Promise.all(
      chats.map((chat) => mapChatParticipants(chat._doc, userId))
    );
    res.send(response);
  });

  // TODO test it later
  app.post("/api/chats", async (req, res) => {
    const { userId } = req.query; // TODO 3 we need to pass it from UI
    const chat = new Chat({
      participants: req.body.participants,
      id: uuid(),
    });

    await chat.save();
    //
    // All chats related to users;
    res.send(mapChatParticipants(chat._doc, userId));
  });

  app.delete("/api/chats", async (req, res) => {
    const { userId } = req.query;
    // All chats related to users;
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
    });

    await message.save();

    res.send(message);
    // All chats related to users;
  });

  app.delete("/api/messages/:chatId", async (req, res) => {
    const { chatId } = req.params;
    // All chats related to users;
  });

  app.patch("/api/messages/:chatId", async (req, res) => {
    const { chatId } = req.params;
    // All chats related to users;
  });

  app.patch("/api/messages/:chatId/:messageId", async (req, res) => {
    const { chatId, messageId } = req.params;
    const { content } = req.body;

    const updatedMessage = await Message.findOneAndUpdate(
      { chatId, id: messageId },
      { content },
      { new: true }
    );

    res.send(updatedMessage);
  });
};

module.exports = { chatRouter };
