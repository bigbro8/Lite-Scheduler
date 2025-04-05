const teachersDiv = document.querySelector(".teachers");
const prerequirement = document.querySelector(".prereqs");
const record = document.querySelector(".record");
const teachers = document.querySelectorAll(".teacher");
const courses = document.querySelectorAll(".course");
const form = document.querySelector("#form-id");
const delall = document.querySelector(".delall");
const alertbox3 = document.querySelector(".alert-box3");
const next = document.querySelector(".next");
const prev = document.querySelector(".prev");
const realprev = document.querySelector("#real-prev");
const alertBox1 = document.querySelector("#alert-box1");
const alertBox2 = document.querySelector("#alert-box2");
const alertBox3 = document.querySelector("#alert-box3");
const cancel1 = document.querySelector("#cancel1");
const cancel2 = document.querySelector("#cancel2");
const confirm = document.querySelector("#confirm");
const confirm3 = document.querySelector("#confirm3");
const isfix = document.querySelector("#isfix");
const fix = document.querySelector(".fix");
const innerpart2 = document.querySelector(".innerpart2");
const secondC = document.querySelector(".secondC");
const oddEvenIn = document.querySelectorAll(".hours");
const oddE = document.querySelector(".oddE");
const group = document.querySelector("#group");





let selectedTeacher = null;
let selectedCourse = [];
let placeHolder = null;
let hours;



window.onload = function () {
    document.querySelector("form").reset(); // Resets all form inputs
};



updateTeacherRecords();
updateCourse();
updateGroups();

async function teacherCourses(teacher){
    try{
        const Teacher = await fetch("http://localhost:5000/getOneTeacher/"+trimTFromId(teacher));    
        if(!Teacher.ok){
            throw new Error("Network response was not ok");
        }
        const jsonTeacher = await Teacher.json();
        console.log(jsonTeacher.Courses);
        return jsonTeacher.Courses;
    }catch(error){
        console.error('error:',error); 
    }
}

async function teacherSections(teacherId){
    let teacher = await returnTeacher(teacherId);
    let days = Object.keys(JSON.parse(teacher.wt));
    if(!teacher.timing)
        return teacher.wt[days[0]].length*Number(teacher.Daynumber);
    else{
        let counter =0;
        days.forEach(day=>{
            counter += JSON.parse(teacher.wt)[day].length;
        })
        return counter;
    }
}



async function courseNumberValidation(teacher,oddEven,hours){
    let allCourses = await teacherCourses(teacher);
    let allCoursesNumber = allCourses.length+1;
    var odd = 0;
    var even = 0;
    if(oddEven==='o'){
        odd++;
        allCoursesNumber++;
    }
    else if(oddEven==='e'){
        even++;
        allCoursesNumber++;
    }
    else if(hours ==="3h"){
        allCoursesNumber ++;
    }    
    for(let i=0;i<allCourses.length;i++){
        if(allCourses[i].oddEven === "o") odd++;
        else if(allCourses[i].oddEven === "e") even++;
    }
    let notPaired = Math.abs(odd-even);
    let paired = ((odd+even) - notPaired)/2;
    let occupiedSections = (allCoursesNumber-(odd+even))+notPaired+paired;
    let sections =await teacherSections(teacher);
    // console.log("sections: ",sections,"occupiedSection: ",occupiedSections,"notPaired: ",notPaired,"paired: ",paired,"allcourses: ",allCoursesNumber,"odd: ",odd,"even: ",even);
    if(sections>=occupiedSections){
        return true;
    }
    return false;
}



function updateGroups(){
    let list = makeList("groups");
    let counter = 0;
    list.forEach(element=>{
        let option = document.createElement("option");
        option.appendChild(document.createTextNode(`${element.gname}`));
        option.value = element.gid;
        group.appendChild(option);
        counter ++;
        if(counter === 2){
            let option = document.createElement("option");
            option.appendChild(document.createTextNode("مشترک"));
            option.value = "mutual";
            group.appendChild(option);
        }
    })

}


