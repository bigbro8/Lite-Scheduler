const Course = require("./models/Courses");
const Teacher = require("./models/Teachers");


//the functions those can get eliminated after using sql are marked with #R

console.time("time");
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}



//--------------------------initialize the data set-------------------------
async function fetchTeachers() {
    try {
        const allTeachers = await Teacher.findAll({include:Course});
        return allTeachers;

    } catch (error) {
        console.error({"couldn't fetch teachers error:":error});
        return [];
    }
}

async function fetchCourses() {
    try {
        const allCourses = await Course.findAll({include:Teacher});
        return allCourses;

    } catch (error) {
        console.error({"couldn't fetch teachers error:":error});
        return [];
    }
}

let teacherList;
let courses;

(async ()=>{
    teacherList = await fetchTeachers();
    courses = await fetchCourses()
})();

console.log("test",teacherList)
let courseList = splitCourseList(courses);

let fixCourses = courseList[0];
let normalCourses = courseList[1];







function findTeacherfromTL(id) {
    for (let i = 0; i < teacherList.length; i++) {
        if (teacherList[i].tid === id) {
            return teacherList[i];
        }
    }
}




function splitCourseList(wholeList) {
    let fixCourses = [];
    let normalCourses = [];
    for (let i = 0; i < wholeList.length; i++) {
        if (wholeList[i].isfix)
            fixCourses.push(wholeList[i]);
        else
            normalCourses.push(wholeList[i]);
    }
    return [fixCourses, normalCourses];
}



var coursesInfo = {};

















//---------------------------facillities---------------------------------



//initialize the week table with
function initializeWeek() {
    let schedule = [];
    for (let i = 0; i < 5; i++) {
        let row = [];
        for (let j = 0; j < 5; j++) {
            let col = [];
            row.push(col);
        }
        schedule.push(row);
    }
    return schedule;
}


//*it might have problem in checking section[i].isfix */
//check if there is another course with same teacher in the section
function ttc(teacher_name, section) {
    for (let i = 0; i < section.length; i++) {
        if (section[i].isfix) return true;
        if (teacher_name == section[i].teacher.name) {
            return false;
        }
    }
    return true;
}




//** it can be much prettier */
//check if there is half time course section with opposite even/odd notation
function ttc1(course, section) {
    let index = findAllIndeces(section, course.teacher);
    var ret = false;
    for (let i = 0; i < index.length; i++) {
        if (course.oddEven !== undefined && section[index[i]].oddEven !== undefined && course.oddEven !== section[index[i]].oddEven)
            ret = true;
        else {
            ret = false;
            break;
        }
    }
    return ret;
}



//different include checking for different places
function includes1(arr, teacher) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][0] === teacher) {
            return true;
        }
    }
    return false;
}



function customInclude(array, element) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] == element.cid || array[i] == element.cid + "s") {
            return true;
        }
    }
    return false;
}



function anotherCustomInclude(arr, element) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == element) return true;
    }
    return false;
}







//check how much course is in the day
function countCourses(day, section) {
    let counter = 0;
    section.forEach(index => {
        for (let i = 0; i < day[index].length; i++) {
            if (day[index][i].oddEven !== undefined) counter += .5;
            else counter += 1;
        }
    })

    counter = Math.ceil(counter)
    return counter;
}


//update penalty for coursesinfo
function updatePenalty(week, courseList) {
    courseList.forEach(course => {
        let time = coursesInfo[course.cid]["position"];
        coursesInfo[course.cid]["penalty"] = currentEval(course, time[0], time[1], week);
    })
}



//different find index functions
function findIndex(section, teacher) {
    for (let i = 0; i < section.length; i++) {
        if (section[i].teacher.tid === teacher.tid) {
            return i;
        }
    }
}


function findAllIndeces(section, teacher) {
    let index = [];
    for (let i = 0; i < section.length; i++) {
        if (section[i].teacher.tid === teacher.tid) {
            index.push(i);
        }
    }
    return index;
}

function findCourseIndex(section, course) {
    for (let i = 0; i < section.length; i++) {
        if (section[i].cid === course.cid) {
            return i;
        }
    }
}


