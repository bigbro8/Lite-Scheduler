const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Teacher = sequelize.define('Teacher' , {
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },

    timing:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    },

    Daynumber:{
        type:DataTypes.INTEGER,
        allowNull:false
    },  

    wt:{
        type:DataTypes.STRING,
        allowNull:false
    }, 

    prefers:{
        type:DataTypes.STRING,
        allowNull:false
    },  

    gapPenalty:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    }


});

module.exports = Teacher;