async function updateTeacherRecords(){
    try{
        const response = await fetch("http://localhost:5000/TeachersP/getTeachers");
        if(!response.ok){
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        let list = data;
        if(list[0]!==null){
            list.forEach((element)=>{
                makeTeacherRecords(element.name,element.tid);
            })
    }}
    catch(error){
        console.log('error: ',error);
    }
}

async function updateCourse(){
    try{
        const response = await fetch('http://localhost:5000/CoursesP/getCourses');
        if(!response.ok){
            throw new Error(`http error: Status ${response.status}`);
        }
        const data = await response.json();
        if(data.length!==0){
            for(let i = 0;i<data.length;i++){
                if(!data[i].isSecond){
                let teacher_name = data[i].Teacher.name;
                makeCourses(data[i].id,data[i].coursename,teacher_name);
                makeCoursesRecords(`c${data[i].id}`,data[i].coursename,teacher_name);
                }
            }
        }
    }catch(error){
        console.error('error:', error);
    }
}

async function deleteRecord(Id){
    try{
        const response = await fetch(`http://localhost:5000/CoursesP/${Id}`,{
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




function makeList(variable){
    let list = "["+localStorage.getItem(`${variable}`)+"]";
    return JSON.parse(list);
}


function deletebracket(list){
    let arr = list.split("");
    arr.splice(0,1);
    arr.splice(-1,1);
    list = arr.join("");
    return list;

}


function toggleArray(array, value) {
    var index = array.indexOf(value);

    if (index === -1) {
        array.push(value);
    } else {
        array.splice(index, 1);
    }
}




async function returnTeacher(id){
    try{
        const teacher = await fetch("http://localhost:5000/getOneTeacher/"+trimTFromId(id));
        if(!teacher.ok){
            throw new Error("Network response was not ok");
        }
        const jsonTeacher = await teacher.json();
        return jsonTeacher;

    }catch(error){
        console.log('errorl',error)
    }
}


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


function trimTFromId(id){
    return Number(id.substring(1));
}


delall.addEventListener("click",async ()=>{
    try{
        const response = await fetch('http://localhost:5000/CoursesP',{
            method:'DELETE'
        });
        if(!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        alert("All records are deleted successfully");
        location.reload();

    }
    catch(error){
        console.error("error:",error)
    }
})


function makeTeacherRecords(name,id){
    let newId = `t${id}`;
    const div = document.createElement("div");
    const p = document.createElement("p");
    p.appendChild(document.createTextNode(name))
    div.classList.add("teacher");
    div.id = newId;
    div.appendChild(p);
    teachersDiv.appendChild(div);
    div.addEventListener("click",()=>{
        if(selectedTeacher!==null){
            document.querySelector(`#${selectedTeacher}`).classList.remove("selected-teacher");
            selectedTeacher = div.id;
            div.classList.add("selected-teacher");
        }else{
            selectedTeacher = div.id;
            div.classList.add("selected-teacher");
        }
        })
    }


function makeCourses(id,name,teachername1){
    const div = document.createElement("div");
    const courseName = document.createElement("span");
    const teacherName = document.createElement("span");
    if(teachername1 !== undefined)
        teacherName.appendChild(document.createTextNode("استاد "+teachername1));
    else
        teacherName.appendChild(document.createTextNode(""));
    courseName.appendChild(document.createTextNode(name));
    div.classList.add("course");
    div.classList.add(id);
    div.appendChild(teacherName);
    div.appendChild(courseName);
    prerequirement.appendChild(div);
    div.addEventListener("click",()=>{
        if(div.classList.contains("selected-course")){
            div.classList.toggle("selected-course");
            toggleArray(selectedCourse,div.classList[1]);
        }else{
            div.classList.toggle("selected-course");
            toggleArray(selectedCourse,div.classList[1])
        }
        })
}


function makeCoursesRecords(id,name,teachername1){
    const div = document.createElement("div");
    const courseName = document.createElement("span");
    const teacherName = document.createElement("span");
    const img = document.createElement("img");
    img.classList.add("delete");
    img.src = "../images/icons8-delete-30.png";
    if(teachername1 !== undefined)
        teacherName.appendChild(document.createTextNode("استاد "+teachername1));
    else
        teacherName.appendChild(document.createTextNode(""));
    courseName.appendChild(document.createTextNode(name));
    div.classList.add("rec");
    div.id = id;
    div.appendChild(img);
    div.appendChild(teacherName);
    div.appendChild(courseName);
    record.appendChild(div);
    img.addEventListener("click",async ()=>{
        try{
            await deleteRecord(trimTFromId(id));
            div.remove();
            if(document.querySelector("."+id))
            document.querySelector("."+id).remove();
            location.reload();
        }catch(error){
            console.error('error:',error);}

        })


}




async function validation(name,selectedTeacher,oddEven,hours){
    if(name.length === 0){
        alert("لطفا نام درس را وارد کنید");
        return false;
    }

    if(!hours){
        alert("لطفا تعداد ساعات درس را وارد کنید");
        return false;
    }
    if(!selectedTeacher){
        if(!isfix.checked){
        alert("لطفا استاد درس را انتخاب کنید");
        return false;
    }
    }
    if(selectedTeacher && !isfix.checked){
        let teacherCapacity = await courseNumberValidation(selectedTeacher,oddEven,hours);
        if(!teacherCapacity){
            alert("مقدار دروس وارد شده بیشتر از زمان حضور استاد است");
            return false;
        }
}
    return true;
}

function updatePrereq(thiscid,cids){
    let list = makeList("courses");
    cids.forEach(cid=>{
        for(let i = 0;i<list.length;i++){
            if((cid === list[i].cid || cid+'s' === list[i].cid) && !list[i].isfix){
                list[i].prereqs.push(thiscid);
            }
        }
    })
    list = JSON.stringify(list);
    list = deletebracket(list);
    localStorage.setItem("courses",list);
}




function makeOddEvenBoolen(oddEven){
    if(oddEven === "o")
        return true;
    else if(oddEven === "e")
        return false;
    else
        return null;
}


form.addEventListener("submit",async (e)=>{
    e.preventDefault();
    let typesOfHours = document.querySelector('input[name="hours"]:checked')?document.querySelector('input[name="hours"]:checked').value :null;
    let name = document.querySelector('#course-name').value;
    let term = document.querySelector("#itsterm");
    let oddEvenn = typesOfHours==="eo"?document.querySelector('#OddEven').value:undefined;
    let tempOddEven = undefined;
    let iter = (typesOfHours === "3h" || typesOfHours === "eo")?2:1;
    let isSec = false;
    //validation should be rewritten
    let resultOfValidation = await validation(name,selectedTeacher,oddEvenn,typesOfHours);
    if(resultOfValidation){
    for(let i = 0;i<iter;i++){
        if(i === 1){
            tempOddEven = makeOddEvenBoolen(oddEvenn);
            isSec = true;
            if(oddEvenn){
                if(oddEvenn === "o")
                    name = name + "/فرد";
                else
                    name = name + "/زوج";
            }else
                name = name + "/کلاس دوم";
        }
        try{
            let response;
            if(isfix.checked){
                let day = Number(document.querySelector(`#day${i+1}`).value);
                let section=Number(document.querySelector(`#fixsection${i+1}`).value)-1;
                response = await fetch("http://localhost:5000/insertFixCourse",{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify({
                        courseName:name,
                        semester:term.value,
                        oddEven:tempOddEven,
                        isSecond:isSec,
                        major:group.value,
                        time:`{${day}:${section}}`
                    })
                });

            }else{
                response = await fetch("http://localhost:5000/insertCourse",{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify({
                        courseName:name,
                        semester:term.value,
                        oddEven:tempOddEven,
                        isSecond:isSec,
                        major:group.value,
                        teacher:trimTFromId(selectedTeacher),
                        prereqs:selectedCourse,
                    })
                });
            }
            console.log(response);
            if(!response.ok){
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

        }
        catch(error){
            console.error('error: ',error);
        }}

    // updatePrereq(id_,selectedCourse);
    selectedTeacher = null;
    selectedCourse = {};
    location.reload();
}
}
)





isfix.addEventListener("click",()=>{
    if(!isfix.checked){
        innerpart2.style.display = "block";
        fix.style.display = "none";

    }else{
        let radio = document.querySelector('input[name="hours"]:checked')?document.querySelector('input[name="hours"]:checked').value :null;
        if(radio === "3h" || radio === "eo") secondC.style.display = "block";
        else secondC.style.display = "none";
        innerpart2.style.display = "none";
        fix.style.display = "block";

    }
})



oddEvenIn.forEach(element=>{
    element.addEventListener("click",()=>{
        if(element.value === "eo" || element.value === "3h"){
            secondC.style.display = "block";
            if(element.value === "eo")
                oddE.style.display = "block";
            else
                oddE.style.display = "none";
        }else{
             secondC.style.display = "none";
            oddE.style.display = "none";}


    })
})


prev.addEventListener('click',()=>{
    alertBox1.style.display = "block";
})


realprev.addEventListener("click",()=>{
    localStorage.removeItem("courses");
    localStorage.removeItem("cid");
    window.location.replace("./defineG.html");
})


cancel1.addEventListener('click',()=>{
    alertBox1.style.display = "none";
})

cancel2.addEventListener('click',()=>{
    alertBox2.style.display = "none";
})

next.addEventListener("click",()=>{
    if(localStorage.getItem("courses") === null){
        alertBox3.style.display = "block";
    }else alertBox2.style.display = "block";
})

confirm.addEventListener("click",()=>{
    window.location.replace("./logicconf.html");
})

confirm3.addEventListener("click",()=>{
    alertBox3.style.display = "none";
})