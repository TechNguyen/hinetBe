const express = require("express");
const {
  findAll,
  findById,
  create,
  update,
  deleteById,
  findByStudentId,
  findByTurtorId,
  findByTurtorIdAndCount,
  getCountStudent,
  getValue
} = require("../controllers/booked-session.controller");

const bookedSessionRoutes = express.Router();

/**
 * Mô tả router
 */
bookedSessionRoutes.get("/", findAll);
bookedSessionRoutes.get("/:id", findById);
bookedSessionRoutes.get("/count/:id", getCountStudent);
bookedSessionRoutes.get("/value/:id", getValue);
bookedSessionRoutes.get('/findBySTID/:id', findByStudentId)
bookedSessionRoutes.get('/findByTTID/:id', findByTurtorId)
bookedSessionRoutes.get('/findStByAu/:id', findByTurtorIdAndCount)
bookedSessionRoutes.post("/", create);
bookedSessionRoutes.put("/:id", update);
bookedSessionRoutes.delete("/:id", deleteById);

module.exports = bookedSessionRoutes;
