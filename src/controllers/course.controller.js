const sequelize = require("../models/index");

const initModel = require("../models/init-models");
const { succesCode, errorCode, failCode } = require("../responses/response");
const models = initModel(sequelize);
const { Op, where } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");

const findAll = async (req, res) => {
  let entities = await models.course.findAll({
    include: [
      {
        model: models.category,
        as: "category",
      },
      {
        model: models.tutor_profile,
        as: "tutor_profile",
        include: [
          { model: models.users, as: "user" },
          { model: models.tutor_certification, as: "tutor_certifications" },
          { model: models.tutor_education, as: "tutor_educations" },
        ], // Include the User model within TutorProfile
      },
      {
        model: models.course_program,
        as: "course_programs",
        include: ["course_program_phases"],
      },
    ],
  });
  return succesCode(res, entities, "Lấy danh sách khóa học thành công!!!");
};


const countStudent = async (req,res) => {
  let {course_id,id} = req.query;


  let countVL = await models.booked_session.count({
    where: {
      [Op.and]: [{ course_id: course_id }, { tutor_id: id }],
    },
    distinct: true,
    col: 'student_id'
  })
  console.log(countVL);
  succesCode(res,countVL)
}

const findAllbyTutor = async (req, res) => {
  let {id} = req.params;
  let {pageIndex,pageSize} = req.query;
  pageIndex = parseInt(pageIndex) || 1;
  pageSize = parseInt(pageSize) || 10;


  let total = await models.course.count(
   {
    where: {
      tutor_profile_id: id
    }
   }
  )



 

  let entities = await models.course.findAll({
    where :{
      tutor_profile_id: id
    },
    include: [
      {
        model: models.category,
        as: "category",
      },
      {
        model: models.tutor_profile,
        as: "tutor_profile",
        include: [
          { model: models.users, as: "user" },
          { model: models.tutor_certification, as: "tutor_certifications" },
          { model: models.tutor_education, as: "tutor_educations" },
        ], // Include the User model within TutorProfile
      },
      {
        model: models.course_program,
        as: "course_programs",
        include: ["course_program_phases"],
      },
    ],
    offset: (pageIndex - 1) * pageSize,
    limit: pageSize
  });
  return succesCode(res, {
    pageIndex: pageIndex,
    pageSize: pageSize,
    total: total,
    entities
  }, "Lấy danh sách khóa học thành công!!!");
};


const findById = async (req, res) => {
  let { id } = req.params;
  let entity = await models.course.findOne({
    where: { course_id: id },
    include: [
      {
        model: models.category,
        as: "category",
      },
      {
        model: models.tutor_profile,
        as: "tutor_profile",
        include: [
          { model: models.users, as: "user" },
          { model: models.tutor_certification, as: "tutor_certifications" },
          { model: models.tutor_education, as: "tutor_educations" },
        ], // Include the User model within TutorProfile
      },
      {
        model: models.course_program,
        as: "course_programs",
        include: ["course_program_phases"],
      },
    ],
  });

  return succesCode(res, entity, "Lấy thông tin khóa học thành công!!!");
};

const create = async (req, res) => {
  let body = req.body;
  let entity = await models.course.create({
    course_id: uuidv4(),
    ...body,
  });

  return succesCode(res, entity);
};

const update = async (req, res) => {
  let { id } = req.params;
  let body = req.body;
  let model = await models.course.findByPk(id);
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
  let result = await models.course.destroy({
    where: {
      course_id: id,
    },
  });

  return result > 0 ? succesCode(res, true) : failCode(res, "Thất bại");
};

// home page
const getListCourseHome = async (req, res) => {
  try {
    let courses = await models.course.findAll({
      include: [
        {
          model: models.category,
          as: "category", // Assuming 'CourseCategory' is the alias
        },
        {
          model: models.tutor_profile,
          as: "tutor_profile",
          include: [
            {
              model: models.users, // Including the 'user' table inside 'tutor_profile',
              as: "user",
            },
          ],
        },
        {
          model: models.course_program,
          as: "course_programs",
        },
      ],
      limit: 6, // Limiting to retrieve only 6 items
    });
    return succesCode(res, courses, "Lấy danh sách khóa học thành công!!!");
  } catch (error) {
    return errorCode(res, "Lỗi!!!");
  }
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  deleteById,
  getListCourseHome,
  findAllbyTutor,
  countStudent
};
