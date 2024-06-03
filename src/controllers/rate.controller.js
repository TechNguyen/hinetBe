const sequelize = require("../models/index");
const initModel = require("../models/init-models");
const { succesCode, errorCode, failCode } = require("../responses/response");
const models = initModel(sequelize);
const { Op } = require("sequelize");
const { v4: uuidv4 } = require('uuid');
const { getUserInfoParams } = require("./user.controller");


const AddRate = async (req, res) => {
   try {
        let body = req.body;
        let entities = await models.rate.create({
            ...body, 
            id: uuidv4(),
        })
        return succesCode(res, entities, "Tạo đánh giá thành công!")
   } catch(error) {
        return failCode(res,error.message)
   }
}

const getRate = async (req,res) => {
    try {
        var entities = await models.rate.findAll({
        })

        await Promise.all(entities.map(async (items) => {
            if(items.dataValues.author_id !== null) {
                let res = await getUserInfoParams(items.dataValues.author_id)
                items.dataValues.author_id = `${res.first_name} ${res.last_name}`
            }
            if(items.dataValues.view_id !== null) {
                let resview = await getUserInfoParams(items.dataValues.view_id)
                items.dataValues.view_id = `${resview.first_name} ${resview.last_name}`

            }

        }))
        return succesCode(res, entities, "Tạo đánh giá thành công!")
    } catch (error) {
        return failCode(res,error.message)
    }
}
module.exports = {
    AddRate,
    getRate
}