//find with same odd even flag
function findSameOddEven(section, course) {
    for (let i = 0; i < section.length; i++) {
        if (section[i].oddEven === course.oddEven) {
            return i;
        }
    }

}







//----------------------------certain initializer----------------------------

//count implicit timed teachers work time
function countWorkTimesI(teacher) {
    let workTime = 0;
    Object.keys(teacher.wt).forEach(key => {
        workTime += teacher.wt[key].length;
    })
    let finalPoint = (Number(workTime / 5)) * teacher.Daynumber;
    return finalPoint;
}


//count explicit timed teachers work time
function countWorkTimesE(teacher) {
    let workTime = 0;
    Object.keys(teacher.wt).forEach(key => {
        workTime += teacher.wt[key].length;
    })
    return workTime;
}




function listLesscrowdedDay(week, sections, except) {
    let sortedList = [];
    for (let i = 0; i < week.length; i++) {
        if (except !== undefined) {
            if (except.includes(i)) continue;
        }
        let coursePoints = countCourses(week[i], sections);
        if (sortedList.length === 0) {
            sortedList.push([i, coursePoints]);
        } else {
            for (let j = 0; j < sortedList.length; j++) {
                if (sortedList[j][1] >= coursePoints) {
                    sortedList.splice(j, 0, [i, coursePoints]);
                    break;
                }
            }
            if (!includes1(sortedList, i)) {
                sortedList.push([i, coursePoints]);
            }
        }
    }
    for (let i = 0; i < sortedList.length; i++) {
        sortedList[i] = sortedList[i][0];
    }


    if (except !== undefined) return [...sortedList, ...except];
    return [...sortedList];
}



//*** in this code the condition !includes1 can be removed by checking if its for loop reachs the end with out adding the element */
function sortTeacherList(teacherList) {
    let itt = [];
    let ett = [];
    teacherList.forEach(element => {
        if (element.timing === "implicit") {
            let teacherWorkTimeI = countWorkTimesI(element);
            if (itt.length === 0) {
                itt.push([element, teacherWorkTimeI]);
            } else {
                for (let j = 0; j < itt.length; j++) {
                    if (itt[j][1] >= teacherWorkTimeI) {
                        itt.splice(j, 0, [element, teacherWorkTimeI]);
                        break;
                    }
                }
                if (!includes1(itt, element)) {
                    itt.push([element, teacherWorkTimeI]);
                }
            }
        } else {
            let teacherWorkTimeE = countWorkTimesE(element);
            if (ett.length === 0) {
                ett.push([element, teacherWorkTimeE]);
            } else {
                for (let j = 0; j < ett.length; j++) {
                    if (ett[j][1] >= teacherWorkTimeE) {
                        ett.splice(j, 0, [element, teacherWorkTimeE]);
                        break;
                    }
                }
                if (!includes1(ett, element)) {
                    ett.push([element, teacherWorkTimeE]);
                }
            }


        }
    })
    for (let i = 0; i < itt.length; i++) {
        itt[i] = itt[i][0];
    }
    for (let i = 0; i < ett.length; i++) {
        ett[i] = ett[i][0];
    }

    return [ett, itt];
}



function teacherOddEven(teacher) {
    let odd = [];
    let even = [];
    for (let i = 0; i < teacher.courses.length; i++) {
        if (teacher.courses[i].oddEven !== undefined) {
            if (teacher.courses[i].oddEven === "o") odd.push(teacher.courses[i]);
            else even.push(teacher.courses[i]);
        }
    }
    return [odd, even];
}





