const algorithm = document.querySelectorAll(".algorithm");
const part2 = document.querySelector(".part2");
const prev = document.querySelector(".prev");
const form = document.querySelector("#form-id");
const iter = document.querySelector(".iter");



let algo;
let iteration;




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
                window.location.replace("./loading.html");
            }else alert("مقدار تکرار را وارد کنید") }
        else{
            localStorage.setItem("algo",algo);
            localStorage.removeItem("iter");
            window.location.replace("./loading");
        }
    }else alert("نوع الگوریتم را مشخص کنید");
})

prev.addEventListener("click",()=>{
    window.location.replace("./CoursesP");
})