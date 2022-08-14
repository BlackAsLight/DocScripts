// ==UserScript==
// @name         Doc: Create Trade
// @namespace    https://politicsandwar.com/nation/id=19818
// @version      2.4
// @description  Makes script, View Trades, Outbid and Match buttons work.
// @author       BlackAsLight
// @match        https://politicsandwar.com/nation/trade/create/*
// @match        https://politicsandwar.com/index.php?id=27*
// @icon         https://avatars.githubusercontent.com/u/44320105
// @grant        none
// ==/UserScript==
'use strict';
(()=>{function d(e,t,...r){if(typeof e!="string")return e(t,...r);let o=document.createElement(e);return t&&Object.entries(t).forEach(([a,i])=>o.setAttribute(a,i)),r.flat().forEach(async a=>{if(a.toString()!=="[object Promise]")return o.append(a);let i=d("div",null);o.append(i),a=await a,i.parentElement&&(i.parentElement.insertBefore(a,i),i.remove())}),o}if(document.querySelector("#Doc_CreateTrade"))throw Error("This script was already injected...");document.body.append(d("div",{id:"Doc_CreateTrade",style:"display: none;"}));var u="Doc_CT1",s="Doc_CT2",m="Doc_CT3",{p:l,q:n,t:c}=Object.fromEntries(location.search.slice(1).split("&").map(e=>e.split("=")).map(([e,t])=>[e,`${parseFloat(t)}`=="NaN"?t:parseFloat(t)]));if(document.querySelector(".alert-success"))if(n&&n>1e6&&!localStorage.getItem(s)){let e=location.search.slice(1).split("&"),t=e.findIndex(r=>r.startsWith("q="));e[t]=`q=${n-1e6}`,location.href=location.origin+location.pathname+"?"+e.join("&")}else{localStorage.removeItem(s);let e=document.querySelector("a i.fa-backward").parentElement.href.split("?"),t=e[1].split("&"),r=t.findIndex(o=>o.startsWith("minimum="));r<0?location.href=e.join("?"):(t[r]="minimum=0",location.href=e[0]+"?"+t.join("&"))}else{if(localStorage.removeItem(s),document.querySelector("#createTrade")?.scrollIntoView({behavior:"smooth",block:"center"}),l){let e=document.querySelector("#priceper");e.setAttribute("value",l),e.addEventListener("change",()=>{let t=e.value;parseInt(t)===l?localStorage.removeItem(m):localStorage.setItem(m,t)})}if(n&&document.querySelector("#amount").setAttribute("value",Math.min(n,1e6).toString()),c){let e=(()=>{let r=document.querySelector("button i.fa-hands-usd").parentElement,o=r.nextElementSibling;return(c==="s"?o:r).remove(),c==="s"?r:o})();e.style.setProperty("border-radius","6px"),e.setAttribute("type","submit"),e.setAttribute("name","submit"),e.setAttribute("value",c==="s"?"Sell":"Buy"),e.removeAttribute("data-target");let t=parseInt(localStorage.getItem(u)??"");if(t){let r=5e3+t-new Date().getTime();r>0&&(f(r).then(()=>e.toggleAttribute("disabled",!1)),e.toggleAttribute("disabled",!0)),localStorage.removeItem(u)}n&&n>=1e6&&e.addEventListener("click",()=>{Math.min(n,1e6)!==parseInt(document.querySelector("#amount").getAttribute("value")??"")&&localStorage.setItem(s,"0")})}}function f(e){return new Promise(t=>setTimeout(()=>t(!0),e))}})();
