import {selectAlgorithm,coursesInfo,initializeWeek,generaleval,randomIteration} from "../../algorithm.js";



function makeScheduleStandard(schedule){
  let week = initializeWeek();
  for(let i=0;i<5;i++)
    for(let j=0;j<5;j++)
      for(let k=0;k<schedule[i][j].length;k++)
        week[i][j].push(schedule[i][j][k].cid);

    
  return week;
}



const algo = localStorage.getItem("algo");
const iteration = Number(localStorage.getItem("iter"));


const schedule = selectAlgorithm(algo,iteration);

console.log(Object.keys(coursesInfo));
console.log(coursesInfo);
const sch = makeScheduleStandard(schedule);
console.log(generaleval(schedule))
localStorage.setItem("schedule",JSON.stringify(sch));
window.location.replace("./result.html");





