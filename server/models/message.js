'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      Message.belongsTo(models.Chat, { foreignKey: 'chat_id' });
      Message.belongsTo(models.User, { foreignKey: 'sender_id' });
    }
  }
  Message.init({
    chat_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Chat',
        key: 'chat_id'
      }
    },
    sender_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    sent_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};