/* SERVICE WORKER */

if ("serviceWorker" in navigator) {
navigator.serviceWorker.register("/sw.js")
.then(()=>console.log("Service Worker Registered"))
.catch(err=>console.log(err));
}


/* CLIENT DATABASE */

let clients = [];


/* LOAD JSON */

fetch("./data/clients.json?v=" + Date.now())
.then(res => res.json())
.then(data => {

clients = data;

showAllClients();

if (clients.length > 0) {
loadClient(clients[0].id);
}

})
.catch(err => console.log("JSON Error:", err));


/* SHOW ALL CLIENTS */

function showAllClients(){

const container = document.getElementById("clientResults")

container.innerHTML=""

clients.forEach(c=>{

let div=document.createElement("div")

div.className="p-4 border-b border-gray-700 cursor-pointer hover:bg-[#334155]"

div.innerText=c.name

div.onclick=()=>loadClient(c.id)

container.appendChild(div)

})

}


/* SEARCH CLIENT */

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


/* LOAD CLIENT DETAILS */

function loadClient(id){

const client=clients.find(c=>c.id===id)

if(!client)return


/* CLIENT INFO */

document.getElementById("clientInfo").innerHTML=`

<h3 class="text-[#D4AF37] font-semibold mb-3">
Client Info
</h3>

<p><span class="text-gray-400">GST</span><br>${client.gst}</p>
<p><span class="text-gray-400">PAN</span><br>${client.pan}</p>
<p><span class="text-gray-400">Mobile</span><br>${client.mobile}</p>
<p><span class="text-gray-400">Email</span><br>${client.email}</p>

`


/* COMPLIANCE */

let complianceHTML=`
<h3 class="text-[#D4AF37] font-semibold mb-3">
Compliance
</h3>
`

client.compliance.forEach(c=>{

let color=c.status==="Pending"
?"text-red-400"
:"text-green-400"

complianceHTML+=`

<p class="mb-3">
${c.type} (${c.period})<br>
Due: ${c.due_date}<br>
<span class="${color} font-semibold">${c.status}</span>
</p>

`

})

document.getElementById("complianceList").innerHTML=complianceHTML


/* CREDENTIALS */

document.getElementById("credentialsBox").innerHTML=`

<h3 class="text-[#D4AF37] font-semibold mb-3">
Credentials
</h3>

<p>GST Portal: ${client.credentials?.gst_portal_user || "-"}</p>
<p>Income Tax: ${client.credentials?.income_tax_user || "-"}</p>
<p>MCA: ${client.credentials?.mca_user || "-"}</p>

`

}
