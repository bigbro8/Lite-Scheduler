const express = require("express");
const path = require("path");
const {createTeacher,deleteTeacher,getAllTeachers} = require("../controllers/TeachersP_Contro");

const router = express.Router();

router.get('/TeachersP', (req,res)=>{
    res.sendFile(path.join(__dirname, '../public/html/create1.html'))
});

router.get('/TeachersP/getTeachers',getAllTeachers);

router.delete('/TeachersP/:id',deleteTeacher);

router.post('/TeachersP',createTeacher);