//escape from deadlock
function escapeMechanism(teacher, week) {
    let penalty = Number.NEGATIVE_INFINITY;
    let days = Object.keys(teacher.wt);
    let pos;
    //*** teacherOddEven is called twice and its useless*/
    let odd = teacherOddEven(teacher)[0];
    let even = teacherOddEven(teacher)[1];
    let chosenC;
    let oddOrEven;
    let prevPos;
    //** can be written in one line */
    if (odd.length <= even.length) oddOrEven = odd;
    else oddOrEven = even;
    oddOrEven.forEach(course => {
        let p = coursesInfo[course.cid]["position"];
        if (!oddEvenPair(week[p[0]][p[1]], teacher)) {
            days.forEach(day => {
                day = Number(day);
                teacher.wt[day].forEach(sec => {
                    if (p[0] !== day || p[1] !== sec) {
                        if (ttc1(course, week[day][sec])) {
                            let tempenalty = evaluation(course, day, sec, week);
                            if (tempenalty > penalty) {
                                penalty = tempenalty;
                                pos = [day, sec];
                                prevPos = coursesInfo[course.cid]["position"];
                                chosenC = course;
                            }
                        }
                    }
                })
            })
        }
    })
    let thisind = findCourseIndex(week[prevPos[0]][prevPos[1]], chosenC);
    let thatind = findIndex(week[pos[0]][pos[1]], teacher);
    coursesInfo[chosenC.cid]["position"] = pos;
    moveCourse(week, [...prevPos, thisind], [...pos, thatind]);
    return prevPos
}



//find the best section to insert course in timetable
function findSection(days, teacher, week, course) {
    let penalty = Number.NEGATIVE_INFINITY;
    let pos;
    days.forEach(day => {
        day = Number(day);
        teacher.wt[day].forEach(sec => {
            let tempenalty = evaluation(course, day, sec, week);
            if (ttc(teacher.name, week[day][sec])) {
                if (tempenalty > penalty) {
                    penalty = tempenalty;
                    pos = [day, sec];
                }
            } else {
                if (ttc1(course, week[day][sec])) {
                    if (tempenalty > penalty) {
                        penalty = tempenalty;
                        pos = [day, sec];
                    }
                }
            }
        })
    })
    if (penalty === Number.NEGATIVE_INFINITY) {
        pos = escapeMechanism(teacher, week);
        penalty = currentEval(course, pos[0], pos[1], week);
    }
    return [penalty, pos];
}



//insert fix courses in the week
function fixCourseHandler(week, fixCourses) {
    for (let i = 0; i < fixCourses.length; i++) {
        let c = fixCourses[i];
        week[c.day][c.section].push(c);
    }
    return week;
}



//insert courses related to explicit teacher
function explicitInitializer(week, teacherList) {
    for (let i = 0; i < teacherList.length; i++) {
        let thisTeacher = teacherList[i];
        let theseCourses = thisTeacher.courses;
        for (let j = 0; j < theseCourses.length; j++) {
            let thisCourse = theseCourses[j];
            let days = Object.keys(thisTeacher.wt);
            let penaltyPos = findSection(days, thisTeacher, week, thisCourse);
            let penalty = penaltyPos[0];
            let pos = penaltyPos[1];
            coursesInfo[thisCourse.cid] = { "penalty": penalty, "position": [...pos] };
            week[pos[0]][pos[1]].push(thisCourse);
        }
    }
    return week;
}




//insert courses related to implicit teacher
function impilicitInitializer(week, teacherList) {
    for (let i = 0; i < teacherList.length; i++) {
        let thisTeacher = teacherList[i];
        let theseCourses = thisTeacher.courses;
        let dayCounter = thisTeacher.Daynumber;
        let chosenDay = [];
        for (let j = 0; j < theseCourses.length; j++) {
            let thisCourse = theseCourses[j]
            let days = listLesscrowdedDay(week, thisTeacher.wt[Object.keys(thisTeacher.wt)[0]], thisTeacher.except);
            let penalty = Number.NEGATIVE_INFINITY;
            let pos = [];
            if (dayCounter !== 0) {
                let penaltypos = findSection(days, thisTeacher, week, thisCourse);
                penalty = penaltypos[0];
                pos = penaltypos[1];
            } else {
                let newWt = {};
                for (let j = 0; j < chosenDay.length; j++)
                    newWt[chosenDay[j]] = thisTeacher.wt[chosenDay[j]];
                thisTeacher.wt = newWt;
                let penaltypos = findSection(chosenDay, thisTeacher, week, thisCourse);
                penalty = penaltypos[0];
                pos = penaltypos[1];
            }
            if (!chosenDay.includes(pos[0])) {
                dayCounter -= 1;
                chosenDay.push(pos[0]);
            }
            coursesInfo[thisCourse.cid] = { "penalty": penalty, "position": [...pos] };
            week[pos[0]][pos[1]].push(thisCourse);
        }
    }
    return week;
}



