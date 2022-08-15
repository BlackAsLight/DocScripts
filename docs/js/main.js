// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

document.querySelectorAll('a').forEach((aTag)=>{
    if (aTag.getAttribute('href')?.startsWith('#')) aTag.addEventListener('click', function(event) {
        event.preventDefault();
        if (!event.defaultPrevented) return;
        document.querySelector(this.getAttribute('href') ?? '')?.scrollIntoView({
            behavior: 'smooth'
        });
    });
});
