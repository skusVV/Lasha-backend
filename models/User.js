const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: { type: String, required: true },
    personName: { type: String, required: true },
    personSurname: { type: String, required: true },
    personPhone: { type: String },
    personGmail: { type: String, required: true  },
    personPassword: { type: String, required: true },
    role:  { type: String, required: true },
    favorites: [ Number ]
});

module.exports = mongoose.model('Users', userSchema);