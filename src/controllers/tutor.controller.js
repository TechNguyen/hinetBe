const sequelize = require("../models/index");

const initModel = require("../models/init-models");
const { succesCode, errorCode, failCode } = require("../responses/response");
const models = initModel(sequelize);
const { Op, where } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");



const findAll = async (req, res) => {
  let entities = await models.tutor_profile.findAll({
    include: [
      "tutor_educations",
      "tutor_certifications",
      "tutor_experiences",
      "user",
    ],
  },);
  return succesCode(
    res,
    entities,
    "Lấy danh sách profile gia sư thành công!!!"
  );
};


const findAllPage = async (req, res) => {
  let {pageIndex,pageSize} =  req.query;
  pageIndex = parseInt(pageIndex) || 1;
  pageSize = parseInt(pageSize) || 15;

  let entitiesmodel = await models.tutor_profile.count({
    include: [
      "tutor_educations",
      "tutor_certifications",
      "tutor_experiences",
      "user",
    ],
  });

  let entities = await models.tutor_profile.findAll({
    include: [
      "tutor_educations",
      "tutor_certifications",
      "tutor_experiences",
      "user",
    ],
    offset: (pageIndex - 1) * pageSize,
    limit: pageSize
  },);
  return succesCode(
    res,
    {
      pageIndex: pageIndex,
      pageSize: pageSize,
      totalPage: entitiesmodel,
      entities
    },
    "Lấy danh sách profile gia sư thành công!!!"
  );
};

const findById = async (req, res) => {
  let { id } = req.params;
  let entity = await models.tutor_profile.findOne({
    where: {
      tutor_profile_id: id,
    },
    include: [
        { model: models.tutor_education, as: "tutor_educations", include:"schools" },
        { model: models.tutor_certification, as: "tutor_certifications" },
        { model: models.tutor_experience, as: "tutor_experiences" },
        { model: models.users, as: "user" },
    ],
  });
  console.log(entity);

  return succesCode(res, entity, "Success");
};

const create = async (req, res) => {
  let body = req.body;
  let entity = await models.tutor_profile.create({
    tutor_profile_id: uuidv4(),
    ...body,
  });

  return succesCode(res, entity);
};

const update = async (req, res) => {
  let { id } = req.params;
  let body = req.body;
  let model = await models.tutor_profile.findByPk(id);
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

  const tutor = await models.tutor_profile.findByPk(id);
  let result = await models.tutor_profile.destroy({
    where: {
      tutor_profile_id: id,
    },
  });

  const user = await models.users.findByPk(tutor.user_id)
  user.update({
    type: "1"
  })

  await user.save();


  //tao moi profile student
  await models.student_profile.create({
    student_profile_id: uuidv4(),
    student_id: user.user_id
  })

  return result > 0 ? succesCode(res, true) : failCode(res, "Thất bại");
};

/**
 *  update 1 array tutor_certifications
 *  params id: là tutor_id
 *  body: array tutor_certification
 * @param {*} req
 * @param {*} res
 */
const updateTutorCertifications = async (req, res) => {
  let { id } = req.params;
  let body = req.body;

  await models.tutor_certification.destroy({
    where: {
      tutor_profile_id: id,
    },
  });

  let entity = await models.tutor_certification.bulkCreate(
    body.map((x) => {
      x.tutor_certification_id = uuidv4();
      x.tutor_profile_id = id;
      return x;
    })
  );

  return succesCode(res, entity);
};

/**
 *  update 1 array tutor_certifications
 *  params id: là tutor_id
 *  body: array tutor_certification
 * @param {*} req
 * @param {*} res
 */
const updateTutorEducations = async (req, res) => {
  let { id } = req.params;
  let body = req.body;

  await models.tutor_education.destroy({
    where: {
      tutor_profile_id: id,
    },
  });

  let entity = await models.tutor_education.bulkCreate(
    body.map((x) => {
      x.tutor_education_id = uuidv4();
      x.tutor_profile_id = id;
      return x;
    })
  );

  return succesCode(res, entity);
};

/**
 *  update 1 array tutor_certifications
 *  params id: là tutor_id
 *  body: array tutor_certification
 * @param {*} req
 * @param {*} res
 */
const updateTutorExperience = async (req, res) => {
  let { id } = req.params;
  let body = req.body;

  await models.tutor_experience.destroy({
    where: {
      tutor_profile_id: id,
    },
  });

  let entity = await models.tutor_experience.bulkCreate(
    body.map((x) => {
      x.tutor_experience_id = uuidv4();
      x.tutor_profile_id = id;
      return x;
    })
  );

  return succesCode(res, entity);
};

const getTutorByUserId = async (req, res) => {
  let { id } = req.params;
  let entity = await models.users.findOne({
    where: {
      user_id: id,
    },
    include: [
      {
        model: models.tutor_profile,
        as: "tutor_profiles",
        include: [
          "tutor_certifications",
          "tutor_educations",
          "tutor_experiences",
        ],
      },
    ],
  });

  return succesCode(res, entity, "Success");
};

module.exports = {
  findAll,
  findAllPage,
  findById,
  create,
  update,
  deleteById,
  updateTutorCertifications,
  updateTutorEducations,
  updateTutorExperience,
  getTutorByUserId,
};
