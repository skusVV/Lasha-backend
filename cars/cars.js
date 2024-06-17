const { uuid } = require("../helpers");
const Cars = require('../models/Car');
const Users = require('../models/User');

const mapCarWithFavorites = (car, userFavorits) => {
  return { ...car._doc, favorite: userFavorits.includes(car.id) };
};
// There are 3 ways how to pass info to backned:
//  req.query --- api/v1/test?someQuery=anything
//  req.body  --- when request has body. POST, PUT request
//  req.params --- "/api/cars/:id" - on server; on ui-  "/api/cars/11"

const carsRouter = (app) => {

  app.get("/api/cars-test", async (req, res) => {
    const cars = await Cars.find({});
    return res.send(cars);
  });

  app.get("/api/random-cars", async (req, res) => {
    const cars = await Cars.find({}).limit(5);
    const { userId } = req.query;
    const user = await Users.findOne({ id: userId });

    const response = cars
      .sort(() => Math.random() - Math.random())
      .map((item) => mapCarWithFavorites(item, user?.favorites || []));

    return res.send(response);
  });

  app.get("/api/cars/:id", async (req, res) => {
    const { userId } = req.query;
    const { id } = req.params;
    const user = await Users.findOne({ id: userId });
    const response = await Cars.findOne({ id: id })

    return res.send(mapCarWithFavorites(response, user.favorites));
  });
  //
  app.get("/api/cars", async (req, res) => {
    const { userId } = req.query;
    const user = await Users.findOne({ id: userId });

    if (user.role === "Admin") {
      const cars = await Cars.find({ });
      return res.send(cars);
    } else {
      const cars = await Cars.find({ userId: userId });

      return res.send(cars);
    }
  });

  app.post("/api/cars", async (req, res) => {
    const { body } = req;
    const { userId } = req.query;

    const car = new Cars({
      id: uuid(),
      userId: userId,
      description: body.description,
      img: body.imageRef,
      type: body.carModel,
      location: body.location,
      year: Number(body.year),
      madeBy: body.carMadeBy,
      model: body.model,
      price: Number(body.price),
      fuelType: body.fuel,
      milage: body.millage,
      transmition: body.transmition,
      labels: body.labels.split(","),
      exterior: body.exterior,
      liters: body.liters,
      doors: body.doors,
      wheel: body.wheel,
      interiorColor: body.interiorColor,
      techInspection: body.techInspection,
      accidents: body.accidents,
    });

    await car.save();

    return res.send(car);
  });

  app.patch("/api/cars/:id", async (req, res) => {
    const { body, params } = req;
    const { userId } = req.query;

    const updatedCar = {
      description: body.description,
      img: body.imageRef,
      type: body.type,
      location: body.location,
      year: body.year,
      madeBy: body.carModel,
      model: body.model,
      price: body.price,
      fuelType: body.fuel,
      milage: body.millage,
      transmition: body.transmition,
      labels: body.labels.split(","),
      exterior: body.exterior,
      liters: body.liters,
      doors: body.doors,
      wheel: body.wheel,
      interiorColor: body.interiorColor,
      techInspection: body.techInspection,
      accidents: body.accidents,
    };

    await Cars.updateOne({ id: params.id }, {
      ...updatedCar
    });

    return res.send({...updatedCar, id: params.id });
  });
  //
  // app.delete("/api/cars/:id", (req, res) => {
  //   const { params } = req;
  //   const carId = Number(params.id);
  //   const cars = readCars();
  //   const newCars = cars.filter((car) => {
  //     if (car.id === carId) {
  //       return false;
  //     } else {
  //       return true;
  //     }
  //   });
  //
  //   writeCars(newCars);
  //
  //   return res.send({});
  // });
  //
  // app.get("/api/search", (req, res) => {
  //   const filter = req.query;
  //   const { userId } = req.query;
  //   const users = readUsers();
  //   const user = users.find((item) => item.id === Number(userId));
  //
  //   let newCars = readCars();
  //   // console.log('car', newCars)
  //   if (filter.term) {
  //     newCars = newCars.filter(
  //       (car) =>
  //         car.madeBy.toLowerCase().includes(filter.term.toLowerCase()) ||
  //         car.model.toLowerCase().includes(filter.term.toLowerCase()) ||
  //         car.fuelType.toLowerCase().includes(filter.term.toLowerCase()) ||
  //         car.location.toUpperCase().includes(filter.term.toUpperCase()) ||
  //         car.labels.some((label) =>
  //           label.toLowerCase().includes(filter.term.toLowerCase())
  //         )
  //     );
  //   }
  //
  //   if (filter.model) {
  //     newCars = newCars
  //       .filter(
  //         (car) =>
  //           car.madeBy.toLowerCase() === filter.model.toLowerCase() ||
  //           filter.model === "---"
  //       )
  //       .filter(
  //         (car) =>
  //           (car.price > filter.minPrice && car.price < filter.maxPrice) ||
  //           filter.maxPrice === "null"
  //       )
  //       .filter(
  //         (car) => car.year === Number(filter.year) || filter.year === "null"
  //       )
  //       .filter(
  //         (car) =>
  //           car.location === filter.location || filter.location === "Anywhere"
  //       );
  //   }
  //
  //   return res.send(newCars.map(item => mapCarWithFavorites(item, user.favorites)));
  // });
  //
  // app.get("/api/favorites", (res) => {
  //   const { userId } = req.query;
  //   const user = users.readUsers().find((user) => user.id === Number(userId));
  //   let favoriteCars = readCars();
  //
  //   if (filter.term) {
  //     favoriteCars = favoriteCars.filter((car) =>
  //       user.favorites.includes(car.id)
  //     );
  //   }
  //   console.log("cheese");
  //   return res.send(favoriteCars);
  // });
};

module.exports = { carsRouter };
