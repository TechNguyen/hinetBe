const express = require("express");
const {
  findById,
  AddComment, 
  getAllComment
} = require("../controllers/comment.controller");

const commentRoutes = express.Router();

commentRoutes.post('/create', AddComment);
commentRoutes.get('/', getAllComment);

commentRoutes.get('/:author_id', findById);


module.exports = commentRoutes;
