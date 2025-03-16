const save = document.querySelector("#save");
const teachersDiv = document.querySelector(".teachers");
const teachers = document.querySelectorAll(".teacher");
const rescheduling = document.querySelector("#rescheduling");
const back = document.querySelector("#back");
const home = document.querySelector("#home");
const algorithm = document.querySelectorAll(".algorithm");
const part2 = document.querySelector(".part2");
const form = document.querySelector("#form-id");
const iter = document.querySelector(".iter");
const myprog = document.querySelector(".my-prog");
const container = document.querySelector(".container");
const logicConfClose = document.querySelector(".close");
const alertBox1 = document.querySelector(".alert-box1");
const homeButton = document.querySelector(".homeButton");
const cancel1 = document.querySelector(".cancel1");
const teacherDisplay = document.querySelector("#teacherDisplay");
const oddEdis = document.querySelectorAll(".oddEdis");
const termnum = document.querySelector("#termnum");
const group = document.querySelector("#group");


let algo;
let iteration;
let selectedTeacher = localStorage.getItem("selectedTeacher")===null?[]:JSON.parse(localStorage.getItem("selectedTeacher")); 


updateTeacherRecords();
updateDisplay();
displaySchedule(JSON.parse(localStorage.getItem("schedule")));



teachers.forEach(teacher=>{
    teacher.addEventListener("click",()=>{
        if(selectedTeacher!==null){
            document.querySelector(`#${selectedTeacher}`).classList.remove("selected-teacher");
            selectedTeacher = teacher.tid;
            teacher.classList.add("selected-teacher");
        }else{
            selectedTeacher = teacher.tid;
            teacher.classList.add("selected-teacher");
        }
    })
})


function makeList(variable){
    let list = "["+localStorage.getItem(`${variable}`)+"]";
    return JSON.parse(list);
}


function updateDisplay(){
    oddEdis.forEach(element=>{
        if(element.value === localStorage.getItem("oeb"))
            element.checked = true;
        else if(null === localStorage.getItem("oeb") && element.value === "b")
            element.checked = true;
        })
    if(localStorage.getItem("termnum")){
        termnum.checked = true;
    }
    if(localStorage.getItem("group")){
        group.checked = true;
    }
    if(localStorage.getItem("td")){
        teacherDisplay.checked = true;
        teachersDiv.style.display = "block";
    }
    selectedTeacher.forEach(element=>{
        document.querySelector(`#${element}`).classList.add("selected-teacher");
    })


}


function updateTeacherRecords(){
    let list = makeList("teachers");
    if(list[0]!==null){
        list.forEach((element)=>{
            makeTeacherRecords(element.name,element.tid);
        })
    }
}

function toggleArray(array, value) {
    var index = array.indexOf(value);

    if (index === -1) {
        array.push(value);
    } else {
        array.splice(index, 1);
    }
}


function findGroupName(id){
    let list = makeList("groups");
    for(let i=0;i<list.length;i++){
        if(list[i].gid === id)
            return list[i].gname;
    }return "مشترک" ;
}

function makeTeacherRecords(name,id){
    const div = document.createElement("div");
    const p = document.createElement("p");
    p.appendChild(document.createTextNode(name))
    div.classList.add("teacher");
    div.id = id;
    div.appendChild(p);
    teachersDiv.appendChild(div);
    div.addEventListener("click",()=>{
        if(div.classList.contains("selected-teacher")){
            div.classList.toggle("selected-teacher"); 
            toggleArray(selectedTeacher,div.id);
            localStorage.setItem("selectedTeacher",JSON.stringify(selectedTeacher));
            console.log(selectedTeacher);
            location.reload();
        }else{
            div.classList.toggle("selected-teacher");
            toggleArray(selectedTeacher,div.id);
            localStorage.setItem("selectedTeacher",JSON.stringify(selectedTeacher));
            console.log(selectedTeacher);
            location.reload();
        }
    }
    )}


function returnCourse(cid){
    list = makeList("courses");
    for(let i = 0;i<list.length;i++)
        if(list[i].cid === cid)
            return list[i];
    
}


