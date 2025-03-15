const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");


const Schedule = sequelize.define("Schedule",{
    weekTable:{
        type:DataTypes.STRING,
        allowNull:false
    }
})

module.exports = Schedule;