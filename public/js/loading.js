// import {selectAlgorithm,coursesInfo,initializeWeek,generaleval,randomIteration} from "../../algorithm.js";







// const algo = localStorage.getItem("algo");
// const iteration = Number(localStorage.getItem("iter"));


// const schedule = selectAlgorithm(algo,iteration);

// console.log(Object.keys(coursesInfo));
// console.log(coursesInfo);
// const sch = makeScheduleStandard(schedule);
// console.log(generaleval(schedule))
// localStorage.setItem("schedule",JSON.stringify(sch));
// window.location.replace("./result.html");


(async ()=>{
  try{
  const res = await fetch("http://localhost:5000/algorithm");
  if(!res.ok){
    throw new Error("executing algorithm wasn't seccussful");
  }
  window.location.replace("./result");
  }
  catch(error){
  console.error("error: ",error)
}})()