function displaySchedule(schedule){
    for(let i=0;i<5;i++)
        for(let j=0;j<5;j++)
          for(let k=0;k<schedule[i][j].length;k++){
        let section = document.querySelector(`#s${i}${j+1}`);
        let p = document.createElement("p");
        let courseName;
        let moreinfo="";
        let course = returnCourse(schedule[i][j][k]);
        if(course.cid==="c7s"){
            console.log(course.gid);
            console.log(findGroupName(course.gid))
        }
            if(!teacherDisplay.checked || selectedTeacher.length ===0){
            if(course.cid==="c7s"){
                console.log("test1")
            }
            if(localStorage.getItem("oeb")!==null){
                if(localStorage.getItem("oeb") === course.oddEven || course.oddEven ===undefined){
                    courseName = course.courseName;
                    if(localStorage.getItem("termnum"))
                        moreinfo = "--"+course.semester
                    if(localStorage.getItem("group"))
                        moreinfo = moreinfo + "--"+findGroupName(course.major);
                    p.appendChild(document.createTextNode(courseName+moreinfo));
                    section.appendChild(p)
                }else continue;
            }else{
                if(localStorage.getItem("termnum"))
                    moreinfo = "--"+course.semester
                if(localStorage.getItem("group"))
                    moreinfo = moreinfo + "--"+findGroupName(course.major);
                courseName = course.courseName+moreinfo;
                if(course.cid==="c7s"){
                    console.log(course.major);
                }
                p.appendChild(document.createTextNode(courseName));
                section.appendChild(p)
                    }
                }else{
                    if(course.cid==="c7s"){
                        console.log("test2")
                    }
                    if(selectedTeacher.includes(course.teacher)){
                    if(localStorage.getItem("oeb")!==null){
                        if(localStorage.getItem("oeb") === course.oddEven || course.oddEven ===undefined){
                            courseName = course.courseName;
                            if(localStorage.getItem("termnum"))
                                moreinfo = "--"+course.semester
                            if(localStorage.getItem("group"))
                                moreinfo = moreinfo + "--"+findGroupName(course.major);
                            p.appendChild(document.createTextNode(courseName+moreinfo));
                            section.appendChild(p)
                        }else continue;
                    }else{
                        if(localStorage.getItem("termnum"))
                            moreinfo = "--"+course.semester
                        if(localStorage.getItem("group"))
                            moreinfo = moreinfo + "--"+findGroupName(course.major);
                        courseName = course.courseName+moreinfo;
                        p.appendChild(document.createTextNode(courseName));
                        section.appendChild(p)
                            }
                }
            }

        }
}

oddEdis.forEach(element=>{
    element.addEventListener("click",()=>{
        if(element.value === "o")
            localStorage.setItem("oeb","o");
        else if(element.value === "e")
            localStorage.setItem("oeb","e");
        else
            localStorage.removeItem("oeb");
        location.reload()
    }
)
})


teacherDisplay.addEventListener("click",()=>{
    if(teacherDisplay.checked === true){
        teachersDiv.style.display = "block";
        localStorage.setItem("td",1);
    }
    else{
        teachersDiv.style.display = "none";
        localStorage.removeItem("td");
    }
    
})


termnum.addEventListener("click",()=>{
    if(termnum.checked){
        localStorage.setItem("termnum",1);
        location.reload();
    }
    else{
        localStorage.removeItem("termnum");
        location.reload();
    }
})




group.addEventListener("click",()=>{
    if(group.checked){
        localStorage.setItem("group",1);
        location.reload();
    }
    else{
        localStorage.removeItem("group");
        location.reload();
    }
})





save.addEventListener("click",()=>{
    console.log("save");
})


rescheduling.addEventListener("click",()=>{
    container.style.display = "block";
})


back.addEventListener("click",()=>{
    window.location.replace("./logicconf.html");
})


home.addEventListener("click",()=>{
    alertBox1.style.display = "block";
    
})



logicConfClose.addEventListener("click",()=>{
    container.style.display = "none";

})



homeButton.addEventListener("click",()=>{
    localStorage.clear();
    window.location.replace("./home.html");
})

cancel1.addEventListener("click",()=>{
    alertBox1.style.display = "none";

})




algorithm.forEach(el=>{
    el.addEventListener("click",()=>{
        if(el.value === "r"){
            algo = "r";
            part2.style.display = "block";}
        else{
            algo = "c";
            part2.style.display = "none";
        }

    })
})


form.addEventListener("submit",e=>{
    e.preventDefault();
    if(algo !== undefined){
        if(algo === "r"){
            if(iter.value  !== ""){
                localStorage.setItem("algo",algo);
                localStorage.setItem("iter",iter.value);
                location.reload();
            }else alert("مقدار تکرار را وارد کنید") }
        else{
            localStorage.setItem("algo",algo);
            localStorage.removeItem("iter");
            location.reload();
        }
    }else alert("نوع الگوریتم را مشخص کنید");
})

