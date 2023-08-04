// ==UserScript==
// @name         Doc: Military
// @namespace    https://politicsandwar.com/nation/id=19818
// @version      0.6
// @description  Making it easier to militarise and demilitarise your army.
// @author       BlackAsLight
// @match        https://politicsandwar.com/nation/military/
// @icon         https://avatars.githubusercontent.com/u/44320105
// @grant        none
// ==/UserScript==
'use strict';
var m=function(n){return localStorage[n===void 0?"getItem":n!==null?"setItem":"removeItem"]("Doc_APIKey",n)};var b={};async function y(n,i){for(;b[n];)await f(50);b[n]=!0;try{return await i()}catch(e){throw e}finally{delete b[n]}}function r(n,i){let e=document.createElement(n);return i&&i(e),e}function f(n){return new Promise(i=>setTimeout(()=>i(!0),n))}function o(){return r("div",n=>n.classList.add("spacer"))}function E(){return document.querySelector("#Doc_Config")??r("div",n=>{document.querySelector("#leftcolumn").append(n),n.setAttribute("id","Doc_Config")})}function h(n){let i=E();i.append(document.createElement("hr")),i.append(r("b",e=>e.append(n)))}function M(){let n=E();n.append(document.createElement("br")),n.append(r("button",i=>{let e=m();i.append(e?"Update API Key":"Insert API Key"),i.addEventListener("click",t=>{let s=prompt("Insert API Key | It can be found at the bottom of the Accounts Page:",e??"");s!==null&&(m(s||null),location.reload())})}))}function u(n){return y("Doc_Token",async()=>{let i=sessionStorage.getItem("Doc_Token")??document.querySelector('input[name="token"]')?.value;if(i==null){let t=await fetch("https://politicsandwar.com/city/");if(t.status===200)i=new DOMParser().parseFromString(await t.text(),"text/html").querySelector('input[name="token"]')?.value;else throw`Failed to get Token | Status Code: ${t.status}`;if(i==null)throw"Token not Found"}let e=await n(i);if(e!==void 0){if(e===null)return sessionStorage.removeItem("Doc_Token");sessionStorage.setItem("Doc_Token",e)}})}if(document.querySelector("#Doc_Military"))throw Error("This script was already injected...");document.body.append(r("div",n=>{n.setAttribute("id","Doc_Military"),n.style.setProperty("display","none")}));var a=fetch(`https://api.politicsandwar.com/graphql?api_key=${m()}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:"{me{nation{soldiers,soldiers_today,tanks,tanks_today,aircraft,aircraft_today,ships,ships_today,spies,spies_today,missiles,missiles_today,nukes,nukes_today,cities{barracks,factory,hangar,drydock},propaganda_bureau,central_intelligence_agency,spy_satellite,missile_launch_pad,space_program,nuclear_research_facility}}}"})}).then(n=>n.json()).then(n=>n.data.me.nation);h("Military");M();document.head.append(r("style",n=>{n.textContent+=".doc_military { display: grid; grid-template-columns: repeat(2, calc(50% - 0.5rem)); gap: 1rem; }",n.textContent+=".doc_military a { grid-column: 1 / 3; text-align: center; }",n.textContent+=".spacer-row { display: flex; flex-direction: row; align-items: center; }",n.textContent+=".spacer { flex-grow: 1; }",n.append("#Doc_Config { text-align: center; padding: 0 1em; font-size: 0.8em; }"),n.append("#Doc_Config b { font-size: 1.25em; }"),n.append("#Doc_Config button { font-size: inherit; font-weight: normal; padding: 0; }"),n.append("#Doc_Config hr { margin: 0.5em 0; }")}));r("form",n=>{let i=document.querySelector("#rightcolumn>.row");i.parentElement.insertBefore(n,i),i.remove(),n.classList.add("doc_military"),n.append(r("label",e=>{e.classList.add("spacer-row"),e.append("Soldiers Enlisted:",o(),r("span",t=>{t.append("?"),a.then(s=>t.textContent=s.soldiers.toString())}))}),r("label",e=>{e.classList.add("spacer-row"),e.append("Soldiers Enlisted Today:",o(),r("span",t=>{t.append("?"),a.then(s=>t.textContent=s.soldiers_today.toString())}))}),r("label",e=>{e.classList.add("spacer-row"),e.append("Enlist/Discharge:",o(),r("input",t=>{t.setAttribute("type","number"),t.setAttribute("name","soldiers"),t.setAttribute("value","0"),a.then(s=>{let l=s.cities.reduce((d,c)=>d+c.barracks,0)*3e3;t.value=Math.min(Math.round(l/3*(s.propaganda_bureau?1.1:1)-s.soldiers_today),l-s.soldiers).toString()})}))}),r("input",e=>{e.setAttribute("type","submit"),e.setAttribute("name","buysoldiers"),e.setAttribute("value","Enlist/Discharge Soldiers")}),r("a",e=>{e.setAttribute("href","https://politicsandwar.com/nation/military/soldiers/"),e.textContent="Go to Page"})),n.addEventListener("submit",p,{passive:!1}),n.querySelectorAll("input").forEach(e=>e.toggleAttribute("disabled",!0)),Promise.all([a,u(()=>{})]).then(e=>n.querySelectorAll("input").forEach(t=>t.toggleAttribute("disabled",!1)))});r("form",n=>{let i=document.querySelector("#rightcolumn>.row");i.parentElement.insertBefore(n,i),i.remove(),n.classList.add("doc_military"),n.append(r("label",e=>{e.classList.add("spacer-row"),e.append("Tanks Possessed: ",o(),r("span",t=>{t.append("?"),a.then(s=>t.textContent=s.tanks.toString())}))}),r("label",e=>{e.classList.add("spacer-row"),e.append("Tanks Manufactured Today: ",o(),r("span",t=>{t.append("?"),a.then(s=>t.textContent=s.tanks_today.toString())}))}),r("label",e=>{e.classList.add("spacer-row"),e.append("Manufacture/Decommission: ",o(),r("input",t=>{t.setAttribute("type","number"),t.setAttribute("name","tanks"),t.setAttribute("value","0"),a.then(s=>{let l=s.cities.reduce((d,c)=>d+c.factory,0)*250;t.value=Math.min(Math.round(l/5*(s.propaganda_bureau?1.1:1)-s.tanks_today),l-s.tanks).toString()})}))}),r("input",e=>{e.setAttribute("type","submit"),e.setAttribute("name","buytanks"),e.setAttribute("value","Manufacture/Decommission Tanks")}),r("a",e=>{e.setAttribute("href","https://politicsandwar.com/nation/military/tanks/"),e.textContent="Go to Page"})),n.addEventListener("submit",p,{passive:!1}),n.querySelectorAll("input").forEach(e=>e.toggleAttribute("disabled",!0)),Promise.all([a,u(()=>{})]).then(e=>n.querySelectorAll("input").forEach(t=>t.toggleAttribute("disabled",!1)))});r("form",n=>{let i=document.querySelector("#rightcolumn>.row");i.parentElement.insertBefore(n,i),i.remove(),n.classList.add("doc_military"),n.append(r("label",e=>{e.classList.add("spacer-row"),e.append("Aircraft Possessed: ",o(),r("span",t=>{t.append("?"),a.then(s=>t.textContent=s.aircraft.toString())}))}),r("label",e=>{e.classList.add("spacer-row"),e.append("Aircraft Manufactured Today: ",o(),r("span",t=>{t.append("?"),a.then(s=>t.textContent=s.aircraft_today.toString())}))}),r("label",e=>{e.classList.add("spacer-row"),e.append("Manufacture/Decommission: ",o(),r("input",t=>{t.setAttribute("type","number"),t.setAttribute("name","aircraft"),t.setAttribute("value","0"),a.then(s=>{let l=s.cities.reduce((d,c)=>d+c.hangar,0)*15;t.value=Math.min(Math.round(l/5*(s.propaganda_bureau?1.1:1)-s.aircraft_today),l-s.aircraft).toString()})}))}),r("input",e=>{e.setAttribute("type","submit"),e.setAttribute("name","buyaircraft"),e.setAttribute("value","Manufacture/Decommission Aircraft")}),r("a",e=>{e.setAttribute("href","https://politicsandwar.com/nation/military/aircraft/"),e.textContent="Go to Page"})),n.addEventListener("submit",p,{passive:!1}),n.querySelectorAll("input").forEach(e=>e.toggleAttribute("disabled",!0)),Promise.all([a,u(()=>{})]).then(e=>n.querySelectorAll("input").forEach(t=>t.toggleAttribute("disabled",!1)))});r("form",n=>{let i=document.querySelector("#rightcolumn>.row");i.parentElement.insertBefore(n,i),i.remove(),n.classList.add("doc_military"),n.append(r("label",e=>{e.classList.add("spacer-row"),e.append("Ships Possessed: ",o(),r("span",t=>{t.append("?"),a.then(s=>t.textContent=s.ships.toString())}))}),r("label",e=>{e.classList.add("spacer-row"),e.append("Ships Manufactured Today: ",o(),r("span",t=>{t.append("?"),a.then(s=>t.textContent=s.ships_today.toString())}))}),r("label",e=>{e.classList.add("spacer-row"),e.append("Manufacture/Decommission: ",o(),r("input",t=>{t.setAttribute("type","number"),t.setAttribute("name","ships"),t.setAttribute("value","0"),a.then(s=>{let l=s.cities.reduce((d,c)=>d+c.drydock,0)*5;t.value=Math.min(Math.round(l/5*(s.propaganda_bureau?1.1:1)-s.ships_today),l-s.ships).toString()})}))}),r("input",e=>{e.setAttribute("type","submit"),e.setAttribute("name","buyships"),e.setAttribute("value","Manufacture/Decommission Ships")}),r("a",e=>{e.setAttribute("href","https://politicsandwar.com/nation/military/navy/"),e.textContent="Go to Page"})),n.addEventListener("submit",p,{passive:!1}),n.querySelectorAll("input").forEach(e=>e.toggleAttribute("disabled",!0)),Promise.all([a,u(()=>{})]).then(()=>n.querySelectorAll("input").forEach(e=>e.toggleAttribute("disabled",!1)))});r("form",n=>{let i=document.querySelector("#rightcolumn>.row");i.parentElement.insertBefore(n,i),i.remove(),n.classList.add("doc_military"),n.append(r("label",e=>{e.classList.add("spacer-row"),e.append("Spies Enlisted: ",o(),r("span",t=>{t.append("?"),a.then(s=>t.textContent=s.spies.toString())}))}),r("label",e=>{e.classList.add("spacer-row"),e.append("Spies Enlisted Today: ",o(),r("span",t=>{t.append("?"),a.then(s=>t.textContent=s.spies_today.toString())}))}),r("label",e=>{e.classList.add("spacer-row"),e.append("Enlist/Discharge: ",o(),r("input",t=>{t.setAttribute("type","number"),t.setAttribute("name","spies"),t.setAttribute("value","0"),a.then(s=>t.value=Math.min((s.central_intelligence_agency?3:2)+(s.spy_satellite?1:0)-s.spies_today,(s.central_intelligence_agency?60:50)-s.spies).toString())}))}),r("input",e=>{e.setAttribute("type","submit"),e.setAttribute("name","train_spies"),e.setAttribute("value","Enlist/Discharge Spies")}),r("a",e=>{e.setAttribute("href","https://politicsandwar.com/nation/military/spies/"),e.textContent="Go to Page"})),n.addEventListener("submit",p,{passive:!1}),n.querySelectorAll("input").forEach(e=>e.toggleAttribute("disabled",!0)),Promise.all([a,u(()=>{})]).then(()=>n.querySelectorAll("input").forEach(e=>e.toggleAttribute("disabled",!1)))});r("form",n=>{let i=document.querySelector("#rightcolumn>.row");i.parentElement.insertBefore(n,i),i.remove(),n.classList.add("doc_military"),n.append(r("label",e=>{e.classList.add("spacer-row"),e.append("Missiles Stockpiled: ",o(),r("span",t=>{t.append("?"),a.then(s=>t.textContent=s.missiles.toString())}))}),r("label",e=>{e.classList.add("spacer-row"),e.append("Missiles Manufactured Today: ",o(),r("span",t=>{t.append("?"),a.then(s=>t.textContent=s.missiles_today.toString())}))}),r("label",e=>{e.classList.add("spacer-row"),e.append("Manufacture/Decommission: ",o(),r("input",t=>{t.setAttribute("type","number"),t.setAttribute("name","missile_purchase_input_amount"),t.setAttribute("value","0"),a.then(s=>t.value=((s.space_program?3:2)-s.missiles_today).toString())}))}),r("input",e=>{e.setAttribute("type","submit"),e.setAttribute("name","missile_purchase_form_submit"),e.setAttribute("value","Manufacture/Decommission Missiles")}),r("a",e=>{e.setAttribute("href","https://politicsandwar.com/nation/military/missiles/"),e.textContent="Go to Page"})),n.addEventListener("submit",p,{passive:!1}),n.querySelectorAll("input").forEach(e=>e.toggleAttribute("disabled",!0)),a.then(async e=>{e.missile_launch_pad&&(await u(()=>{}),n.querySelectorAll("input").forEach(t=>t.toggleAttribute("disabled",!1)))})});r("form",n=>{let i=document.querySelector("#rightcolumn>.row");i.parentElement.insertBefore(n,i),i.remove(),n.classList.add("doc_military"),n.append(r("label",e=>{e.classList.add("spacer-row"),e.append("Nuclear Weapons Possessed: ",o(),r("span",t=>{t.append("?"),a.then(s=>t.textContent=s.nukes.toString())}))}),r("label",e=>{e.classList.add("spacer-row"),e.append("Nuclear Weapons Manufactured Today: ",o(),r("span",t=>{t.append("?"),a.then(s=>t.textContent=s.nukes_today.toString())}))}),r("label",e=>{e.classList.add("spacer-row"),e.append("Manufacture/Decommission: ",o(),r("input",t=>{t.setAttribute("type","number"),t.setAttribute("name","ships"),t.setAttribute("value","0"),a.then(s=>t.value=(1-s.nukes_today).toString())}))}),r("input",e=>{e.setAttribute("type","submit"),e.setAttribute("name","buyships"),e.setAttribute("value","Manufacture/Decommission Nuclear Weapons")}),r("a",e=>{e.setAttribute("href","https://politicsandwar.com/nation/military/nukes/"),e.textContent="Go to Page"})),n.addEventListener("submit",p,{passive:!1}),n.querySelectorAll("input").forEach(e=>e.toggleAttribute("disabled",!0)),a.then(async e=>{e.nuclear_research_facility&&(await u(()=>{}),n.querySelectorAll("input").forEach(t=>t.toggleAttribute("disabled",!1)))})});async function p(n){n.preventDefault(),this.querySelectorAll("input").forEach(i=>i.toggleAttribute("disabled",!0)),await u(async i=>new DOMParser().parseFromString(await(await fetch(this.querySelector("a").href,{method:"POST",body:[...this.querySelectorAll("input[name][value]"),{name:"token",value:i}].reduce((e,t)=>(e.append(t.name,t.value),e),new FormData)})).text(),"text/html").querySelector('input[name="token"]')?.value??null)}
