const axios = require('axios');

const vinRouter = (app) => {
    app.get("/api/vin-check", async (req, res) => {
        const { vin } = req.query;

        const response = await axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${vin}?format=json`)

        return res.send(response.data.Results[0]);
    });

};

module.exports = { vinRouter };
