const express = require("express");
const {
  findAll,
  findById,
  create,
  update,
  deleteById,
  findByStudentId
} = require("../controllers/booked-session.controller");
const bookedSessionRoutes = express.Router();

/**
 * Mô tả router
 */
bookedSessionRoutes.get("/", findAll);
bookedSessionRoutes.get("/:id", findById);


bookedSessionRoutes.get('/findBySTID/:id', findByStudentId)
bookedSessionRoutes.post("/", create);
bookedSessionRoutes.put("/:id", update);
bookedSessionRoutes.delete("/:id", deleteById);

module.exports = bookedSessionRoutes;
