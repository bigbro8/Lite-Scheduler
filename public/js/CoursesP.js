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








updateTeacherRecords();
updateCourse();
updateGroups();

function teacherCourses(teacher){
    let list = makeList("courses");
    let myList = [];
    for(let i = 0;i<list.length;i++){
        if(list[i].teacher === teacher)
            myList.push(list[i]);
    }
    return myList;

}

function teacherSections(teacherId){
    let teacher = returnTeacher(teacherId);
    let days = Object.keys(teacher.wt);
    if(teacher.timing === "implicit")
       return teacher.wt[days[0]].length*Number(teacher.Daynumber);
    else{
        let counter =0;
        days.forEach(day=>{
            counter += teacher.wt[day].length;
        })
        return counter;
    }
}



function courseNumberValidation(teacher,oddEven,hours){
    console.log(teacher)
    let allCourses = teacherCourses(teacher);
    let allCoursesNumber = allCourses.length+1;
    var odd = 0;
    var even = 0;
    if(oddEven === "o"){
        odd++;
        allCoursesNumber++;
    }
    else if(oddEven === "e"){
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
    let sections = teacherSections(teacher);
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


function updateTeacherRecords(){
    let list = makeList("teachers");
    if(list[0]!==null){
        list.forEach((element)=>{
            makeTeacherRecords(element.name,element.tid);
        })
    }
}

function updateCourse(){
    let list = makeList("courses");
    if(list[0]!==null){
        for(let i = 0;i<list.length;i++){
            if(list[i].cid.slice(-1)!=="s"){
            let teacher_name = findTeacher(list[i].teacher);
            makeCourses(list[i].cid,list[i].courseName,teacher_name);
            makeCoursesRecords(list[i].cid,list[i].courseName,teacher_name);
            }
        }
    }
}

function deleteRecord(thisId){
    let list = makeList("courses");
    let temp = "";
    for(let i = 0;i<list.length;i++){
        if(list[i].cid === thisId || list[i].cid === thisId+"s"){
            continue;}
        temp+=JSON.stringify(list[i])+",";
    }
    temp = temp.slice(0,temp.length-1);
    if(temp.length !== 0){
        localStorage.setItem("courses",temp);
    }else{
        localStorage.removeItem("courses");
        localStorage.setItem("cid","c1");
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


function findTeacher(id){
    let list = makeList("teachers");
    for(let i = 0;i<list.length;i++){
        if(list[i].tid === id){
            return list[i].name;
        }
    }
}


function returnTeacher(id){
    let list = makeList("teachers");
    for(let i = 0;i<list.length;i++){
        if(list[i].tid === id){
            return list[i];
        }
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




delall.addEventListener("click",()=>{
    localStorage.removeItem("courses");
    localStorage.removeItem("cid");
    location.reload();
})



function makeTeacherRecords(name,id){
    const div = document.createElement("div");
    const p = document.createElement("p");
    p.appendChild(document.createTextNode(name))
    div.classList.add("teacher");
    div.id = id;
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
    img.addEventListener("click",()=>{
            deleteRecord(id);
            div.remove();
            document.querySelector("."+id).remove();
            location.reload();
        })


}

function validation(name,radio,selectedTeacher,oddEven,hours){
    if(name.length === 0){
        alert("لطفا نام درس را وارد کنید");
        return false;
    }

    if(!radio){
        alert("لطفا تعداد ساعات درس را وارد کنید");
        return false;
    }
    if(!selectedTeacher){
        if(!isfix.checked){
        alert("لطفا استاد درس را انتخاب کنید");
        return false;
    }
    }
    if(!courseNumberValidation(selectedTeacher,oddEven,hours)){
        alert("مقدار دروس وارد شده بیشتر از زمان حضور استاد است");
        return false;
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


function chooseOddEven(){
    let o = Number(localStorage.getItem("oddNum"));
    let e = Number(localStorage.getItem("evenNum"));
    if(o<=e){
        let odd = Number(localStorage.getItem("oddNum"));
        localStorage.setItem("oddNum",odd+1);
        return "o";}
    let even = Number(localStorage.getItem("evenNum"));
    localStorage.setItem("evenNum",even+1);
    return "e";
}



form.addEventListener("submit",(e)=>{
    e.preventDefault();
    let radio = document.querySelector('input[name="hours"]:checked')?document.querySelector('input[name="hours"]:checked').value :null;
    let name = document.querySelector('#course-name').value;
    let term = document.querySelector("#itsterm");
    let oddEvenn = radio==="eo"?document.querySelector('#OddEven').value:undefined;
    let courseInstance;
    let id_ = localStorage.getItem("cid");
    let iter = 1;
    if(radio === "3h" || radio === "eo")
        iter =2;
    if(validation(name,radio,selectedTeacher,oddEvenn,radio)){
    for(let i = 0;i<iter;i++){
        if(i === 0){
            if(isfix.checked){
                let day = document.querySelector("#day1");
                let fixsection = document.querySelector("#fixsection1");
                courseInstance = {cid:id_,courseName:name,semester:Number(term.value),isfix:isfix.checked,oddEven:undefined,major:"mutual",day:Number(day.value),section:Number(fixsection.value)-1};
            }else
                courseInstance = {cid:id_,courseName:name,semester:Number(term.value),oddEven:undefined,major:group.value,isfix:isfix.checked,teacher:selectedTeacher,prereqs:selectedCourse};
            let coursesList = localStorage.getItem("courses")===null ? JSON.stringify(courseInstance) : localStorage.getItem("courses")+","+ JSON.stringify(courseInstance);
            localStorage.setItem("courses",coursesList);
            location.reload();
            }
        else{
            let ids = localStorage.getItem("cid")+"s";
            if(oddEvenn){
                if(oddEvenn === "o")
                    name = name + "/فرد";
                else
                    name = name + "/زوج";
            }else
                name = name + "/کلاس دوم";
            if(isfix.checked){
                let day = document.querySelector("#day2");
                let fixsection = document.querySelector("#fixsection2");
                courseInstance = {cid:ids,courseName:name,semester:Number(term.value),isfix:isfix.checked,oddEven:oddEvenn,major:"mutual",day:Number(day.value),section:Number(fixsection.value)-1};
            }else
                courseInstance = {cid:ids,courseName:name,semester:Number(term.value),oddEven:oddEvenn,major:group.value,isfix:isfix.checked,teacher:selectedTeacher,prereqs:selectedCourse};
            let coursesList = localStorage.getItem("courses")===null ? JSON.stringify(courseInstance) : localStorage.getItem("courses")+","+ JSON.stringify(courseInstance);
            localStorage.setItem("courses",coursesList);
            location.reload();
        }

    }

    updatePrereq(id_,selectedCourse);
    id_ ="c"+(Number(id_.slice(1))+1);
    localStorage.setItem("cid",id_);
    selectedTeacher = null;
    selectedCourse = {};

}

})





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