const { uuid } = require("../helpers");
const Cars = require('../models/Car');
const Users = require('../models/User');

const mapCarWithFavorites = (car, userFavorits) => {
  return { ...car._doc, favorite: userFavorits.includes(car.id) };
};

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

  // app.get("/api/cars/:id", (req, res) => {
  //   const { userId } = req.query;
  //   const cars = readCars();
  //   const users = readUsers();
  //   const user = users.find((item) => item.id === Number(userId));
  //   const response = cars.find((item) => item.id === Number(req.params.id));
  //   // const res = mapCarWithFavorites(response, user.favorites);
  //
  //   return res.send(mapCarWithFavorites(response, user.favorites));
  // });
  //
  // app.get("/api/cars", (req, res) => {
  //   const { userId } = req.query;
  //   const user = users.readUsers().find((user) => user.id === Number(userId));
  //   const cars = readCars();
  //
  //   if (user.role === "Admin") {
  //     return res.send(cars);
  //   } else {
  //     // USER
  //     return res.send(cars.filter((car) => car.userId === user.id));
  //   }
  // });
  //
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
  //
  // app.patch("/api/cars/:id", (req, res) => {
  //   const { body, params } = req;
  //   const { userId } = req.query;
  //
  //   const updatedCar = {
  //     id: Number(params.id),
  //     userId: Number(userId),
  //     description: body.description,
  //     img: body.imageRef,
  //     type: body.type,
  //     location: body.location,
  //     year: body.year,
  //     madeBy: body.carModel,
  //     model: body.model,
  //     price: body.price,
  //     fuelType: body.fuel,
  //     milage: body.millage,
  //     transmition: body.transmition,
  //     labels: body.labels.split(","),
  //     exterior: body.exterior,
  //     liters: body.liters,
  //     doors: body.doors,
  //     wheel: body.wheel,
  //     interiorColor: body.interiorColor,
  //     techInspection: body.techInspection,
  //     accidents: body.accidents,
  //   };
  //   const cars = readCars();
  //
  //   const newCars = cars.map((item) => {
  //     if (item.id !== updatedCar.id) {
  //       return item;
  //     } else {
  //       return updatedCar;
  //     }
  //   });
  //
  //   writeCars(newCars);
  //
  //   return res.send(newCars);
  // });
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
