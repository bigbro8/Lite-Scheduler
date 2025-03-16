const form = document.querySelector("#form-id");
const records = document.querySelector(".records");
const next = document.querySelector(".next");
const prev = document.querySelector(".prev");

if(localStorage.getItem("gid")===null){
    localStorage.setItem("gid","g1");
}

updateRecords();



function validation(name){
    if(name.length === 0){
        alert("لطفا نام گروه را وارد کنید");
        return false;
    }
    return true;
}


function updateRecords(){
    let list = makeList();
    if(list[0]!==null){
        list.forEach((element)=>{
            makeRecords(element.gname,element.gid);
        })
    }
}

function makeList(){
    let list = "["+localStorage.getItem("groups")+"]";
    list = JSON.parse(list);
    return list
}


function deleteRecord(thisId){
    let list = makeList();
    let temp = "";
    for(let i = 0;i<list.length;i++){
        if(list[i].gid === thisId){
            continue;}
        temp+=JSON.stringify(list[i])+",";
    }
    temp = temp.slice(0,temp.length-1);
    if(temp.length !== 0){
        localStorage.setItem("groups",temp);
    }else{
        localStorage.removeItem("groups");
        localStorage.setItem("gid","g1");
    }
}




function makeRecords(name,id){
    const div = document.createElement("div");
    const span = document.createElement("span");
    const img = document.createElement("img");
    span.appendChild(document.createTextNode(name))
    div.classList.add("record");
    img.classList.add("delete");
    img.src = "../images/icons8-delete-30.png";
    div.appendChild(img);
    div.appendChild(span);
    records.appendChild(div);
    div.id = id;
    img.addEventListener("click",()=>{
        deleteRecord(id);
        div.remove();
        location.reload();
    });

}

form.addEventListener("submit",(e)=>{
    e.preventDefault();
    let id_ = localStorage.getItem("gid");
    let name = document.querySelector('#Gname').value;
    let groupInstance = {gid:id_,gname:name};
    console.log(groupInstance);
    let groupList = localStorage.getItem("groups")===null ? JSON.stringify(groupInstance) : localStorage.getItem("groups")+","+ JSON.stringify(groupInstance);
    if(validation(name)){
        console.log("ee")
        localStorage.setItem("groups",groupList);
        id_ ="g"+(Number(id_.slice(1,id_.length))+1);
        localStorage.setItem("gid",id_);
        location.reload();
    }
})



prev.addEventListener('click',()=>{
    window.location.replace("./create1.html");
})


next.addEventListener("click",()=>{
    window.location.replace("./create2.html");
})
