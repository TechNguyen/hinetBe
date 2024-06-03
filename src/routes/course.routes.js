const express = require("express");
const {
  findAll,
  findById,
  create,
  update,
  deleteById,
  getListCourseHome,
  findAllbyTutor,
  countStudent,
} = require("../controllers/course.controller");
const uploadCloud = require("../middlewares/uploader");


const courseRoutes = express.Router();

courseRoutes.get("/", findAll);
courseRoutes.get("/:id", findById);
courseRoutes.post("/" , create);
courseRoutes.put("/:id", update);
courseRoutes.delete("/:id", deleteById);
courseRoutes.get("/getlistcourselimit", getListCourseHome);
courseRoutes.get("/get-by-tutor-id/:id", findAllbyTutor);
courseRoutes.get("/count-by-tutor", countStudent);

module.exports = courseRoutes;
