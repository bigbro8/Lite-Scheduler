const express = require("express");
const path = require("path");
const {createTeacher,deleteTeacher,getAllTeachers, deleteAllTeachers ,getOneTeacher} = require("../controllers/TeachersP_Contro");
const {insertCourse,insertFixCourse,getCourses ,deleteAllCourses, deleteCourse} = require("../controllers/CoursesP_Contro");

const router = express.Router();



// TeachersP route handling
router.get('/TeachersP', (req,res)=>{
    res.sendFile(path.join(__dirname, '../public/html/TeachersP.html'))
});
router.get('/TeachersP/getTeachers',getAllTeachers);
router.delete('/TeachersP/:id',deleteTeacher);
router.delete('/TeachersP',deleteAllTeachers);
router.post('/TeachersP',createTeacher);
router.get('/getOneTeacher/:id',getOneTeacher);


router.get('/defineG', (req,res)=>{
    res.sendFile(path.join(__dirname, '../public/html/defineG.html'))
});




//CouresesP route handling
router.get('/CoursesP',(req,res)=>{
    res.sendFile(path.join(__dirname,'../public/html/CoursesP.html'))
});

router.delete('/CoursesP/:id',deleteCourse);

router.get('/CoursesP/getCourses',getCourses);

router.delete('/CoursesP',deleteAllCourses);

router.post('/insertFixCourse',insertFixCourse);

router.post('/insertCourse',insertCourse);

module.exports = router;