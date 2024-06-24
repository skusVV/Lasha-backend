
const { uuid } = require("../helpers");
const bcrypt = require('bcrypt');
const Users = require("../models/User");
const Cars = require("../models/Car");

// await bcrypt.hash(password, saltRounds)
// await bcrypt.compare(password, hashedPassword);
// "dasa" => "dsfkgblkjtrhiowv5yn398c5mmu2598m98utx9"
// "hey" <= "dsfkgblkjtrhiowv5yn398c5mmu2598m98utx9"

const usersRouter = (app) => {
  app.get("/api/users", async (req, res) => {
    const users = await Users.find({});

    return res.send(users);
  });

  app.post("/api/users", async (req, res) => {
    const { body } = req;
    const alreadyExist = await Users.findOne({ personGmail: body.personGmail });

    if (alreadyExist) {
      return res.status(404).end();
    }
    const passwordHash = await bcrypt.hash(body.personPassword, 12);

    const user = new Users({
      id: uuid(),
      personName: body.personName,
      personSurname: body.personSurname,
      personPhone: body.personPhone,
      personGmail: body.personGmail,
      personPassword: passwordHash,
      role: "User", //TODO It is not ok to save ppassword un-encrypted
    });
    await user.save();

    return res.send(user);
  });

  app.post("/api/login", async (req, res) => {
    const { body } = req;
    const user = await Users.findOne({ personGmail: body.email });
    const isValidPassword = await bcrypt.compare(body.password, user.personPassword);

    if (!user || !isValidPassword) {
      return res.status(404).send();
    }

    return res.send({
      isLogged: true,
      name: user.personName,
      lastName: user.personSurname,
      phone: user.personPhone,
      email: user.personGmail,
      id: user.id,
      role: user.role,
      favorites: user.favorites,
    });
  });

  app.post("/api/favorite", async (req, res) => {
    const { userId, carId } = req.body;
    const user = await Users.findOne({ id: userId });
    const isAlreadyExists = user.favorites.some(item => item === carId)

    if (isAlreadyExists) {
      user.favorites = user.favorites.filter((item) => item !== carId);
    } else {
      user.favorites.push(carId);
    }
    await Users.updateOne({ id: userId }, { favorites: user.favorites });

    res.send(user);
  });

  app.get("/api/user/favorites", async (req, res) => {
    const { userId } = req.query;
    const user = await Users.findOne({ id: userId });

    if (user.favorites.length === 0) {
      return res.send([]);
    }

    // TODO write $in query.
    const cars = await Cars.find({});
    const userCars = cars.filter((car) => user.favorites.includes(car.id));

    return res.send(userCars);
  });
};

module.exports = { usersRouter };
