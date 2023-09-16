document.addEventListener("click",e=>{e.target.matches('a[href^="#"]')&&(e.preventDefault(),document.querySelector(e.target.hash).scrollIntoView())});
