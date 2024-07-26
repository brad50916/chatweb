'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Message, { foreignKey: 'sender_id' });
      User.belongsToMany(models.User, {
        through: models.Chat,
        as: 'User1',
        foreignKey: 'user1_id'
      });
      User.belongsToMany(models.User, {
        through: models.Chat,
        as: 'User2',
        foreignKey: 'user2_id'
      });
    }
  }
  User.init({
    email: DataTypes.STRING(30),
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    firstname: DataTypes.STRING(30),
    lastname: DataTypes.STRING(30),
    username: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    url: DataTypes.STRING(255)
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};