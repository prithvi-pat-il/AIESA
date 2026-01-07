const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Settings = sequelize.define('Settings', {
    main_event_name: { type: DataTypes.STRING, defaultValue: 'AIESA Annual Event' }
});

module.exports = Settings;
