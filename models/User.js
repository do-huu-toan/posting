const { Sequelize, DataTypes } = require('sequelize');
const db = require('./database');
const Post = require('./Post');

const User = db.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    unique: true,
    allowNull: false
  },
  usename: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
});

//User.belongsTo(Role);
User.hasMany(Post, {
  foreignKey: {
      name: 'userId',
      allowNull: false
  },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});


module.exports = User;