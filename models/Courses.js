const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Teacher = require("./Teachers");

const Course = sequelize.define("Course",{
    coursename:{
        type:DataTypes.STRING,
        allowNull:false
    },
    semester:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    oddEven:{
        type:DataTypes.BOOLEAN,
        allowNull:true
    },
    isSecond:{
        type:DataTypes.BOOLEAN,
        allowNull:true
    },
    major:{
        type:DataTypes.STRING,
        allowNull:false
    },
    time:{
        type:DataTypes.STRING,
        allowNull:true
    },
    prereqs:{
        type:DataTypes.STRING,
        allowNull:true
    },
});


Course.belongsTo(Teacher,{
    foreignKey:"tid",
    onDelete:"CASCADE"
});
Teacher.hasMany(Course,{foreignKey:"tid"});

module.exports = Course;