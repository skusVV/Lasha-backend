const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    id: { type: String, required: true },
    participants: [{ type: String, required: true }]
});

module.exports = mongoose.model('Chats', chatSchema);
