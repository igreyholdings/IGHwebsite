/* "Enquire about this property" pop-up. Sends the enquiry (with the Property ID) to hello@igreyholdings.com via FormSubmit. */
(function(){
function h(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function hid(f,n,v){var i=h("input");i.type="hidden";i.name=n;i.value=v;f.appendChild(i)}
function field(label,el){var l=h("label","",label);l.appendChild(el);return l}
var ov,last;
function close(){if(ov){ov.remove();ov=null;document.body.style.overflow="";if(last&&last.focus)last.focus()}}
window.IGH_ENQUIRE=function(p){
 close();last=document.activeElement;
 var pid=window.IGH_PID(p),link=location.origin+"/property.html?id="+encodeURIComponent(p.id);
 ov=h("div","enq-ov");var d=h("div","enq-box");d.setAttribute("role","dialog");d.setAttribute("aria-modal","true");d.setAttribute("aria-label","Enquire about "+p.title);
 var x=h("button","enq-x","\u00D7");x.type="button";x.setAttribute("aria-label","Close");x.onclick=close;
 d.appendChild(x);d.appendChild(h("h3","","Enquire about this property"));
 var s=h("div","enq-sum");s.appendChild(h("b","",p.title||"Property"));
 s.appendChild(h("span","",[pid,p.price,p.location].filter(Boolean).join(" \u00B7 ")));d.appendChild(s);
 var f=h("form");f.action="https://formsubmit.co/hello@igreyholdings.com";f.method="POST";
 hid(f,"_subject","Property enquiry "+pid+" - "+(p.title||""));hid(f,"_template","table");hid(f,"_next",location.origin+"/thanks.html");
 hid(f,"_autoresponse","Hello, thank you for your interest in "+(p.title||"our property")+" ("+pid+"). We have received your enquiry and our team will get back to you within one business day. If it is urgent, please call +91 8147172449. Regards, iGREY Holdings, hello@igreyholdings.com");
 hid(f,"Property ID",pid);hid(f,"Property",p.title||"");hid(f,"Price",p.price||"");hid(f,"Location",p.location||"");hid(f,"Property link",link);
 var hp=h("input");hp.type="text";hp.name="_honey";hp.tabIndex=-1;hp.autocomplete="off";hp.style.display="none";f.appendChild(hp);
 var n=h("input");n.name="name";n.required=true;n.autocomplete="name";
 var ph=h("input");ph.name="phone";ph.type="tel";ph.required=true;ph.autocomplete="tel";
 var em=h("input");em.name="email";em.type="email";em.required=true;em.autocomplete="email";
 var m=h("textarea");m.name="message";m.value="I am interested in "+(p.title||"this property")+" ("+pid+"). Please share more details.";
 var r=h("div","enq-row");r.appendChild(field("Name",n));r.appendChild(field("Phone",ph));
 f.appendChild(r);f.appendChild(field("Email",em));f.appendChild(field("Message",m));
 var c=h("label","enq-c");var cb=h("input");cb.type="checkbox";cb.required=true;c.appendChild(cb);c.appendChild(document.createTextNode("I consent to iGREY Holdings contacting me about this enquiry."));f.appendChild(c);
 var b=h("button","btn pri","Send enquiry");b.type="submit";f.appendChild(b);d.appendChild(f);ov.appendChild(d);
 ov.addEventListener("mousedown",function(e){if(e.target===ov)close()});
 document.addEventListener("keydown",esc);document.body.appendChild(ov);document.body.style.overflow="hidden";n.focus()};
function esc(e){if(e.key=="Escape"&&ov)close()}
})();
