/* SERVICE WORKER */

if ("serviceWorker" in navigator) {

navigator.serviceWorker.register("/sw.js")

.then(() => console.log("Service Worker Registered"))

.catch(err => console.log(err));

}


/* CLIENT DATABASE */

let clients = [];

fetch("./data/clients.json")
.then(res=>res.json())
.then(data=>{

clients=data;

showAllClients();

if(clients.length>0){
setTimeout(()=>{
loadClient(clients[0].id);
},200);
}

/* LOAD CLIENTS */

function initClients(){

const select=document.getElementById("clientSelect")

clients.forEach(c=>{

let option=document.createElement("option")

option.value=c.id
option.textContent=c.name

select.appendChild(option)

})

}


/* SHOW CLIENT */

function loadClient(){

const id=document.getElementById("clientSelect").value

const client=clients.find(c=>c.id===id)

if(!client)return


document.getElementById("clientInfo").innerHTML=`

<p><b>GST:</b> ${client.gst}</p>
<p><b>PAN:</b> ${client.pan}</p>
<p><b>Mobile:</b> ${client.mobile}</p>
<p><b>Email:</b> ${client.email}</p>

`


let complianceHTML="<h3 class='font-semibold mb-2'>Compliance</h3>"

client.compliance.forEach(c=>{

let color=c.status==="Pending"?"text-red-400":"text-green-400"

complianceHTML+=`

<p>

${c.type} (${c.period})  
Due: ${c.due_date}  
<span class="${color}">${c.status}</span>

</p>

`

})

document.getElementById("complianceList").innerHTML=complianceHTML


document.getElementById("credentialsBox").innerHTML=`

<h3 class="font-semibold mb-2">Credentials</h3>

<p>GST Portal: ${client.credentials.gst_portal_user || "-"}</p>

<p>Income Tax: ${client.credentials.income_tax_user || "-"}</p>

<p>MCA: ${client.credentials.mca_user || "-"}</p>

`

}

let clients=[]

fetch("data/clients.json")
.then(res=>res.json())
.then(data=>{

clients=data

showAllClients()

})


function showAllClients(){

const container=document.getElementById("clientResults")

container.innerHTML=""

clients.forEach(c=>{

let div=document.createElement("div")

div.className="p-4 border-b border-gray-700 cursor-pointer hover:bg-[#334155]"
  
div.innerText=c.name

div.onclick=()=>loadClient(c.id)

container.appendChild(div)

})

}


function searchClient(){

const keyword=document
.getElementById("clientSearch")
.value
.toLowerCase()

const container=document.getElementById("clientResults")

container.innerHTML=""

clients
.filter(c=>c.name.toLowerCase().includes(keyword))
.forEach(c=>{

let div=document.createElement("div")

div.className="p-4 border-b border-gray-700 cursor-pointer hover:bg-[#334155]"

div.innerText=c.name

div.onclick=()=>loadClient(c.id)

container.appendChild(div)

})

}


function loadClient(id){

const client=clients.find(c=>c.id===id)

if(!client)return


document.getElementById("clientInfo").innerHTML=`

<p><b>GST:</b> ${client.gst}</p>
<p><b>PAN:</b> ${client.pan}</p>
<p><b>Mobile:</b> ${client.mobile}</p>
<p><b>Email:</b> ${client.email}</p>

`


let complianceHTML="<h3 class='font-semibold mb-2'>Compliance</h3>"

client.compliance.forEach(c=>{

let color=c.status==="Pending"
?"text-red-400"
:"text-green-400"

complianceHTML+=`

<p>
${c.type} (${c.period})  
Due: ${c.due_date}  
<span class="${color}">${c.status}</span>
</p>

`

})

document.getElementById("complianceList").innerHTML=complianceHTML


document.getElementById("credentialsBox").innerHTML=`

<h3 class="font-semibold mb-2">Credentials</h3>

<p>GST Portal: ${client.credentials.gst_portal_user || "-"}</p>
<p>Income Tax: ${client.credentials.income_tax_user || "-"}</p>
<p>MCA: ${client.credentials.mca_user || "-"}</p>

`

}
