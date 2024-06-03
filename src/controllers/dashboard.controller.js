const sequelize = require("../models/index");

const initModel = require("../models/init-models");
const { succesCode, errorCode, failCode } = require("../responses/response");
const models = initModel(sequelize);
const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");

const teacherDashboard = async (req, res) => {
    let {id} = req.query
    let entities = await models.rate.findOne({
    where: {
        view_id: id
    }, 
    attributes: [
        [sequelize.fn('IFNULL', sequelize.fn('AVG', sequelize.col('rate')), 0), 'average_rate']
    ]
  });
  return succesCode(res, entities, "Lấy danh sách khóa học thành công!!!");
};



module.exports = {
    teacherDashboard
};
