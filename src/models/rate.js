const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  return rate.init(sequelize, DataTypes);
}

class rate extends Sequelize.Model {
    static init(sequelize, DataTypes) {
      return super.init({
        id: {
          allowNull: false,
          type: DataTypes.STRING(50),
          primaryKey: true
        },
        rate: {
          type: DataTypes.TEXT('long'),
          allowNull: false
        },
        author_id: {
          allowNull: true,
          defaultValue: null,
          type: DataTypes.STRING(50),
          references:  {
            model: 'users',
            key: 'user_id'
          }
        },
        view_id: {
        allowNull: true,
          defaultValue: null,
          type: DataTypes.STRING(50),
          references:  {
            model: 'users',
            key: 'user_id'
          }
        }
      },  {
        sequelize,
        tableName: "rate",
        timestamps: false,
      })
    }
  }

  
