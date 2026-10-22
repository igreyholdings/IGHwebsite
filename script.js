var P=[
{t:"Executive 3 BHK Residence",loc:"Gated society, Bangalore",price:"₹85 L",mode:"Sale",kind:"Residential",tag:"Upcoming",img:"--i2"},
{t:"Skyline Apartment Residences",loc:"Gated society, Bangalore",price:"₹1.2 Cr",mode:"Sale",kind:"Residential",tag:"Available",img:"--i1"},
{t:"Garden View 3 BHK Home",loc:"Gated society, Mysuru",price:"₹95 L",mode:"Sale",kind:"Residential",tag:"Limited offer",img:"--i4"},
{t:"Family 2 BHK Apartment",loc:"Bilekahalli, Bangalore",price:"₹32,000 / month",mode:"Rent",kind:"Residential",tag:"Available",img:"--i5"},
{t:"Rooftop Pool Terrace Lounge",loc:"Bannerghatta Road, Bangalore",price:"₹1.1 L / month",mode:"Lease",kind:"Commercial",tag:"Available",img:"--i6"},
{t:"Premium 4 BHK Dining Residence",loc:"Gated society, Bangalore",price:"₹1.5 Cr",mode:"Sale",kind:"Residential",tag:"Available",img:"--i3"}];
var F=["All Properties","For Sale","For Rent","For Lease","Residential","Commercial","Land & Plots"];
var cur="All Properties",fb=document.getElementById("filters"),pl=document.getElementById("plist");
function ok(p){return cur=="All Properties"||(cur=="For Sale"&&p.mode=="Sale")||(cur=="For Rent"&&p.mode=="Rent")||(cur=="For Lease"&&p.mode=="Lease")||cur==p.kind}
function draw(){
 fb.innerHTML="";F.forEach(function(f){var b=document.createElement("button");b.className="chip";b.textContent=f;b.setAttribute("aria-pressed",f==cur);b.onclick=function(){cur=f;draw()};fb.appendChild(b)});
 var l=P.filter(ok);
 pl.innerHTML=l.length?l.map(function(p){return '<article class="card prop"><div class="pic" role="img" aria-label="'+p.t+'" style="background-image:var('+p.img+')"><span class="tag">'+p.tag+'</span></div><div class="pb"><span class="price">'+p.price+'</span><span class="meta">'+p.kind+' · For '+p.mode+'</span><h3 style="margin:8px 0 4px">'+p.t+'</h3><p class="meta" style="margin-bottom:14px">'+p.loc+'</p><a href="#contact" class="gold" style="font-weight:600;text-decoration:none">Enquire about this property</a></div></article>'}).join(""):'<p>No listings match this filter yet.</p>';
}
draw();
var m=document.querySelector(".menu"),nl=document.getElementById("nl");
m.onclick=function(){var o=nl.classList.toggle("open");m.setAttribute("aria-expanded",o)};
nl.onclick=function(){nl.classList.remove("open");m.setAttribute("aria-expanded","false")};
document.querySelectorAll("[data-type]").forEach(function(a){a.addEventListener("click",function(){document.getElementById("ctype").value=a.dataset.type})});
document.getElementById("cf").onsubmit=function(e){e.preventDefault();document.getElementById("ok").style.display="block";this.reset()};
