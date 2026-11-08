/* Sends the website forms without leaving the page. Tries /api/enquiry first (emails hello@, or hr@ for career applications, + auto-reply), then FormSubmit as a backup.
   When a form is sent, a success pop-up is shown (IGH_POPUP). */
(function(){
var FS_ALL="https://formsubmit.co/ajax/hello@igreyholdings.com",FS_HR="https://formsubmit.co/ajax/hr@igreyholdings.com",MAXFILE=3*1024*1024;
var DONE={
 "Career application":["Application submitted","Thank you for applying to iGREY Holdings. We have received your application and resume. Our team will contact you if your profile matches an opening."],
 "Property enquiry":["Enquiry sent","Thank you. We have received your enquiry about this property. Our team will get back to you within one business day."],
 "SMART STAY enquiry":["Thank you for your interest","We have received your details for SMART STAY by IGH. Our team will contact you within one business day to explain the programme and next steps."],
 "Website enquiry":["Message sent","Thank you for contacting iGREY Holdings. We have received your message. Our team will get back to you within one business day."]};
var LABEL={name:"Name",phone:"Phone",email:"Email",type:"I am a",loc:"Preferred location",svc:"Service required",role:"Role",msg:"Message",message:"Message",attachment:"Resume"};
function h(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
/* Success pop-up shown after any form is sent */
var popOv=null,popLast=null;
function popClose(){if(!popOv)return;popOv.remove();popOv=null;document.removeEventListener("keydown",popKey);if(popLast&&popLast.focus&&document.contains(popLast))popLast.focus()}
function popKey(e){if(e.key=="Escape")popClose();else if(e.key=="Tab"&&popOv){e.preventDefault();var b=popOv.querySelector("button");if(b)b.focus()}}
window.IGH_POPUP=function(title,text){
 popClose();popLast=document.activeElement;
 var ov=h("div","igh-pop-ov"),d=h("div","igh-pop");
 d.setAttribute("role","alertdialog");d.setAttribute("aria-modal","true");d.setAttribute("aria-labelledby","igh-pop-t");d.setAttribute("aria-describedby","igh-pop-p");
 d.insertAdjacentHTML("afterbegin",'<svg class="igh-pop-ico" viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="23"/><path d="M15.5 27l7.5 7.5 14-15.5"/></svg>');
 var t1=h("h3","",title);t1.id="igh-pop-t";var p=h("p","",text);p.id="igh-pop-p";
 var b=h("button","btn pri","Done");b.type="button";b.onclick=popClose;
 d.appendChild(t1);d.appendChild(p);d.appendChild(b);ov.appendChild(d);
 ov.addEventListener("mousedown",function(e){if(e.target===ov)popClose()});
 document.addEventListener("keydown",popKey);document.body.appendChild(ov);popOv=ov;b.focus()};
function note(form,ok,text){var n=form.querySelector(".form-note");if(!n){n=h("p","form-note");n.setAttribute("role","status");form.appendChild(n)}n.className="form-note "+(ok?"ok":"err");n.textContent=text}
function b64(f){return new Promise(function(res,rej){var r=new FileReader();r.onload=function(){res(String(r.result).split(",")[1])};r.onerror=rej;r.readAsDataURL(f)})}
function viaServer(p){
 return fetch("/api/enquiry",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(p)}).then(function(r){
  return r.json().catch(function(){return{}}).then(function(j){
   if(r.ok&&j.ok)return"ok";
   if(r.status==400||r.status==429){var e=new Error(j.error||"Please check your details and try again.");e.user=1;throw e}
   return"fallback"})}).catch(function(e){if(e&&e.user)throw e;return"fallback"})}
function viaFormSubmit(p,file){
 var body,hd={Accept:"application/json"};
 if(file){body=new FormData();body.append("_subject",p.subject);body.append("_template","table");body.append("_captcha","false");
  Object.keys(p.fields).forEach(function(k){body.append(k,p.fields[k])});body.append("attachment",file,file.name)}
 else{hd["Content-Type"]="application/json";var o={_subject:p.subject,_template:"table",_captcha:"false"};Object.keys(p.fields).forEach(function(k){o[k]=p.fields[k]});
  if(p.fields.Email)o._replyto=p.fields.Email;body=JSON.stringify(o)}
 return fetch(p.kind=="Career application"?FS_HR:FS_ALL,{method:"POST",headers:hd,body:body}).then(function(r){return r.json()}).then(function(j){if(!(j.success===true||j.success==="true"))throw new Error("send failed")})}

window.IGH_WIRE=function(form){
 if(!form||form._wired)return;form._wired=true;
 form.addEventListener("submit",function(e){
  e.preventDefault();
  var fd=new FormData(form),btn=form.querySelector("button[type=submit]"),old=btn.textContent,fields={},file=null;
  if(fd.get("_honey")){var dd0=DONE[form.dataset.kind]||DONE["Website enquiry"];window.IGH_POPUP(dd0[0],dd0[1]);return}
  fd.forEach(function(v,k){
   if(k.charAt(0)=="_"||k=="website")return;
   if(v instanceof File){if(v.size)file=v;return}
   v=String(v).trim();if(v)fields[LABEL[k]||k]=v});
  if(file&&file.size>MAXFILE){note(form,false,"Please attach a file under 3 MB.");return}
  var p={kind:form.dataset.kind||"Website enquiry",subject:form.dataset.subject||"New website enquiry - iGREY Holdings",fields:fields};
  btn.disabled=true;btn.textContent="Sending\u2026";note(form,true,"");
  (file?b64(file).then(function(d){p.resume={name:file.name,data:d}}):Promise.resolve()).then(function(){return viaServer(p)}).then(function(r){
   if(r=="ok")return true;
   return viaFormSubmit(p,file).then(function(){return false})
  }).then(function(confirmed){
   var dn=DONE[p.kind]||DONE["Website enquiry"];
   form.reset();note(form,true,"");
   form.dispatchEvent(new CustomEvent("igh:sent",{bubbles:true}));
   window.IGH_POPUP(dn[0],dn[1]+(confirmed?" A confirmation has also been emailed to you.":""))}).catch(function(err){
   note(form,false,(err&&err.user)?err.message:"Sorry, we could not send your message. Please email hello@igreyholdings.com or call +91 8147172449.")
  }).then(function(){btn.disabled=false;btn.textContent=old})})};
document.querySelectorAll("form[data-kind]").forEach(window.IGH_WIRE);
})();
