const { Sequelize, DataTypes } = require('sequelize');
const db = require('./database');

const Post = db.define('Post', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    unique: true,
    allowNull: false
  },
  tittle: {
      type: DataTypes.STRING,
      allowNull: false
  },
  summary: {
      type: DataTypes.STRING
  },
  content: {
      type: DataTypes.TEXT('long')
  },
  imagePath: {
    type: DataTypes.STRING  
  }
});



module.exports = Post;