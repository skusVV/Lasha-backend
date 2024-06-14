const { uuid } = require('../helpers');
const Users = require('../models/User');

// Users.find
// Users.findOne
// Users.updateOne

const usersRouter = (app) => {
  app.get("/api/users", async (req, res) => {
    const users = await Users.find({ }); // find return []

    return res.send(users);
  });

  app.post("/api/users", async (req, res) => {
    const { body } = req;
    const userAlreadyExist = await Users.findOne({ personGmail: body.personGmail}); // returns {}

    if (userAlreadyExist) {
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
      role: 'User', //TODO It is not ok to save ppassword un-encrypted
    });
    await user.save();

    return res.send(user);
  });

  app.post("/api/login", async (req, res) => {
    const { body } = req;
    const user = await Users.findOne({ personGmail: body.email});

    if (!user || user.personPassword !== body.password) {
      return res.status(404).end();
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

  app.post('/api/favorite', async (req, res) => {
    const { userId, carId } = req.body;

    const user = await Users.findOne({ id: userId });
    const isAlreadyExists = user.favorites.some(item => item === carId)

    if(isAlreadyExists) {
      user.favorites = user.favorites.filter(item => item !== carId)
    } else {
      user.favorites.push(carId);
    }
    await Users.updateOne({ id: userId },  { favorites: user.favorites });

    res.send(user);
  })

  app.get('/api/user/favorites', async (req, res) => {
    const { userId } = req.query;
    const user = await Users.findOne({ id: userId });

    if(user.favorites.length === 0){
      return res.send([]);
    }

    const cars = readCars();
    const userCars = cars.filter(car => user.favorites.includes(car.id))

    return res.send(userCars);
  })
};

module.exports = { usersRouter };
