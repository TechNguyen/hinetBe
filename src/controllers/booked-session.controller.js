const sequelize = require("../models/index");
const initModel = require("../models/init-models");
const { succesCode, errorCode, failCode } = require("../responses/response");
const models = initModel(sequelize);
const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

const findAll = async (req, res) => {
  let entities = await models.booked_session.findAll({
    include: ["tutor", "student", "course"],
  });
  return succesCode(res, entities, "Lấy danh sách thành công!!!");
};





const findById = async (req, res) => {
  let { id } = req.params;
  let entity = await models.booked_session.findByPk(id, {
    include: ["tutor", "student", "course"],
  });
  return succesCode(res, entity);
};

const findByStudentId  = async (req,res) => {
  let { id } = req.params;
  let entity = await models.booked_session.findAll({
    where: {
      student_id: id
    },
    include: ["tutor", "student", "course"]
  });
  return succesCode(res, entity);
}


const findByTurtorId = async (req,res) => {
  let { id } = req.params;
  console.log(req);
  let {pageIndex,pageSize} = req.query;
  pageIndex = parseInt(pageIndex) || 1;
  pageSize = parseInt(pageSize) || 10;


  let total = await models.booked_session.count(
   {
    where: {
      tutor_id: id
    }
   }
  )
  let entity = await models.booked_session.findAll({
    where: {
      tutor_id: id
    },
    include: ["tutor", "student", "course"],
    offset: (pageIndex - 1) * pageSize,
    limit: pageSize
  });
  return succesCode(res, {
    pageIndex: pageIndex,
    pageSize: pageSize,
    total: total,
    entity
  });
}



const getCountStudent = async (req,res) => {
  let { id } = req.params;
  let total = await models.booked_session.count(
    {
     where: {
       tutor_id: id
     },
     distinct: true,
     col: 'student_id'
    }
   )
   succesCode(res,total)
}


const getValue = async (req,res) => {
  let { id } = req.params;
  let total = await models.booked_session.sum('price',
    {
     where: {
       tutor_id: id
     },
     distinct: true,
     col: 'student_id',
    }
   )
   succesCode(res,total)
}



const findByTurtorIdAndCount = async (req,res) => {
  let { id } = req.params;
  let {pageIndex,pageSize} = req.query;
  pageIndex = parseInt(pageIndex) || 1;
  pageSize = parseInt(pageSize) || 10;


  let total = await models.booked_session.count(
   {
    where: {
      tutor_id: id
    },
    distinct: true,
    col: 'student_id'
   }
  )
  
  let entity = await models.booked_session.findAll({
    where: {
      tutor_id: id
    },
    include: ["tutor", "student", "course"],
    distinct: true,
    col: 'student_id',
    offset: (pageIndex - 1) * pageSize,
    limit: pageSize
  });
  return succesCode(res, {
    pageIndex: pageIndex,
    pageSize: pageSize,
    totalStudent: total,
    entity
  });
}











const create = async (req, res) => {
  let body = req.body;
  console.log(req);
  let entity = await models.booked_session.create({
    booked_session_id: uuidv4(),
    ...body,
  });

  return succesCode(res, entity);
};

const update = async (req, res) => {
  let { id } = req.params;
  let body = req.body;
  let model = await models.booked_session.findByPk(id);
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
  let result = await models.booked_session.destroy({
    where: {
      booked_session_id: id,
    },
  });

  return result > 0 ? succesCode(res, true) : failCode(res, "Thất bại");
};

module.exports = { findAll, findById, create, update, deleteById,findByStudentId,findByTurtorId, findByTurtorIdAndCount, getCountStudent, getValue };
