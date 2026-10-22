(function(){
var $=function(s){return document.querySelector(s)};
function h(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function load(f){return fetch("data/"+f+".json?v="+Date.now()).then(function(r){return r.json()}).catch(function(){return[]})}
var m=$(".menu"),nl=$("#nl");
if(m&&nl){m.onclick=function(){var o=nl.classList.toggle("open");m.setAttribute("aria-expanded",o)};nl.onclick=function(){nl.classList.remove("open");m.setAttribute("aria-expanded","false")}}
document.querySelectorAll("[data-type]").forEach(function(a){a.addEventListener("click",function(){var t=$("#ctype");if(t)t.value=a.dataset.type})});

/* Properties (data/properties.json, edited from /admin) */
var pl=$("#plist"),fb=$("#filters"),F=["All Properties","For Sale","For Rent","For Lease","Residential","Commercial","Land & Plots"],cur=F[0],P=[];
function ok(p){return cur==F[0]||(cur=="For Sale"&&p.mode=="Sale")||(cur=="For Rent"&&p.mode=="Rent")||(cur=="For Lease"&&p.mode=="Lease")||cur==p.kind}
/* Photo carousel: p.images (array) with p.image as fallback for older listings */
function slider(pic,p){
 var im=(Array.isArray(p.images)&&p.images.length?p.images:(p.image?[p.image]:[])).filter(Boolean);
 if(!im.length)return;
 var tr=h("div","track"),i=0,n=im.length;
 im.forEach(function(src,k){var g=h("img");g.src=encodeURI(src);g.alt=(p.title||"Property")+" photo "+(k+1)+" of "+n;g.loading=k?"lazy":"eager";g.draggable=false;tr.appendChild(g)});
 pic.appendChild(tr);
 if(n<2)return;
 var ct=h("span","count","1 / "+n),dots=h("div","dots"),ds=[];
 function go(k){i=(k+n)%n;tr.style.transform="translateX(-"+i*100+"%)";ct.textContent=(i+1)+" / "+n;ds.forEach(function(d,j){d.classList.toggle("on",j==i)})}
 function arrow(c,lbl,ch,d){var b=h("button","arr "+c,ch);b.type="button";b.setAttribute("aria-label",lbl);b.onclick=function(e){e.preventDefault();e.stopPropagation();go(i+d)};return b}
 for(var k=0;k<n;k++)(function(k){var d=h("button","dot");d.type="button";d.setAttribute("aria-label","Show photo "+(k+1));d.onclick=function(){go(k)};ds.push(d);dots.appendChild(d)})(k);
 pic.appendChild(arrow("prev","Previous photo","\u2039",-1));pic.appendChild(arrow("next","Next photo","\u203A",1));
 pic.appendChild(ct);pic.appendChild(dots);go(0);
 var x0=null;
 pic.addEventListener("touchstart",function(e){x0=e.touches[0].clientX},{passive:true});
 pic.addEventListener("touchend",function(e){if(x0==null)return;var dx=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(dx)>40)go(i+(dx<0?1:-1))},{passive:true});
 pic.tabIndex=0;pic.addEventListener("keydown",function(e){if(e.key=="ArrowLeft")go(i-1);else if(e.key=="ArrowRight")go(i+1)});
}
function draw(){
 fb.textContent="";F.forEach(function(f){var b=h("button","chip",f);b.setAttribute("aria-pressed",f==cur);b.onclick=function(){cur=f;draw()};fb.appendChild(b)});
 pl.textContent="";var l=P.filter(ok);
 if(!l.length){pl.appendChild(h("p","","No listings match this filter yet."));return}
 l.forEach(function(p){
  var a=h("article","card prop"),pic=h("div","pic");pic.setAttribute("role","group");pic.setAttribute("aria-roledescription","carousel");pic.setAttribute("aria-label",p.title||"Property");
  slider(pic,p);
  pic.appendChild(h("span","tag",p.tag||"Available"));
  var b=h("div","pb");b.appendChild(h("span","price",p.price||""));b.appendChild(h("span","meta",(p.kind||"")+" · For "+(p.mode||"")));
  var t=h("h3","",p.title);t.style.margin="8px 0 4px";b.appendChild(t);
  var lc=h("p","meta",p.location||"");lc.style.marginBottom="14px";b.appendChild(lc);
  var e=h("a","gold","Enquire about this property");e.href="#contact";e.style.cssText="font-weight:600;text-decoration:none";b.appendChild(e);
  a.appendChild(pic);a.appendChild(b);pl.appendChild(a)})}
if(pl&&fb)load("properties").then(function(d){P=d;draw()});

/* Careers (data/careers.json, edited from /admin) */
var jb=$("#jobs");
if(jb)load("careers").then(function(d){
 var o=d.filter(function(j){return j.status!="Closed"}),sel=$("#role");jb.textContent="";
 if(!o.length)jb.appendChild(h("p","","No openings right now. Send your profile with the form below and we will keep it on file."));
 o.forEach(function(j){
  var c=h("article","card job");c.appendChild(h("h3","",j.title));
  var mt=h("p","meta",[j.department,j.location,j.type,j.experience].filter(Boolean).join(" · "));mt.style.textAlign="left";c.appendChild(mt);
  var ds=h("p","",j.description||"");ds.style.margin="10px 0 18px";c.appendChild(ds);
  var a=h("a","btn sec","Apply for this role");a.href="#apply";a.onclick=function(){sel.value=j.title};c.appendChild(a);jb.appendChild(c);
  var op=h("option","",j.title);op.value=j.title;sel.appendChild(op)});
 var g=h("option","","General application");g.value="General application";sel.appendChild(g)});

/* Forms -> send-enquiry.php (mails hello@igreyholdings.com and auto-replies to the sender) */
function wire(form,msg){
 if(!form)return;
 form.onsubmit=function(e){
  e.preventDefault();var b=form.querySelector("button[type=submit]"),old=b.textContent;b.disabled=true;b.textContent="Sending…";
  fetch("send-enquiry.php",{method:"POST",body:new FormData(form)}).then(function(r){return r.json().catch(function(){console.error("send-enquiry.php returned HTTP "+r.status+" and no JSON. PHP may not be running on this host.");return{ok:false}})}).then(function(j){
   if(!j.ok)throw new Error(j.error||"");msg.textContent="Thank you. We have received your message and sent a confirmation to your email.";form.reset()
  }).catch(function(e){msg.textContent=(e&&e.message)?e.message:"Sorry, we could not send your message. Please email hello@igreyholdings.com or call +91 8147172449."
  }).then(function(){msg.style.display="block";b.disabled=false;b.textContent=old})}}

})();
