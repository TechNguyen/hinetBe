const express = require("express");
const {
    AddRate,
    getRate
} = require("../controllers/rate.controller");

const rateRoutes = express.Router();

rateRoutes.post('/create', AddRate);

rateRoutes.get('/', getRate);


module.exports = rateRoutes;