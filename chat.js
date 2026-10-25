/* Kitty - iGREY Holdings' AI chat assistant. Talks to /api/chat (Vercel function, free AI APIs). */
(function(){
var KEY="igh_kitty",INTRO="Hi, I'm Kitty, the iGREY Holdings AI assistant. I can help with buying, selling, renting, leasing, property management, investment and careers. What are you looking for?",
CHIPS=["Properties for rent","Properties for sale","Property management","List my property","Careers"];
var SEND=window.IGH_CHAT_SEND||function(msgs){
 return fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:msgs})})
  .then(function(r){return r.json().catch(function(){return{}}).then(function(j){if(!r.ok||!j.reply)throw new Error(j.error||"unavailable");return j.reply})})};
function h(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
var msgs=[];try{msgs=JSON.parse(sessionStorage.getItem(KEY)||"[]")}catch(e){}
function save(){try{sessionStorage.setItem(KEY,JSON.stringify(msgs.slice(-20)))}catch(e){}}

var fab=h("button","chat-fab");fab.type="button";fab.setAttribute("aria-label","Chat with Kitty, our AI assistant");fab.title="Chat with Kitty";fab.setAttribute("aria-expanded","false");
fab.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7V4.2"/><circle class="eye" cx="12" cy="3.2" r="1.15"/><rect x="4" y="7" width="16" height="12.5" rx="4"/><path d="M2 12.2v3.1M22 12.2v3.1"/><circle class="eye" cx="9" cy="12.6" r="1.3"/><circle class="eye" cx="15" cy="12.6" r="1.3"/><path d="M9.3 16.1q2.7 1.7 5.4 0"/></svg>';
var box=h("div","chat");box.hidden=true;box.setAttribute("role","dialog");box.setAttribute("aria-label","Chat with Kitty");
var head=h("div","chat-head"),tt=h("div");tt.appendChild(h("b","","Kitty"));tt.appendChild(h("span","","iGREY's AI assistant · replies instantly"));
var x=h("button","chat-x","×");x.type="button";x.setAttribute("aria-label","Close chat");
var av=h("div","chat-av");av.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7V4.2"/><circle class="eye" cx="12" cy="3.2" r="1.15"/><rect x="4" y="7" width="16" height="12.5" rx="4"/><path d="M2 12.2v3.1M22 12.2v3.1"/><circle class="eye" cx="9" cy="12.6" r="1.3"/><circle class="eye" cx="15" cy="12.6" r="1.3"/><path d="M9.3 16.1q2.7 1.7 5.4 0"/></svg>';head.appendChild(av);head.appendChild(tt);head.appendChild(x);
var log=h("div","chat-log");log.setAttribute("aria-live","polite");
var chips=h("div","chat-chips");
var form=h("form","chat-form"),inp=h("input");inp.type="text";inp.maxLength=500;inp.placeholder="Type your question…";inp.setAttribute("aria-label","Your message");inp.autocomplete="off";
var go=h("button","","Send");go.type="submit";form.appendChild(inp);form.appendChild(go);
var note=h("p","chat-note","Kitty is an AI and can make mistakes. Please don't share sensitive personal details here. For confirmed information, email hello@igreyholdings.com or call +91 8147172449.");
[head,log,chips,form,note].forEach(function(e){box.appendChild(e)});
document.body.appendChild(box);document.body.appendChild(fab);

function bubble(cls,text){var b=h("div","cm "+cls,text);log.appendChild(b);log.scrollTop=log.scrollHeight;return b}
function render(){log.textContent="";bubble("b",INTRO);msgs.forEach(function(m){bubble(m.role=="user"?"u":"b",m.content)});
 chips.style.display=msgs.length?"none":"flex"}
CHIPS.forEach(function(c){var b=h("button","",c);b.type="button";b.onclick=function(){ask(c)};chips.appendChild(b)});

var busy=false;
function ask(text){
 text=(text||"").trim();if(!text||busy)return;
 busy=true;go.disabled=true;inp.value="";chips.style.display="none";
 msgs.push({role:"user",content:text});save();bubble("u",text);
 var t=h("div","cm b t");t.innerHTML="<i></i><i></i><i></i>";log.appendChild(t);log.scrollTop=log.scrollHeight;
 var hist=msgs.slice(-10);while(hist.length&&hist[0].role!="user")hist.shift();
 Promise.resolve().then(function(){return SEND(hist)}).then(function(r){
  t.remove();msgs.push({role:"assistant",content:r});save();bubble("b",r)
 }).catch(function(e){
  t.remove();msgs.pop();save();
  bubble("e",(e&&e.message&&e.message.indexOf("Too many")==0)?e.message:"Sorry, I can't answer right now. Please email hello@igreyholdings.com or call +91 8147172449.")
 }).then(function(){busy=false;go.disabled=false;inp.focus()})}
form.onsubmit=function(e){e.preventDefault();ask(inp.value)};

function open(o){box.hidden=!o;fab.setAttribute("aria-expanded",o);if(o){render();setTimeout(function(){inp.focus()},50)}}
fab.onclick=function(){open(box.hidden)};x.onclick=function(){open(false);fab.focus()};
document.addEventListener("keydown",function(e){if(e.key=="Escape"&&!box.hidden)open(false)});
})();
