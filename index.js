const express = require("express");
const cors = require("cors");
const { readFileSync, writeFile } = require("fs");
const { carsRouter } = require('./cars/cars');
const {usersRouter} = require('./users/users');
const { carAttributesRouter } = require('./car-attributes/car-attributes');
const mongoose = require("mongoose");

const MONGO_URI = 'mongodb://localhost:27017/cars';

const app = express();

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.use(cors());

app.get("/api/test", (req, res) => {
  return res.send("Hey");
});

carsRouter(app);
usersRouter(app);
carAttributesRouter(app);


app.listen(3001, () => {
  console.log("Server started on the port 3001");
});

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });