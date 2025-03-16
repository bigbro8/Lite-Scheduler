const sections = document.querySelectorAll(".section");
const days = document.querySelectorAll(".days");
const teacherTiming = document.querySelectorAll(".teacherTiming");
const teacherOrientation = document.querySelectorAll(".teacherOrientation");
const total = document.querySelector(".total");
const record = document.querySelector(".record");
const form = document.querySelector("#form-id");
const fname = document.querySelector("#fname");
const lname = document.querySelector("#lname");
const delall = document.querySelector(".delall");
const del = document.querySelector  (".delete");
const next = document.querySelector(".next");
const prev = document.querySelector(".prev");
const alertBox1 = document.querySelector(".alert-box1");
const alertBox2 = document.querySelector(".alert-box2");
const realprev = document.querySelector(".real-prev");
const cancel1 = document.querySelector(".cancel1");
const cancel2 = document.querySelector(".cancel2");
const part21 = document.querySelector(".part21");
const part22 = document.querySelector(".part22");
const sectionsT = document.querySelectorAll(".sectionT");
let work_times = [];
let secti = [];
let time = "explicit";
let orien = "no-pre";
console.log(localStorage.getItem("teachers"));

if(localStorage.getItem("tid")===null){
    localStorage.setItem("tid","t1");
}



updateRecords();






function updateRecords(){
    let list = makeList();
    if(list[0]!==null){
        list.forEach((element)=>{
            makeRecords(element.name,element.tid);
        })
    }
}




function makeList(){
    let list = "["+localStorage.getItem("teachers")+"]";
    list = JSON.parse(list);
    return list
}


function deleteRecord(thisId){
    let list = makeList();
    let temp = "";
    for(let i = 0;i<list.length;i++){
        if(list[i].tid === thisId){
            continue;}
        temp+=JSON.stringify(list[i])+",";
    }
    temp = temp.slice(0,temp.length-1);
    if(temp.length !== 0){
        localStorage.setItem("teachers",temp);
    }else{
        localStorage.removeItem("teachers");
        localStorage.setItem("tid","t1");
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


function validation(fname,lname){
    if(fname === ""){
        alert("لطفا نام را وارد کنید");
        return false;
    }
    if(lname === ""){
        alert("لطفا نام خانوادگی را وارد کنید");
        return false; 
    }
    if(work_times.length == 0 && secti.length == 0){
        alert("لطفا روزهای حضور را وارد کنید");
        return false; 
    }
    return true;
}




function makeRecords(name,id){
    const div = document.createElement("div");
    const span = document.createElement("span");
    const img = document.createElement("img");
    span.appendChild(document.createTextNode(name))
    div.classList.add("rec");
    img.classList.add("delete");
    img.src = "../images/icons8-delete-30.png";
    div.appendChild(img);
    div.appendChild(span);
    record.appendChild(div);
    div.id = id;
    img.addEventListener("click",()=>{
        deleteRecord(id);
        div.remove();
        location.reload();
    });

}

function processWorkTime1(arr){
    let workTimes = {};
    for(let i=0;i<arr.length;i++){
        let time = arr[i];
        let day = Number(time[0]);
        let sec = Number(time[1])-1;
        if(workTimes.hasOwnProperty(day)){
            workTimes[day].push(sec);
            workTimes[day].sort();
        }
        else workTimes[day] = [sec];
    }
    return workTimes;

}

function processWorkTime2(arr){
    let workTimes = {};
    let ar = [];
    for(let i=0;i<arr.length;i++){
        ar.push(Number(arr[i]));
    }
    ar.sort();
    for(let i=0;i<5;i++){
        let day = i;
        workTimes[day] =ar;
    }

    return workTimes;

}




delall.addEventListener("click",()=>{
    localStorage.clear();
    location.reload();
})



form.addEventListener("submit",(e)=>{
    e.preventDefault();
    const Daynumber = Number(document.querySelector("#dayNumber").value);
    const firstName = fname.value;
    const lastName = lname.value;
    const fullName = firstName+" "+lastName;
    const wt = time==="explicit"? processWorkTime1(work_times): processWorkTime2(secti);
    let id_ = localStorage.getItem("tid");
    let teacher = {tid:id_,name:fullName,timing:time,Daynumber:Daynumber,wt:wt,prefers:orien,gapPenalty:document.querySelector("#gapPenalty").checked,courses:[]};
    let teachers = localStorage.getItem("teachers")===null ? JSON.stringify(teacher) : localStorage.getItem("teachers")+","+ JSON.stringify(teacher);
    if(validation(firstName,lastName)){
        localStorage.setItem("teachers",teachers);
        id_ ="t"+(Number(id_.slice(1,id_.length))+1);
        localStorage.setItem("tid",id_);
        work_times = [];
        location.reload();
    }
})




teacherTiming.forEach(element =>{
    element.addEventListener("click",()=>{
        if(element.value === "implicit"){
            time = "implicit";
            part21.style.display = "none";
            part22.style.display = "inline";
        }
        else{
            time = "explicit";
             part21.style.display = null;
             part22.style.display = "none";
            }
    })
})


teacherOrientation.forEach(element =>{
    element.addEventListener("click",()=>{
        if(element.value === "morningOri"){
            orien = "morningOri";
        }
        else if("evenningOri"){
            orien = "evenningOri";
        }else orien = "no-pre";
    })
})


sectionsT.forEach(section=>{
    section.addEventListener("click",()=>{
      section.classList.toggle("selected");
      toggleArray(secti,section.id);
    })
})



sections.forEach(section=>{
    section.addEventListener("click",()=>{
      section.classList.toggle("selected");
      toggleArray(work_times,section.id);
    })
})



days.forEach(day=>{
    day.addEventListener("click",()=>{
        for(let i=0;i<sections.length;i++){
            if(day.classList[1][4]==sections[i].id[0]){
                sections[i].classList.toggle("selected");
                toggleArray(work_times,sections[i].id);
            }
        }
    })
})


total.addEventListener("click",()=>{
sections.forEach(section=>{
    section.classList.toggle("selected");
    toggleArray(work_times,section.id);
})    
})

prev.addEventListener('click',()=>{
    alertBox1.style.display = "block";
})

realprev.addEventListener("click",()=>{
    localStorage.clear();
    window.location.replace("./home.html");
})

cancel1.addEventListener('click',()=>{
    alertBox1.style.display = "none";
})

cancel2.addEventListener('click',()=>{
    alertBox2.style.display = "none";
})

next.addEventListener("click",()=>{
    if(localStorage.getItem("teachers")===null) alertBox2.style.display = "block";
    else window.location.replace("./defineG.html");
})

