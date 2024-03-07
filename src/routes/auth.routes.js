const express = require("express");
const { login, register } = require("../controllers/auth.controller");
const authRouters = express.Router();
const uploadCloud = require("../middlewares/uploader");


authRouters.post("/login", login);
authRouters.post("/register", uploadCloud.single("file_cv"), register);

module.exports = authRouters;