function initializer(teacherList) {
    let teacherLists = sortTeacherList(teacherList);
    let week = initializeWeek();
    let fix = fixCourseHandler(week, fixCourses);
    let preSolution = explicitInitializer(fix, teacherLists[0]);
    let solution = impilicitInitializer(preSolution, teacherLists[1]);
    return solution;

}






//-------------------------------------optimizer---------------------------------

//moves a course to another legit section
function moveCourse(week, initialpos, finalpos) {
    let course = week[initialpos[0]][initialpos[1]].splice(initialpos[2], 1)[0];
    week[finalpos[0]][finalpos[1]].push(course);
}




//swap two course with same teacher
function swap(week, initialpos, finalpos) {
    let course = week[initialpos[0]][initialpos[1]].splice(initialpos[2], 1)[0];
    week[finalpos[0]][finalpos[1]].push(course);
    let swapcourse = week[finalpos[0]][finalpos[1]].splice(finalpos[2], 1)[0];
    week[initialpos[0]][initialpos[1]].push(swapcourse);
}



//check if in a section there is odd/even pair
function oddEvenPair(section, teacher) {
    let flag;
    for (let i = 0; i < section.length; i++) {
        if (section[i].teacher.tid === teacher.tid) {
            //** can this be written as flag!==section[i].oddEven */
            if (flag === "o" && section[i].oddEven == "e" || flag === "e" && section[i].oddEven == "o") return true;
            flag = section[i].oddEven;
        }
    }
    return false;
}


function oddEvenPairNumber(section) {
    let odd = 0;
    let even = 0;
    for (let i = 0; i < section.length; i++) {
        if (section[i].oddEven === "o")
            odd++;
        if (section[i].oddEven === "e")
            even++;
    }
    return ((odd + even) - Math.abs(odd - even)) / 2
}




//check if swap action does not violate our hard constraints
function isSwapLegit(course, startPoint, endPoint) {
    let endCourseIndeces = findIndex(endPoint, course.teacher);
    let course2 = endPoint[endCourseIndeces];
    let condition1 = oddEvenPair(startPoint, course.teacher);
    let condition2 = oddEvenPair(endPoint, course.teacher);
    if (condition1 && condition2) return true;
    if (condition1) {
        // console.log("startPoint");
        if (course.oddEven === course2.oddEven) return true;
        else return false;
    }
    if (condition2) {
        // console.log("endPoint");
        if (course.oddEven !== undefined) return true;
        else return false;
    }
    return true;
}



//check if the swap action minimize our soft constraints
function isSwapGood(course, day1, section, week) {
    let copyweek = structuredClone(week);
    let pos = coursesInfo[course.cid]["position"];
    let ind = findIndex(week[day1][section], course.teacher);
    let index = findCourseIndex(week[pos[0]][pos[1]], course);
    let anotherCourse = week[day1][section][ind];
    let bfCourse = currentEval(anotherCourse, day1, section, copyweek);
    let blCourse = currentEval(course, pos[0], pos[1], copyweek);
    let bsum = bfCourse + blCourse;
    swap(copyweek, [...coursesInfo[course.cid]["position"], index], [day1, section, ind]);
    let afCourse = currentEval(anotherCourse, pos[0], pos[1], copyweek);
    let alCourse = currentEval(course, day1, section, copyweek);
    let asum = afCourse + alCourse;
    if (asum > bsum) return true;
    return false;
}





