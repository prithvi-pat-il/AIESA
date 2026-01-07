const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, defaultValue: 'member' }, // 'admin', 'member'
    insta_id: { type: DataTypes.STRING },
    post: { type: DataTypes.STRING },
    profile_image: { type: DataTypes.STRING },
    order_index: { type: DataTypes.INTEGER, defaultValue: 0 }
});

module.exports = User;
