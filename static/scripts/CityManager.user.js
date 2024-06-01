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
function r(n){return new Promise(e=>setTimeout(()=>e(!0),n))}async function u(n,e=0){for(;n();)await r(e)}function p(n,e){return e(n),n}function l(n,e){return e(n)}function T(n,e,i){let a=document.createElement(n);if(typeof e=="function")e(a);else if(e){for(let[o,t]of Object.entries(e))t!=null&&(a[o]=t);i&&i(a)}return a}if(document.querySelector("#Doc_CityManager"))throw Error("This script was already injected...");document.body.append(T("div",{id:"Doc_CityManger"},n=>n.style.setProperty("display","none")));var s=document.querySelector('input[name="token"]').value,m=!1;document.querySelectorAll('form[action*="#improvements"]').forEach(n=>n.addEventListener("click",async function(e){if(!e.target||e.target.nodeName!=="INPUT")return;e.preventDefault();let i=e.target;i.toggleAttribute("disabled",!0),await u(()=>m),m=!0;let a=new DOMParser().parseFromString(await(await fetch(this.action,{method:"POST",body:(()=>{let t=new FormData;return t.append(i.name,i.value),t.append("token",s),t})()})).text(),"text/html");s=a.querySelector('input[name="token"]').value,l(i.parentElement,t=>t.nextElementSibling?t.nextElementSibling:t.previousElementSibling).textContent=l(a.querySelector(`input[name="${i.name}"]`).parentElement,t=>t.nextElementSibling?t.nextElementSibling:t.previousElementSibling).textContent;let o=[...document.querySelectorAll(".improvementQuantity")];a.querySelectorAll(".improvementQuantity").forEach((t,f)=>o[f].textContent=t.textContent),document.querySelector("#improvements").insertBefore(a.querySelector("#improvements>span"),p(document.querySelector("#improvements>span"),async t=>{await r(0),t.remove()})),m=!1,i.toggleAttribute("disabled",!1)}));
