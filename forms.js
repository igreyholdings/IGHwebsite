/* Sends the website forms without leaving the page. Tries /api/enquiry first (emails hello@ + auto-reply), then FormSubmit as a backup. */
(function(){
var FS="https://formsubmit.co/ajax/hello@igreyholdings.com",MAXFILE=3*1024*1024;
var LABEL={name:"Name",phone:"Phone",email:"Email",type:"I am a",loc:"Preferred location",svc:"Service required",role:"Role",msg:"Message",message:"Message",attachment:"Resume"};
function h(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
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
 return fetch(FS,{method:"POST",headers:hd,body:body}).then(function(r){return r.json()}).then(function(j){if(!(j.success===true||j.success==="true"))throw new Error("send failed")})}

window.IGH_WIRE=function(form){
 if(!form||form._wired)return;form._wired=true;
 form.addEventListener("submit",function(e){
  e.preventDefault();
  var fd=new FormData(form),btn=form.querySelector("button[type=submit]"),old=btn.textContent,fields={},file=null;
  if(fd.get("_honey")){note(form,true,"Thank you!");return}
  fd.forEach(function(v,k){
   if(k.charAt(0)=="_"||k=="website")return;
   if(v instanceof File){if(v.size)file=v;return}
   v=String(v).trim();if(v)fields[LABEL[k]||k]=v});
  if(file&&file.size>MAXFILE){note(form,false,"Please attach a file under 3 MB.");return}
  var p={kind:form.dataset.kind||"Website enquiry",subject:form.dataset.subject||"New website enquiry - iGREY Holdings",fields:fields};
  btn.disabled=true;btn.textContent="Sending\u2026";note(form,true,"");
  (file?b64(file).then(function(d){p.resume={name:file.name,data:d}}):Promise.resolve()).then(function(){return viaServer(p)}).then(function(r){
   if(r=="ok")return"Thank you! We have received your message and emailed you a confirmation. Our team will get back to you within one business day.";
   return viaFormSubmit(p,file).then(function(){return"Thank you! We have received your message. Our team will get back to you within one business day."})
  }).then(function(msg){form.reset();note(form,true,msg)}).catch(function(err){
   note(form,false,(err&&err.user)?err.message:"Sorry, we could not send your message. Please email hello@igreyholdings.com or call +91 8147172449.")
  }).then(function(){btn.disabled=false;btn.textContent=old})})};
document.querySelectorAll("form[data-kind]").forEach(window.IGH_WIRE);
})();
