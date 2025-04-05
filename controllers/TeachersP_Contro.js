const Teachers = require('../models/Teachers');
const Course = require('../models/Courses');

const createTeacher = async (req,res) =>{
    try{
        const {name ,timing ,Daynumber ,wt ,prefers ,gapPenalty} = req.body;
        const Teacher = await Teachers.create({name ,timing ,Daynumber ,wt ,prefers ,gapPenalty});
        res.status(201).json(Teacher);
    }catch(error){
        res.status(400).json({error:error.message});
    }
};




const getAllTeachers = async (req,res) =>{
    try{
        const allTeachers = await Teachers.findAll();
        res.status(200).json(allTeachers);

    }catch(error){
        console.error('Error fetching records:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


const getOneTeacher = async (req,res) =>{
    try{
        const teacher = await Teachers.findByPk(req.params.id,{include:Course});
        if(!teacher){
            return res.status(404).json({ error:'record not found'});
        }
        res.status(200).json(teacher);
    }catch(error){
        console.error('Error:',error);
    }
}



const deleteTeacher = async (req,res) =>{
    
    const tid = parseInt(req.params.id);
    try{
        const Deleted =await Teachers.destroy({ where: {tid} });
        
        if(!Deleted){
            return res.status(404).json({ error:'record not found'});
        }

        res.status(200).json({message:`Record with id :${tid} is deleted succesfully`});

    }catch(error){
        console.error('Error deleting record:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

}


const deleteAllTeachers = async (req,res) =>{
    try{
        const deleteAll = await Teachers.destroy({ where: {} });
    

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




module.exports ={createTeacher,deleteTeacher,getAllTeachers,deleteAllTeachers,getOneTeacher};