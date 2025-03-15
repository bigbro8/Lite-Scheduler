const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Teacher = require("./Teachers");

const Course = sequelize.define("Course",{
    coursename:{
        type:DataTypes.STRING,
        allowNull:false
    },
    isFix:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    },
    major:{
        type:DataTypes.STRING,
        allowNull:false
    },
    prereqs:{
        type:DataTypes.STRING,
        allowNull:false
    },
    semester:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
});

Course.belongsTo(Teacher,{foreignKey:"tid"});
Teacher.hasMany(Course,{foreignKey:"tid"});

module.exports = Course;