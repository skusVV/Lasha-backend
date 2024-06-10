const { readFileSync, writeFile } = require("fs");

const readCars = () => {
    const data = readFileSync("./cars/cars.json");

    return JSON.parse(data);
};

const writeCar = (car) => {
    const cars = readCars();
    const newCars = [...cars, car];
    writeFile("./cars.json", JSON.stringify(newCars), (err) => {
      if (err) {
        console.log("Failed to write updated data to file");
        return;
      }
      console.log("Updated file successfully");
    });
  };

const writeCars = (cars) => {
    writeFile("./cars.json", JSON.stringify(cars), (err) => {
        if (err) {
        console.log("Failed to write updated data to file");
        return;
        }
        console.log("Updated file successfully");
    });
};

const readUsers = () => {
    const data = readFileSync("./users/users.json");
  
    return JSON.parse(data);
  };
  
const writeUser = (user) => {
const users = readUsers();
const newUsers = [...users, user];
writeFile("./users/users.json", JSON.stringify(newUsers), (err) => {
    if (err) {
    console.log("[USERS] Failed to write updated data to file");
    return;
    }
    console.log("[USERS] Updated file successfully");
});
};

const modifyUsers = newUsers => {
    writeFile("./users/users.json", JSON.stringify(newUsers), (err) => {
        if (err) {
        console.log("[USERS] Failed to write updated data to file");
        return;
        }
        console.log("[USERS ---] Updated file successfully");
    });
};

function uuid() {
    var dt = new Date().getTime();
    var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
            var r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
        }
    );

    return uuid;
}

  module.exports = { 
    readCars,
    writeCar,
    writeCars,
    readUsers,
    writeUser,
    modifyUsers,
    uuid
};