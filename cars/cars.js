const { uuid } = require("../helpers");
const Cars = require("../models/Car");
const Users = require("../models/User");
const { carStatuses } = require('../constants/constants');

async function getPriceDescription(car) {

  const cars = await Cars.find(
      {
        madeBy: car.madeBy,
        model: car.model,
        year: car.year,
        accidents: car.accidents,
        // millage: in range of [millage - 20%, millage+ 20%]
        // liters
        // fuelType
        id: {$ne: car.id}
      },
      {_id: 0, price: 1, id: 1}
  );

  const prices = cars.map(item => item.price);
  const totalPrices = prices.reduce((acc, cur) =>{
    return acc + cur
  }, 0);
  const avgPrice = totalPrices / prices.length;
  const normalPriceLow = avgPrice * 0.9;
  const normalHigh = avgPrice * 1.1;
  console.log(`${normalPriceLow} < ${avgPrice} < ${normalHigh}`)

  if(car.price < normalPriceLow) {
    return 'Low';
  }

  if(car.price > normalHigh) {
    return 'High';
  }

  return 'Fair'
}

const mapCarWithFavorites = (car, userFavorits) => {
  return { ...car, favorite: userFavorits.includes(car.id) };
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
    const cars = await Cars.aggregate([
        { $match : { status: carStatuses.Published }},
        { $sample: { size: 5 } }
    ]);
    const { userId } = req.query;
    const user = await Users.findOne({ id: userId });

    const response = cars
      .map((item) => mapCarWithFavorites(item, user?.favorites || []));

    return res.send(response);
  });

  app.get("/api/cars/:id", async (req, res) => {
    const { userId } = req.query;
    const { id } = req.params;
    const user = await Users.findOne({ id: userId });

    const response = await Cars.findOne({ id: id, status: carStatuses.Published });
    const priceDescription = await getPriceDescription(response._doc);
    if(!response) return res.send(null);

    return res.send(mapCarWithFavorites({...response._doc, priceDescription}, user.favorites));
  });
  //
  app.get("/api/cars", async (req, res) => {
    const { userId } = req.query;
    const user = await Users.findOne({ id: userId });

    if (user.role === "Admin") {
      const cars = await Cars.find({});
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
      interiorMaterial: body.interiorMaterial,
      techInspection: body.techInspection,
      accidents: body.accidents,
      status: body.status
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
      interiorMaterial: body.interiorMaterial,
      techInspection: body.techInspection,
      accidents: body.accidents,
      status: body.status
    };

    await Cars.updateOne(
      { id: params.id },
      {
        ...updatedCar,
      }
    );

    return res.send({ ...updatedCar, id: params.id });
  });

  app.delete("/api/cars/:id", async (req, res) => {
    const { id } = req.params;

    await Cars.deleteOne({ id: id });

    return res.send({});
  });

  app.get("/api/search", async (req, res) => {
    const filter = req.query;
    const { userId } = req.query;
    const user = await Users.findOne({ id: userId });

    let cars = await Cars.find({});

    if (filter.term) {
      cars = cars.filter(
        (car) =>
          car.madeBy.toLowerCase().includes(filter.term.toLowerCase()) ||
          car.model.toLowerCase().includes(filter.term.toLowerCase()) ||
          car.fuelType.toLowerCase().includes(filter.term.toLowerCase()) ||
          car.location.toUpperCase().includes(filter.term.toUpperCase()) ||
          car.labels.some((label) =>
            label.toLowerCase().includes(filter.term.toLowerCase())
          )
      );
    }

    if (filter.model) {
      cars = cars
        .filter(
          (car) =>
            car.madeBy.toLowerCase() === filter.model.toLowerCase() ||
            filter.model === "---"
        )
        .filter(
          (car) =>
            (car.price > filter.minPrice && car.price < filter.maxPrice) ||
            filter.maxPrice === "null"
        )
        .filter(
          (car) => car.year === Number(filter.year) || filter.year === "null"
        )
        .filter(
          (car) =>
            car.location === filter.location || filter.location === "Anywhere"
        );
    }

    return res.send(
      cars.map((item) => mapCarWithFavorites(item._doc, user.favorites))
    );
  });

  app.get("/api/favorites", async (req, res) => {
    const { userId } = req.query;
    const user = await Users.findOne({ id: userId });

    const favoriteCars = await Cars.find({ id: { $in: user.favorites } });

    return res.send(favoriteCars);
  });
};

module.exports = { carsRouter };
