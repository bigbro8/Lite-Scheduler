const express = require("express");
const path = require("path");
const {createTeacher,deleteTeacher,getAllTeachers, deleteAll} = require("../controllers/TeachersP_Contro");

const router = express.Router();



// TeachersP route handling
router.get('/TeachersP', (req,res)=>{
    res.sendFile(path.join(__dirname, '../public/html/TeachersP.html'))
});
router.get('/TeachersP/getTeachers',getAllTeachers);
router.delete('/TeachersP/:id',deleteTeacher);
router.delete('/TeachersP',deleteAll);
router.post('/TeachersP',createTeacher);


router.get('/defineG', (req,res)=>{
    res.sendFile(path.join(__dirname, '../public/html/defineG.html'))
});

router.get('/CoursesP',(req,res)=>{
    res.sendFile(path.join(__dirname,'../public/html/CoursesP.html'))
});


module.exports = router;