function isSwapGoodWithIndex(course, day1, section, week, ind) {
    let copyweek = structuredClone(week);
    let pos = coursesInfo[course.cid]["position"];
    let index = findCourseIndex(week[pos[0]][pos[1]], course);
    let anotherCourse = week[day1][section][ind];
    let bfCourse = currentEval(anotherCourse, day1, section, copyweek);
    let blCourse = currentEval(course, pos[0], pos[1], copyweek);
    let bsum = bfCourse + blCourse;
    swap(copyweek, [...coursesInfo[course.cid]["position"], index], [day1, section, ind]);
    let afCourse = currentEval(anotherCourse, pos[0], pos[1], copyweek);
    let alCourse = currentEval(course, day1, section, copyweek);
    let asum = afCourse + alCourse;
    if (asum > bsum) return true;
    return false;
}



//main logic behind optimizer
function optimizer(week, rawcourseList) {
    let k = 0;
    while (k < rawcourseList.length) {
        let thisCourse = rawcourseList[k]
        let days = Object.keys(findTeacherfromTL(thisCourse.teacher.tid).wt);
        let penalty = coursesInfo[thisCourse.cid]["penalty"];
        let pos = coursesInfo[thisCourse.cid]["position"];
        let index = week[pos[0]][pos[1]].indexOf(thisCourse);
        let flag = false;
        let swapFlag = false;
        let temppos = null;
        let alternateC = null;
        let destinationI = null;
        days.forEach(day => {
            day = Number(day);
            thisCourse.teacher.wt[day].forEach(sec => {
                if (day !== pos[0] || sec !== pos[1]) {
                    var tempenalty = evaluation(thisCourse, day, sec, week);
                    if (tempenalty > penalty) {
                        if (ttc(thisCourse.teacher.name, week[day][sec])) {
                            temppos = coursesInfo[thisCourse.cid]["position"];
                            pos = [day, sec];
                            penalty = tempenalty;
                            flag = true;
                            swapFlag = false;
                        }
                        else {
                            let AllIndeces = findAllIndeces(week[day][sec], thisCourse.teacher);
                            if (isSwapLegit(thisCourse, week[pos[0]][pos[1]], week[day][sec])) {
                                if (AllIndeces.length === 1) {
                                    if (isSwapGood(thisCourse, day, sec, week)) {
                                        destinationI = findIndex(week[day][sec], thisCourse.teacher);
                                        alternateC = week[day][sec][destinationI];
                                        temppos = coursesInfo[thisCourse.cid]["position"];
                                        pos = [day, sec];
                                        penalty = tempenalty;
                                        flag = true;
                                        swapFlag = true;
                                    }
                                } else {
                                    if (isSwapGood(thisCourse, day, sec, week)) {
                                        let thisIndex = findSameOddEven(week[day][sec], thisCourse);
                                        if (thisIndex !== undefined && isSwapGoodWithIndex(thisCourse, day, sec, week, thisIndex)) {
                                            destinationI = thisIndex;
                                            alternateC = week[day][sec][thisIndex];
                                            temppos = coursesInfo[thisCourse.cid]["position"];
                                            pos = [day, sec];
                                            penalty = tempenalty;
                                            flag = true;
                                            swapFlag = true;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

            })
        })
        if (flag) {
            if (swapFlag) {
                // console.log("swap",thisCourse.courseName,alternateC.courseName,pos,temppos,index,destinationI);
                swap(week, [...temppos, index], [...pos, destinationI]);
                coursesInfo[alternateC.cid] = { "penalty": currentEval(alternateC, temppos[0], temppos[1], week), "position": [...temppos] };
                coursesInfo[thisCourse.cid] = { "penalty": penalty, "position": [...pos] };
                updatePenalty(week, rawcourseList);
                //this change make it really fast
                // k = 0;
                optimizer(week, [...week[pos[0]][pos[1]], ...week[temppos[0]][temppos[1]]]);
            } else {
                // console.log("not swap",thisCourse.courseName,penalty,pos,temppos,coursesInfo[thisCourse.cid]);
                week[temppos[0]][temppos[1]].splice(index, 1);
                coursesInfo[thisCourse.cid] = { "penalty": penalty, "position": [...pos] };
                week[pos[0]][pos[1]].push(thisCourse);
                updatePenalty(week, rawcourseList);
                k = 0;
            }

        } else ++k;
    }
    return week;
}













//-------------------------------evaluation-------------------------------------

//check if there is gap between teacher courses
function gapChecker(week, teacher) {
    let point = 0;
    let check_point = -1;
    for (let i = 0; i < week.length; i++) {
        if (teacher.wt.hasOwnProperty(i)) {
            for (let j = 0; j < week[i].length; j++) {
                if (teacher.wt[i].includes(j) || teacher.wt[i].includes(5)) {
                    if (!ttc(teacher.name, week[i][j])) {
                        if (check_point !== -1) {
                            point += j - check_point - 1;
                        }
                        check_point = j;
                    }
                }

            }
            check_point = -1;
        }
    }
    return point;
}

//simulate the week in case of any swap or move action occurs
function simulator(course, day, section, week) {
    let copyweek = structuredClone(week);
    if (coursesInfo.hasOwnProperty(course.cid)) {
        let pos = coursesInfo[course.cid]["position"];
        let index = findCourseIndex(copyweek[pos[0]][pos[1]], course);
        if (ttc(course.teacher.name, copyweek[day][section])) {
            moveCourse(copyweek, [...pos, index], [day, section]);
        }
        else {
            let AllIndeces = findAllIndeces(week[day][section], course.teacher);
            if (AllIndeces.length === 1) {
                let ind = findIndex(week[day][section], course.teacher);
                let index = findCourseIndex(week[pos[0]][pos[1]], course)
                swap(copyweek, [...pos, index], [day, section, ind]);
            }
            else {
                let ind = findSameOddEven(week[day][section], course);
                let index = findCourseIndex(week[pos[0]][pos[1]], course);
                // console.log(week[pos[0]][pos[1]][index].courseName)
                swap(copyweek, [...pos, index], [day, section, ind]);
            }
        }

    }

    else {
        copyweek[day][section].push(course);
    }
    return copyweek;
}





function getpenalty(diff) {
    if (diff == 1) return 5;
    else if (diff < 4) return 4;
    else return 3;
}










function generaleval(week) {
    let penalty = 0;
    for (let i = 0; i < week.length; i++) {
        for (let j = 0; j < week[i].length; j++) {
            for (let k = 0; k < week[i][j].length; k++) {
                penalty += currentEval(week[i][j][k], i, j, week);
            }
        }
    }
    return penalty;
}



//evaluate for simulated week
// let gap = [t5,t9];
function evaluation(course, day, section, week) {
    let simulatedWeek = simulator(course, day, section, week);
    let penalty = 0;
    let exception = 0;
    for (let i = 0; i < simulatedWeek[day][section].length; i++) {
        // console.log(simulatedWeek[day][section][i],day,section);
        if (simulatedWeek[day][section][i].cid == course.cid) continue;
        if (customInclude(course.prereqs, simulatedWeek[day][section][i])) {
            exception++;
            continue;
        }
        if (simulatedWeek[day][section][i].major === course.major || course.major === "mutual" || simulatedWeek[day][section][i].major === "mutual") {
            if (simulatedWeek[day][section][i].oddEven !== undefined) {
                if (course.oddEven !== undefined) {
                    if (course.oddEven !== simulatedWeek[day][section][i].oddEven) {
                        exception++;
                        continue;
                    }
                }
            }
            if (simulatedWeek[day][section][i].semester === course.semester) penalty += 10;
            else {
                let semesterDiff = Math.abs(simulatedWeek[day][section][i].semester - course.semester);
                penalty += getpenalty(semesterDiff);
            }
        }
    }


    if (simulatedWeek[day][section].length > 3) penalty += simulatedWeek[day][section].length - 2 - exception;
    if (course.teacher.gapPenalty) penalty += 3 * gapChecker(simulatedWeek, course.teacher);
    if (course.teacher.prefers !== "no-pre") {
        penalty -= prefers(course.teacher.prefers, section);
    }



    return penalty * (-1);
}






//evaluate for current week
function currentEval(course, day, section, week) {
    let simulatedWeek = structuredClone(week);
    let penalty = 0;
    let exception = 0;
    for (let i = 0; i < simulatedWeek[day][section].length; i++) {
        // console.log(simulatedWeek[day][section][i],day,section);
        if (simulatedWeek[day][section][i].cid == course.cid) continue;
        if (customInclude(course.prereqs, simulatedWeek[day][section][i])) {
            exception++;
            continue;
        }
        if (simulatedWeek[day][section][i].major === course.major || course.major === "mutual" || simulatedWeek[day][section][i].major === "mutual") {

            if (simulatedWeek[day][section][i].oddEven !== undefined) {
                if (course.oddEven !== undefined) {
                    if (course.oddEven !== simulatedWeek[day][section][i].oddEven) {
                        exception++;
                        continue;
                    }
                }
            }
            if (simulatedWeek[day][section][i].semester === course.semester) penalty += 10;
            else {
                let semesterDiff = Math.abs(simulatedWeek[day][section][i].semester - course.semester);
                penalty += getpenalty(semesterDiff);
            }
        }
    }


    if (simulatedWeek[day][section].length > 3) {

        penalty += simulatedWeek[day][section].length - 2 - exception - oddEvenPairNumber(simulatedWeek[day][section]);
    }
    if (course.teacher.gapPenalty) penalty += 3 * gapChecker(simulatedWeek, course.teacher);
    if (course.teacher.prefers !== "no-pre") {
        penalty -= prefers(course.teacher.prefers, section);
    }


    return penalty * (-1);
}




function prefers(prefer, section) {
    if (prefer === "morningOri") {
        return .4 - (section) / 10;
    }
    else
        return section / 10;

}




//------------------------------random mode------------------------------------
//change the order of the courses in course list
function shuffleCourse(courseList) {
    let copy = courseList;
    let newList = [];
    let size = copy.length;
    for (let i = 0; i < size; i++) {
        let inde = getRandomNumber(0, copy.length);
        newList.push(copy[inde]);
        copy.splice(inde, 1);
    }
    return newList;
}


//count whole teacher sections 
function teacherSections(teacherwt) {
    let keys = Object.keys(teacherwt);
    let sections = 0;
    for (let i = 0; i < keys.length; i++) {
        sections += teacherwt[keys[i]].length;
    }
    return sections;
}


//count teachers courses
function countTeacherCourses(courseList, teacher) {
    let count = 0;
    let odd = 0;
    let even = 0;
    for (let i = 0; i < courseList.length; i++) {
        if (courseList[i].teacher.name === teacher.name) {
            if (courseList[i].oddEven === undefined) count++;
            else {
                if (courseList[i].oddEven === "o") odd++;
                else even++;
            }
        }
    }
    count += Math.abs(odd - even);
    count += .5 * Math.min(odd, even);
    return count;
}


//returns an array in this order :full-time courses then largest haf-time courses whether it's odd courses or enven courses
function sortCourses(courseList) {
    let fullTimeCourses = [];
    let halfTimeCoursesOdd = [];
    let halfTimeCoursesEven = [];
    for (let i = 0; i < courseList.length; i++) {
        if (courseList[i].oddEven === undefined) fullTimeCourses.push(courseList[i]);
        else if (courseList[i].oddEven === "o") halfTimeCoursesOdd.push(courseList[i]);
        else if (courseList[i].oddEven === "e") halfTimeCoursesEven.push(courseList[i]);
    }
    if (halfTimeCoursesOdd.length >= halfTimeCoursesEven.length) return [...fullTimeCourses, ...halfTimeCoursesOdd, ...halfTimeCoursesEven];
    return [...fullTimeCourses, ...halfTimeCoursesEven, ...halfTimeCoursesOdd];

}


function determineExactTimeForImplicitTeachers(courseList, impteacher) {
    let z = 0;
    while (z < impteacher.length) {
        let courseNumbers = countTeacherCourses(courseList, impteacher[z]);
        let days = Number(impteacher[z].Daynumber);
        let newWt = {};
        for (let i = 0; i < days; i++) {
            let random = getRandomNumber(0, 5);
            while (anotherCustomInclude(Object.keys(newWt), random)) {
                random = getRandomNumber(0, 5)
            }
            newWt[random] = impteacher[z].wt[random];
        }
        if (teacherSections(newWt) >= courseNumbers) {
            findTeacherfromTL(impteacher[z].tid).wt = newWt;
            z++;
        }
    }
}

function giveEachCourseRandomTime(courseList) {
    let newWeek = initializeWeek();
    for (let i = 0; i < courseList.length; i++) {
        let thisCourse = courseList[i];
        let days = Object.keys(findTeacherfromTL(thisCourse.teacher.tid).wt);
        let points = Number.NEGATIVE_INFINITY;
        let pos = [];
        let randomDay = days[getRandomNumber(0, days.length)];
        randomDay = Number(randomDay);
        let randomSection = thisCourse.teacher.wt[randomDay][getRandomNumber(0, thisCourse.teacher.wt[randomDay].length)];
        while (!ttc(thisCourse.teacher.name, newWeek[randomDay][randomSection]) && !ttc1(thisCourse, newWeek[randomDay][randomSection])) {
            randomDay = days[getRandomNumber(0, days.length)];
            randomDay = Number(randomDay);
            randomSection = thisCourse.teacher.wt[randomDay][getRandomNumber(0, thisCourse.teacher.wt[randomDay].length)];
        }
        pos = [randomDay, randomSection];
        newWeek[pos[0]][pos[1]].push(thisCourse);
        points = currentEval(thisCourse, randomDay, randomSection, newWeek);
        coursesInfo[thisCourse.cid] = { "penalty": points, "position": [...pos] };
    }
    return newWeek;

}

function randomInitializer(courseList, impteacher) {
    determineExactTimeForImplicitTeachers(courseList, impteacher);
    return giveEachCourseRandomTime(courseList);
}




var wts = [];
var impteacher = sortTeacherList(teacherList)[1];
impteacher.forEach(element => {
    wts.push(element.wt);
})


function randomIteration(iteration) {
    let penalty = Number.NEGATIVE_INFINITY;
    let chosenWeek = null;
    var tempCoursesInfo = {};
    for (let i = 0; i < iteration; i++) {
        coursesInfo = {};
        for (let i = 0; i < impteacher.length; i++) {
            impteacher[i].wt = wts[i];
        }
        normalCourses = sortCourses(normalCourses);
        // console.log("start ini -------------------------------------------")
        let week = randomInitializer(normalCourses, impteacher);
        updatePenalty(week, normalCourses);
        // console.log("start opt -------------------------------------------")
        let opt = optimizer(week, normalCourses);
        let tempPenalty = generaleval(opt);
        if (penalty < tempPenalty) {
            penalty = tempPenalty;
            chosenWeek = opt;
            tempCoursesInfo = coursesInfo;
            console.log("random iteration", penalty);
        }
    }
    coursesInfo = tempCoursesInfo;
    return chosenWeek;
}


//this function does reordering the course list and pass it to optimizer
function shuffleCourseList(iteration) {
    let bestPenalty = Number.NEGATIVE_INFINITY;
    let chosen;
    for (let i = 0; i < iteration; i++) {
        for (let i = 0; i < impteacher.length; i++) {
            impteacher[i].wt = wts[i];
        }
        coursesInfo = {};
        normalCourses = shuffleCourse(normalCourses);
        let week = initializer(teacherList);
        updatePenalty(week, normalCourses);
        let opt = optimizer(week, normalCourses);
        let penalty = generaleval(opt);
        if (penalty > bestPenalty) {
            bestPenalty = penalty;
            chosen = opt;
            console.log("shuffle", bestPenalty);
        }
    }
    return chosen;
}



function randomMode(iteration) {
    iteration = Math.ceil(iteration / 2);
    let random1 = randomIteration(iteration);
    let random2 = shuffleCourseList(iteration);
    let penalty1 = generaleval(random1);
    let penalty2 = generaleval(random2);
    if (penalty1 >= penalty2) {
        return random1;
    }
    return random2;
}



function selectAlgorithm(algo, iteration) {
    if (algo === "r")
        return randomMode(iteration);
    else {
        const week = initializer(teacherList);
        updatePenalty(week, normalCourses);
        const opt = optimizer(week, normalCourses);
        return opt;
    }
}


module.exports = { selectAlgorithm };

console.timeEnd("time");