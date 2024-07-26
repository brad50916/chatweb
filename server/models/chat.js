'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    static associate(models) {
      Chat.belongsTo(models.User, { as: 'User1', foreignKey: 'user1_id' });
      Chat.belongsTo(models.User, { as: 'User2', foreignKey: 'user2_id' });
      Chat.hasMany(models.Message, { foreignKey: 'chat_id' });
    }
  }
  Chat.init({
    user1_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    user2_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Chat',
  });
  return Chat;
};