const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    id: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, required: true },
    authorId: { type: String, required: true },
    chatId: { type: String, required: true },
    isDeleted: { type: Boolean, required: true, default: false }
});

module.exports = mongoose.model('Messages', messageSchema);