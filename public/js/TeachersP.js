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





async function updateRecords(){
    try{
        const response = await fetch('http://127.0.0.1:5500/TeachersP/getTeachers');
        if(!response.ok){
            throw new Error(`http error: Status ${response.status}`);
        }
        const data = response.json();

        data.forEach(record => {
            makeRecords(record.name,element.tid)
        });

    }catch(Error){
        console.Error('error:',Error);
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

//data manipulation section (store and delete)
async function postData(dn,n,wt) {
    try {
      const response = await fetch('http://127.0.0.1:5500/TeachersP', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name:n,
          timing:time,
          Daynumber:dn,
          wt: wt,
          prefers:orien,
          gapPenalty:document.querySelector("#gapPenalty").checked
        })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error:', error);
    }
  }



form.addEventListener("submit",(e)=>{
    e.preventDefault();
    const Daynumber = Number(document.querySelector("#dayNumber").value);
    const firstName = fname.value;
    const lastName = lname.value;
    const fullName = firstName+" "+lastName;
    const wt = time==="explicit"? processWorkTime1(work_times): processWorkTime2(secti);
    if(validation(firstName,lastName)){
        postData(Daynumber,fullName,wt);
        work_times = [];
        location.reload();
    }
})


async function deleteRecord(Id){
    try{
        const response = await fetch(`http://127.0.0.1:5500/Teachers/${Id}`,{
            method:'DELETE'
        });

        if(!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        console.log(`Teacher with id:${Id} Deleted succesfully`)

    }catch(error){
        console.error('Error:',error)
    }

}







//ui related code
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



delall.addEventListener("click",()=>{
    localStorage.clear();
    location.reload();
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

