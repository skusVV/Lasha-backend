const { readCars, readUsers, writeUser, modifyUsers } = require('../helpers');

const usersRouter = (app) => {
  app.get("/api/users", (req, res) => {
    const users = readUsers();

    return res.send(users);
  });

  app.post("/api/users", (req, res) => {
    const { body } = req;
    const users = readUsers();

    const alreadyExist = users.find(
      (item) => item.personGmail === body.personGmail
    );

    if (alreadyExist) {
      return res.status(404).end();
    }
    // It should also have a validation.
    const user = {
      id: users.length + 1,
      personName: body.personName,
      personSurname: body.personSurname,
      personPhone: body.personPhone,
      personGmail: body.personGmail,
      personPassword: body.personPassword,
      role: body.role, //TODO It is not ok to save ppassword un-encrypted
    };
    // WE should check if there is such user or not.
    writeUser(user);

    return res.send(user);
  });

  app.post("/api/login", (req, res) => {
    const { body } = req;
    const users = readUsers();
    const user = users.find((item) => item.personGmail === body.email);

    if (user.personPassword !== body.password) {
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
      favorites: user.favorites
    });
  });

  app.get("/api/adminPanel", (req, res) => {
    const { role } = req.query;
    if (!role || role !== "Admin") {
      return res.status(403).send("Unauthorized");
    }
    console.log("Hello Admin");
    res.send("Admin panel accessed successfully");
  });

  app.post('/api/favorite', (req, res) => {
    const { userId, carId } = req.body;
    const users = readUsers();
    const user = users.find(user => user.id === Number(userId));

    const isAlreadyExists = user.favorites.some(item => item === Number(carId))

    if(isAlreadyExists) {
      user.favorites = user.favorites.filter(item => item !== Number(carId))
    } else {
      user.favorites.push(Number(carId));
    }
    const newUsers = users.map(item => {
      if(item.id === Number(userId)) {
        return user;
      } else {
        return item;
      }
    })
    modifyUsers(newUsers)
    res.send(user);
  })

  app.get('/api/user/favorites', (req, res) => {
    const { userId } = req.query;
    const users = readUsers();
    const user = users.find(item => item.id === Number(userId));

    if(user.favorites.length === 0){
      return res.send([]);
    }

    const cars = readCars();
    const userCars = cars.filter(car => user.favorites.includes(car.id))

    return res.send(userCars);
  })
};

module.exports = { usersRouter, readUsers };
