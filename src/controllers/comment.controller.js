const sequelize = require("../models/index");
const initModel = require("../models/init-models");
const { succesCode, errorCode, failCode } = require("../responses/response");
const models = initModel(sequelize);
const { Op } = require("sequelize");
const { v4: uuidv4 } = require('uuid');
const { getUserInfoParams } = require("./user.controller");

const AddComment = async (req, res) => {
   try {
        let body = req.body;
        let author_id = req.body.author_id || null;

        let entities = await models.comments.create({
            comment_id: uuidv4(),
            create_at: Date.now(),
            ...body,
            author_id: author_id,
        })
        succesCode(res, entities, "Tạo bình luận thành công!")
   } catch(error) {
        failCode(res,error.message)
   }
}

const findById = async (req,res) => {
   try {
        let author_id  = req.params.author_id;
        let allCommnent = await models.comments.findAll({
            where:{
                author_id: author_id
            },
            include: [
                { 
                    model: models.users, 
                    as: "user", 
                    attributes: ["user_id","last_name", "first_name", "avatar_url", "role_id"],
                    foreignKey: "user_id"
                },
            ],
        })
        succesCode(res,allCommnent, "Lấy danh sách comment thành công!")
   } catch(error) {
    errorCode(res, error.message) 
   }
}


const getAllComment = async (req,res) => {
    try {
        let all_Comment = await models.comments.findAll({
            include: [
                {
                    model: models.users,
                    attributes: ["user_id","last_name", "first_name", "avatar_url", "role_id"],
                    foreignKey: "user_id"
                },
                {
                    model: models.users,
                    attributes: ["user_id","last_name", "first_name", "avatar_url", "role_id"],
                    foreignKey: "author_id"
                }
            ],
        })

        await Promise.all(all_Comment.map(async (items) => {
            if(items.dataValues.create_at != null) {
                const createDate = new Date(items.dataValues.create_at);
                const day = createDate.getDate().toString().padStart(2, '0');
                const month = (createDate.getMonth() + 1).toString().padStart(2, '0');
                const year = createDate.getFullYear();
                items.dataValues.create_at = `${day}/${month}/${year}`;
            }
        
            if(items.dataValues.author_id != null) {
                let res = await getUserInfoParams(items.dataValues.author_id)
                if(res.first_name != null) {
                    items.dataValues.author_id = `${res.first_name} ${res.last_name}`
                }
            }
        }));


        console.log(all_Comment);
        
         return succesCode(res,all_Comment,"Thành công!")
    } catch (error) {
         return errorCode(res,error.message)
    }
}
module.exports = {
    AddComment,
    findById,
    getAllComment
}


