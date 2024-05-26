// ==UserScript==
// @name         Doc: City Manager
// @namespace    https://politicsandwar.com/nation/id=19818
// @version      10.0.0
// @description  Improving the experience of switching improvements.
// @author       BlackAsLight
// @match        https://politicsandwar.com/city/id=*
// @icon         https://avatars.githubusercontent.com/u/44320105
// @grant        none
// ==/UserScript==
'use strict';
function r(n){return new Promise(t=>setTimeout(()=>t(!0),n))}async function u(n,t=0){for(;n();)await r(t)}function p(n,t){return t(n),n}function l(n,t){return t(n)}function T(n,t,i){let a=document.createElement(n);if(typeof t=="function")t(a);else{if(t)for(let o in t)a[o]=t[o];i&&i(a)}return a}if(document.querySelector("#Doc_CityManager"))throw Error("This script was already injected...");document.body.append(T("div",{id:"Doc_CityManger"},n=>n.style.setProperty("display","none")));var s=document.querySelector('input[name="token"]').value,m=!1;document.querySelectorAll('form[action*="#improvements"]').forEach(n=>n.addEventListener("click",async function(t){if(!t.target||t.target.nodeName!=="INPUT")return;t.preventDefault();let i=t.target;i.toggleAttribute("disabled",!0),await u(()=>m),m=!0;let a=new DOMParser().parseFromString(await(await fetch(this.action,{method:"POST",body:(()=>{let e=new FormData;return e.append(i.name,i.value),e.append("token",s),e})()})).text(),"text/html");s=a.querySelector('input[name="token"]').value,l(i.parentElement,e=>e.nextElementSibling?e.nextElementSibling:e.previousElementSibling).textContent=l(a.querySelector(`input[name="${i.name}"]`).parentElement,e=>e.nextElementSibling?e.nextElementSibling:e.previousElementSibling).textContent;let o=[...document.querySelectorAll(".improvementQuantity")];a.querySelectorAll(".improvementQuantity").forEach((e,c)=>o[c].textContent=e.textContent),document.querySelector("#improvements").insertBefore(a.querySelector("#improvements>span"),p(document.querySelector("#improvements>span"),async e=>{await r(0),e.remove()})),m=!1,i.toggleAttribute("disabled",!1)}));
