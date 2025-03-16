const arrow = document.querySelector(".arrow-image");
const sidebar = document.querySelector(".sidebar");
sidebar.style.left = "-200px";


arrow.addEventListener("click",()=>{
  if (sidebar.style.left === "-200px") {
      sidebar.style.left = "0";
      arrow.style.left = "200px";
    }else {
      sidebar.style.left = "-200px";
      arrow.style.left = "0";
    }
})




  