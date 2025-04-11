// const {selectAlgorithm} = require("../algorithm");
const scheduleModel = require("../models/Schedules");

function makeScheduleStandard(schedule){
  let week = initializeWeek();
  for(let i=0;i<5;i++)
    for(let j=0;j<5;j++)
      for(let k=0;k<schedule[i][j].length;k++)
        week[i][j].push(schedule[i][j][k].cid);    
  return week;
}

const executingAlgorithm = (req,res) =>{
    try{
        // const schedule =  selectAlgorithm(algo,iteration);
        // const sch =  makeScheduleStandard(schedule);
        // makingSche = scheduleModel.create({
        //     weekTable:JSON.stringify(sch)
        // })
        res.status(201).json({message:"schedule successfully created"});
        
    }catch(error){
        console.error("error: ",error);
    }
}


module.exports = {executingAlgorithm};