// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

document.addEventListener('click', (event)=>{
    if (event.target.matches('a[href^="#"]')) {
        event.preventDefault();
        document.querySelector(event.target.hash).scrollIntoView();
    }
});
