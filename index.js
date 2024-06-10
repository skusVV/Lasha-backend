const express = require("express");
const cors = require("cors");
const { readFileSync, writeFile } = require("fs");
const { carsRouter } = require('./cars/cars');
const {usersRouter} = require('./users/users');
const { carAttributesRouter } = require('./car-attributes/car-attributes');


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
