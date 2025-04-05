const Courses = require('../models/Courses');
const Teacher = require('../models/Teachers');


const insertCourse = async (req,res) =>{
    try{
        const {courseName,semester,major,teacher,prereqs,oddEven,isSecond} = req.body;
        const teacherFromDb = await Teacher.findByPk(teacher);
        if(!teacherFromDb){
            return res.status(400).json({error:'Teacher not found'});
        }
        const Course = await Courses.create({
            coursename: courseName,
            semester: semester,
            oddEven: oddEven,
            isSecond: isSecond,
            major: major,
            time:null,
            prereqs: String(prereqs),
            tid: teacher,
        });
        res.status(201).json({message:'Course created successfully',course:Course});
    }catch(error){
        res.status(400).json({error:error.message});
    }
}

const insertFixCourse = async (req,res) =>{
    try{
        const {courseName,semester,oddEven,isSecond,major,time} = req.body;
        const Course = await Courses.create({
            coursename: courseName,
            semester: semester,
            oddEven: oddEven,
            isSecond: isSecond,
            major: major,
            time: time,
            prereqs: null,
            tid: null,
        });
        res.status(201).json({message:'Course created successfully'});
    }catch(error){
        res.status(400).json({error:error.message});
    }
}

const deleteCourse = async (req,res) =>{

    const id = parseInt(req.params.id);
    try{
        const Deleted =await Courses.destroy({ where: {id} });

        if(!Deleted){
            return res.status(404).json({ error:'record not found'});
        }
        nextID = id+1
        const nextRecord = await Courses.findByPk(nextID);
        if(nextRecord && nextRecord.isSecond){
            const deleteSecondCourse =await Courses.destroy({ where: {id:nextID} });
            if(!deleteSecondCourse){
                return res.status(404).json({ error:'record not found'});
            }
        }

        res.status(200).json({message:`Record with id :${id} is deleted succesfully`});

    }catch(error){
        console.error('Error deleting record:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

}


const deleteAllCourses = async (req,res) =>{
    try{
        const deleteAll = await Courses.destroy({ where: {} });


    if(!deleteAll){
        return res.status(404).json({ error:'record not found'});
    }
    res.status(200).json({message:`All records are deleted succesfully`});

    }
    catch(error){
        console.error("error:",error);
        res.status(500).json({ error: 'Internal server error' });
    }
    }

const getCourses = async (req,res) =>{
    try{
        const allCourses = await Courses.findAll({include:Teacher});
        res.status(200).json(allCourses);

    }catch(error){
        console.error('having Error while fetching all Courses::',error);
        res.status(500).json({erro:'Internal server error'});
    }
}

module.exports = {insertCourse,insertFixCourse , getCourses , deleteAllCourses,deleteCourse};