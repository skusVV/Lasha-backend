const { uuid } = require("../helpers");
const Chat = require("../models/Chat");

// TODO 1
const mapChatParticipants = (chat, userId) => {
    // you should get participants;
    // Find participant that not equal to userId
    // go to user table and get this user name "name"
    return {
        ...chat,
        // name: name
    }
}

const chatRouter = (app) => {
    app.get("/api/chats", async (req, res) => {
        const { userId } = req.query;
        const response = await Chat.find({}); // TODO 2 we select all chats, but we
        // need to select only the chat if userId includes in the field participants. Hint: play around $in

        res.send(response.map(item => mapChatParticipants(item, userId)));
    });

    app.post("/api/chats", async (req, res) => {
        const { userId } = req.query; // TODO 3 we need to pass it from UI
        const chat = new Chat({
            participants: req.body.participants,
            id: uuid(),
        });

        await chat.save();
        //
        // All chats related to users;
        res.send(mapChatParticipants(chat, userId));
    });

    app.delete("/api/chats", async (req, res) => {
        const { userId } = req.query;
        // All chats related to users;
    });

    app.get("/api/messages/:chatId", async (req, res) => {
        const { chatId } = req.params;
        // All chats related to users;
    });

    app.post("/api/messages/:chatId", async (req, res) => {
        const { chatId } = req.params;
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



};

module.exports = { chatRouter };
