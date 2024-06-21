const mongoose = require('mongoose');

const carAttributesSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    selected: { type: Boolean, required: true },
    attributeType: { type: String, required: true },
    madeByKey: { type: String },
});

module.exports = mongoose.model('CarAttributes', carAttributesSchema);