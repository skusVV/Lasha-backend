const { uuid, readUsers } = require("../helpers");
const Users = require("../models/User");

const usersRouter = (app) => {
  app.get("/api/users", async (req, res) => {
    const users = await Users.find({});

    return res.send(users);
  });

  app.post("/api/users", async (req, res) => {
    const { body } = req;
    const users = await Users.find({});

    const alreadyExist = users.find(
      (item) => item.personGmail === body.personGmail
    );

    if (alreadyExist) {
      return res.status(404).end();
    }
    // It should also have a validation.
    const user = new Users({
      id: uuid(),
      personName: body.personName,
      personSurname: body.personSurname,
      personPhone: body.personPhone,
      personGmail: body.personGmail,
      personPassword: body.personPassword,
      role: "User", //TODO It is not ok to save ppassword un-encrypted
    });
    await user.save();
    // WE should check if there is such user or not.
    // writeUser(user);

    return res.send(user);
  });

  app.post("/api/login", async (req, res) => {
    const { body } = req;
    const users = await Users.find({});
    const user = users.find((item) => item.personGmail === body.email);

    if (!user || user.personPassword !== body.password) {
      return res.send({ isLogged: false });
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
    const { userId, carId } = req;
    const users = await Users.find({});
    const user = users.find((item) => item.favorites === body.favorites);

    const isAlreadyExists = user.favorites.some(
      (item) => item === Number(carId)
    );

    if (isAlreadyExists) {
      user.favorites = user.favorites.filter((item) => item !== Number(carId));
    } else {
      user.favorites.push(Number(carId));
    }
    const newUsers = users.map((item) => {
      if (item.id === Number(userId)) {
        return user;
      } else {
        return item;
      }
    });
    modifyUsers(newUsers);
    res.send(user);
  });

  app.get("/api/user/favorites", async (req, res) => {
    const { userId } = req;
    const users = await Users.find({});
    const user = users.find((item) => item.id === Number(body.id));

    if (user.favorites.length === 0) {
      return res.send([]);
    }

    const cars = readCars();
    const userCars = cars.filter((car) => user.favorites.includes(car.id));

    return res.send(userCars);
  });
};

module.exports = { usersRouter, readUsers };
