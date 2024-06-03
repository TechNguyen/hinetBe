const express = require("express");
const {
  findAll,
  findById,
  create,
  update,
  deleteById,
  getListCourseHome,
  findAllbyTutor,
} = require("../controllers/course.controller");
const uploadCloud = require("../middlewares/uploader");


const courseRoutes = express.Router();

courseRoutes.get("/", findAll);
courseRoutes.get("/:id", findById);
courseRoutes.post("/", uploadCloud.fields([{
  name: '',
  maxCount: 1
}, {
  name: '',
  maxCount: 1
}]) , create);
courseRoutes.put("/:id", update);
courseRoutes.delete("/:id", deleteById);
courseRoutes.get("/getlistcourselimit", getListCourseHome);
courseRoutes.get("/get-by-tutor-id/:id", findAllbyTutor);

module.exports = courseRoutes;
