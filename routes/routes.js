const express = require("express");
const path = require("path");
const coursw = require("../models/Courses");
const teasw = require("../models/Teachers");
const {createTeacher,deleteTeacher,getAllTeachers, deleteAllTeachers ,getOneTeacher} = require("../controllers/TeachersP_Contro");
const {insertCourse,insertFixCourse,getCourses ,deleteAllCourses, deleteCourse} = require("../controllers/CoursesP_Contro");
const {executingAlgorithm } = require("../controllers/algoExe_Contro");

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

//selectAlgoP route handling
router.get('/selectAlgoP', (req,res)=>{
    res.sendFile(path.join(__dirname, '../public/html/selectAlgoP.html'))
});


//loading route handling
router.get('/loading', (req,res)=>{
    res.sendFile(path.join(__dirname, '../public/html/loading.html'))
});

router.get('/algorithm',executingAlgorithm);

router.get('/result',(req,res)=>{
    res.sendFile(path.join(__dirname,'../public/html/result.html'))
});


router.get('/hh',async (req,res)=>{
    const co = await teasw.findAll({include:coursw});
    res.status(201).json({message:co});
})

module.exports = router;