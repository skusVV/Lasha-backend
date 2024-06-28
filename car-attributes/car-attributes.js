const { uuid } = require("../helpers");
const CarAttribute = require("../models/CarAttribute");

// function uuid() {
//   var dt = new Date().getTime();
//   var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
//     /[xy]/g,
//     function (c) {
//       var r = (dt + Math.random() * 16) % 16 | 0;
//       dt = Math.floor(dt / 16);
//       return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
//     }
//   );
//
//   return uuid;
// }

// const readCarAttributes = () => {
//   const data = readFileSync("./car-attributes/car-attributes.json");
//
//   return JSON.parse(data);
// };

// const writeAttributes = (attributes) => {
//   writeFile(
//     "./car-attributes/car-attributes.json",
//     JSON.stringify(attributes),
//     (err) => {
//       if (err) {
//         console.log("Failed to write updated data to file");
//         return;
//       }
//       console.log("Updated file successfully");
//     }
//   );
// };

const carAttributesRouter = (app) => {
  app.get("/api/car-attributes/:attributeType", async (req, res) => {
    const { attributeType } = req.params;
    const attributes = await CarAttribute.find({
      attributeType: attributeType,
    });

    res.send(attributes);
  });

  app.post("/api/car-attributes/:attributeType", async (req, res) => {
    const { value, madeByKey } = req.body;
    const { attributeType } = req.params;
    if (!value) return res.status(400).send("Value is required");

    const carAttribute = new CarAttribute({
      id: uuid(),
      name: value,
      selected: false,
      attributeType: attributeType,
      madeByKey: madeByKey ? madeByKey : null,
    });

    await carAttribute.save();
    const attributes = await CarAttribute.find({
      attributeType: attributeType,
    });

    return res.send(attributes);
  });

  app.delete("/api/car-attributes/manufacturer/:id", async (req, res) => {
    const attributeId = req.params.id;
    try {
      await CarAttribute.findByIdAndDelete(attributeId);
      const attributes = await CarAttribute.find({
        attributeType: "manufacturer",
      });
      res.send(attributes);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  });

  app.delete("/api/car-attributes/carModel/:id", async (req, res) => {
    const attributeId = req.params.id;
    try {
      await CarAttribute.findByIdAndDelete(attributeId);
      const attributes = await CarAttribute.find({ attributeType: "carModel" });
      res.send(attributes);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  });

  app.delete("/api/car-attributes/engine-capacity/:id", async (req, res) => {
    const attributeId = req.params.id;
    try {
      await CarAttribute.findByIdAndDelete(attributeId);
      const attributes = await CarAttribute.find({
        attributeType: "engine-capacity",
      });
      res.send(attributes);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  });

  app.delete("/api/car-attributes/locations/:id", async (req, res) => {
    const attributeId = req.params.id;
    try {
      await CarAttribute.findByIdAndDelete(attributeId);
      const attributes = await CarAttribute.find({
        attributeType: "locations",
      });
      res.send(attributes);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  });
};

module.exports = { carAttributesRouter };
