const mongoose = require('mongoose');
const { carStatuses } = require('../constants/constants');

const carSchema = new mongoose.Schema({
    id: { type: String, required: true },
    userId: { type: String, required: true },
    description: { type: String },
    img: { type: String },
    type: { type: String },
    location: { type: String  },
    year: { type: Number },
    madeBy:  { type: String, required: true },
    model:  { type: String, required: true },
    price:  { type: Number, required: true },
    currency:  { type: String },
    fuelType:  { type: String },
    milage:  { type: String },
    transmition:  { type: String},
    labels:  [ { type: String } ],
    exterior:  { type: String },
    liters:  { type: String },
    doors:  { type: String },
    wheel:  { type: String },
    interiorColor:  { type: String },
    interiorMaterial:  { type: String },
    techInspection:  { type: String },
    accidents:  { type: String },
    status:  { type: String, required: true, default: carStatuses.Draft },
});

module.exports = mongoose.model('Cars', carSchema);