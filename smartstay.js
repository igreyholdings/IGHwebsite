/* SMART STAY page: the "Interested" buttons open a contact form pop-up. The form is sent by forms.js (to hello@igreyholdings.com) and shows the success pop-up. */
(function(){
function h(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function hid(f,n,v){var i=h("input");i.type="hidden";i.name=n;i.value=v;f.appendChild(i)}
function field(label,el){var l=h("label","",label);l.appendChild(el);return l}
var ov,last;
function close(){if(ov){ov.remove();ov=null;document.body.style.overflow="";document.removeEventListener("keydown",key);if(last&&last.focus)last.focus()}}
function key(e){
 if(!ov)return;
 if(e.key=="Escape"){close();return}
 if(e.key!="Tab")return;
 var f=[].slice.call(ov.querySelectorAll("button,input:not([type=hidden]):not([name=_honey]),textarea,a[href]")).filter(function(x){return !x.disabled&&x.offsetParent!==null});
 if(!f.length)return;
 var a=f[0],z=f[f.length-1];
 if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}
 else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}
function open(){
 close();last=document.activeElement;
 ov=h("div","enq-ov");var d=h("div","enq-box");d.setAttribute("role","dialog");d.setAttribute("aria-modal","true");d.setAttribute("aria-label","Interested in SMART STAY by IGH");
 var x=h("button","enq-x","\u00D7");x.type="button";x.setAttribute("aria-label","Close");x.onclick=close;
 d.appendChild(x);d.appendChild(h("h3","","I\u2019m interested in SMART STAY by IGH"));
 var intro=h("p","","Share your details and our team will contact you within one business day to explain the programme and next steps.");intro.style.cssText="margin:0 0 16px;font-size:.92rem";d.appendChild(intro);
 var f=h("form");f.dataset.kind="SMART STAY enquiry";f.dataset.subject="SMART STAY by IGH - new interest";
 hid(f,"Programme","SMART STAY by IGH");
 var hp=h("input");hp.type="text";hp.name="_honey";hp.tabIndex=-1;hp.autocomplete="off";hp.style.display="none";f.appendChild(hp);
 var n=h("input");n.name="name";n.required=true;n.autocomplete="name";
 var ph=h("input");ph.name="phone";ph.type="tel";ph.required=true;ph.autocomplete="tel";
 var em=h("input");em.name="email";em.type="email";em.required=true;em.autocomplete="email";
 var lc=h("input");lc.name="loc";lc.autocomplete="address-level2";
 var m=h("textarea");m.name="msg";m.placeholder="Anything you would like us to know (optional)";
 var r=h("div","enq-row");r.appendChild(field("Name",n));r.appendChild(field("Phone",ph));
 f.appendChild(r);f.appendChild(field("Email",em));f.appendChild(field("Preferred location (optional)",lc));f.appendChild(field("Message",m));
 var c=h("label","enq-c");var cb=h("input");cb.type="checkbox";cb.required=true;c.appendChild(cb);c.appendChild(document.createTextNode("I consent to iGREY Holdings contacting me about SMART STAY by IGH."));f.appendChild(c);
 var b=h("button","btn pri","Send my details");b.type="submit";f.appendChild(b);d.appendChild(f);ov.appendChild(d);
 if(window.IGH_WIRE)window.IGH_WIRE(f);
 f.addEventListener("igh:sent",close);
 ov.addEventListener("mousedown",function(e){if(e.target===ov)close()});
 document.addEventListener("keydown",key);document.body.appendChild(ov);document.body.style.overflow="hidden";n.focus()}
document.querySelectorAll("[data-interested]").forEach(function(b){b.addEventListener("click",open)});
})();

/* Phones: fit headings to at most two lines by scaling the text down to the screen width */
(function(){
var SEL=[["main h2",22,15],[".ss-opt h3,.ss-ben h3,#partner .card h3",19,13],[".ss-line strong",20,14]];
function fit(el,start,min){
 el.style.fontSize="";
 if(!window.matchMedia("(max-width:700px)").matches)return;
 var px=start;el.style.fontSize=px+"px";
 var lh=parseFloat(getComputedStyle(el).lineHeight)/px||1.15;
 while(px>min&&(el.getBoundingClientRect().height>px*lh*2+2||el.scrollWidth>el.clientWidth+1)){px-=0.5;el.style.fontSize=px+"px"}}
/* Hero title: one line if it fits at a readable size, otherwise two lines */
function fitTitle(el){
 el.style.fontSize="";
 if(!window.matchMedia("(max-width:700px)").matches)return;
 function lines(px){el.style.fontSize=px+"px";var lh=parseFloat(getComputedStyle(el).lineHeight)/px||1.15;return el.getBoundingClientRect().height/(px*lh)}
 var px=26;
 while(px>17&&lines(px)>1.2)px-=0.5;
 if(lines(px)<=1.2)return;
 px=22;while(px>15&&lines(px)>2.2)px-=0.5}
function run(){document.querySelectorAll(".ss-hero h1").forEach(fitTitle);SEL.forEach(function(s){document.querySelectorAll(s[0]).forEach(function(el){fit(el,s[1],s[2])})})}
run();window.addEventListener("resize",run);window.addEventListener("load",run);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(run)})();
