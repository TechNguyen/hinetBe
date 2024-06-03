const express = require("express");
const { teacherDashboard } = require("../controllers/dashboard.controller");

const dashboardTeacherRoutes = express.Router();
dashboardTeacherRoutes.get("/count", teacherDashboard)

module.exports = dashboardTeacherRoutes;
