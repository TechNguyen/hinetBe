const category = require("../models/category");
const sequelize = require("../models/index");
const initModel = require("../models/init-models");
const tutor_profile = require("../models/tutor_profile");
const { succesCode, errorCode, failCode } = require("../responses/response");
const models = initModel(sequelize);
const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

const findAll = async (req, res) => {
  let entities = await models.category.findAll({});
  return succesCode(res, entities, "Lấy danh sách loại khóa học thành công!!!");
};

const findById = async (req, res) => {
  let { id } = req.params;
  let entity = await models.category.findByPk(id);
  return succesCode(res, entity);
};



const findTurtolBySubject = async (req,res) =>  {
  let entitylist = await models.turtor_category.findAll({
    where: {
      category_id: req.params.id
    },
    include: [models.tutor_profile, models.category]
  })
  return succesCode(res, entitylist, "Lấy danh sách loại khóa học thành công!!!");
  
}
const create = async (req, res) => {

  let body = req.body;
  let entity = await models.category.create({
    category_id: uuidv4(),
    ...body,
  });

  return succesCode(res, entity);
};

const update = async (req, res) => {
  let { id } = req.params;
  let body = req.body;
  let model = await models.category.findByPk(id);
  if (!model) {
    return failCode(res, "model is not exists");
  }

  model.update(body);
  await model.save();

  model.reload();
  return succesCode(res, model);
};

const deleteById = async (req, res) => {
  let { id } = req.params;
  let result = await models.category.destroy({
    where: {
      category_id: id,
    },
  });
  
  return result > 0 ? succesCode(res, true) : failCode(res, "Thất bại");
};

module.exports = { findAll, findById, create, update, deleteById, findTurtolBySubject };
