const express = require("express");
const path = require("path");
const {createTeacher,deleteTeacher,getAllTeachers, deleteAll} = require("../controllers/TeachersP_Contro");

const router = express.Router();

router.get('/TeachersP', (req,res)=>{
    res.sendFile(path.join(__dirname, '../public/html/TeachersP.html'))
});

router.get('/TeachersP/getTeachers',getAllTeachers);

router.delete('/TeachersP/:id',deleteTeacher);
router.delete('/TeachersP',deleteAll);

router.post('/TeachersP',createTeacher);

module.exports = router;