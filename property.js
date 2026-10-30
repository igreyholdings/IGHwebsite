/* Property detail page: property.html?id=<id>  (reads data/properties.json, edited from /admin) */
(function(){
var $=function(s){return document.querySelector(s)};
function h(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
var box=$("#pd");if(!box)return;
var id=new URLSearchParams(location.search).get("id");

function none(msg){box.textContent="";var d=h("div","pd-none");d.appendChild(h("h1","",msg));
 var p=h("p","","The listing may have been removed or the link may be incorrect.");p.style.margin="12px 0 20px";d.appendChild(p);
 var a=h("a","btn pri","View all properties");a.href="index.html#properties";d.appendChild(a);box.appendChild(d)}

fetch("data/properties.json?v="+Date.now()).then(function(r){return r.json()}).catch(function(){return null}).then(function(list){
 if(!Array.isArray(list))return none("We couldn't load this property");
 var p=list.filter(function(x){return String(x.id)===String(id)})[0];
 if(!p)return none("Property not found");
 render(p)});

function render(p){
 document.title=(p.title||"Property")+" | iGREY Holdings";
 var im=(Array.isArray(p.images)&&p.images.length?p.images:(p.image?[p.image]:[])).filter(Boolean).map(encodeURI),n=im.length,i=0;
 var mode=p.mode?"For "+p.mode:"";
 box.textContent="";
 var grid=h("div","pd-grid"),gal=h("div","pd-gal"),stage=h("div","pd-stage"),img=h("img"),thumbs=h("div","pd-thumbs"),ct=h("span","pd-count"),tb=[];
 stage.setAttribute("role","group");stage.setAttribute("aria-roledescription","carousel");stage.setAttribute("aria-label",(p.title||"Property")+" photos");
 img.alt=p.title||"Property";img.draggable=false;stage.appendChild(img);
 stage.appendChild(h("span","tag",p.tag||"Available"));

 /* full-screen viewer */
 var lb=h("div","pd-lb"),lbi=h("img"),lbc=h("span","pd-count"),lbx=h("button","pd-x","\u00D7");
 lb.hidden=true;lb.setAttribute("role","dialog");lb.setAttribute("aria-modal","true");lb.setAttribute("aria-label","Photo viewer");
 lbx.type="button";lbx.setAttribute("aria-label","Close photo viewer");lbi.alt=p.title||"Property";
 function openLb(){if(!n)return;lb.hidden=false;document.body.style.overflow="hidden";lbx.focus()}
 function closeLb(){lb.hidden=true;document.body.style.overflow="";stage.focus()}

 function go(k){
  if(!n)return;i=(k+n)%n;img.src=im[i];lbi.src=im[i];
  var t=(i+1)+" / "+n;ct.textContent=t;lbc.textContent=t;
  tb.forEach(function(b,j){b.setAttribute("aria-current",j==i)});
  if(tb[i]){var b=tb[i];thumbs.scrollTo({left:b.offsetLeft-(thumbs.clientWidth-b.offsetWidth)/2,behavior:"smooth"})}
  var nx=new Image();nx.src=im[(i+1)%n]}
 function arrow(cls,lbl,ch,d){var b=h("button","pd-arr "+cls,ch);b.type="button";b.setAttribute("aria-label",lbl);b.onclick=function(e){e.stopPropagation();go(i+d)};return b}

 if(n){
  stage.tabIndex=0;stage.title="Click to enlarge";
  stage.addEventListener("click",function(e){if(!e.target.closest("button"))openLb()});
  if(n>1){
   stage.appendChild(arrow("pd-prev","Previous photo","\u2039",-1));stage.appendChild(arrow("pd-next","Next photo","\u203A",1));stage.appendChild(ct);
   im.forEach(function(src,k){var b=h("button");b.type="button";b.setAttribute("aria-label","Show photo "+(k+1));var t=h("img");t.src=src;t.alt="";t.loading="lazy";b.appendChild(t);b.onclick=function(){go(k)};tb.push(b);thumbs.appendChild(b)});
   lb.appendChild(arrow("pd-prev","Previous photo","\u2039",-1));lb.appendChild(arrow("pd-next","Next photo","\u203A",1));lb.appendChild(lbc)}
  lb.insertBefore(lbi,lb.firstChild);lb.appendChild(lbx);
  lbx.onclick=closeLb;lb.addEventListener("click",function(e){if(e.target===lb)closeLb()});
  document.addEventListener("keydown",function(e){
   if(!lb.hidden){if(e.key=="Escape")closeLb();else if(e.key=="ArrowLeft")go(i-1);else if(e.key=="ArrowRight")go(i+1);return}
   if(document.activeElement===stage&&n>1){if(e.key=="ArrowLeft")go(i-1);else if(e.key=="ArrowRight")go(i+1)}
   if(document.activeElement===stage&&(e.key=="Enter"||e.key==" ")){e.preventDefault();openLb()}});
  [stage,lb].forEach(function(el){var x0=null;
   el.addEventListener("touchstart",function(e){x0=e.touches[0].clientX},{passive:true});
   el.addEventListener("touchend",function(e){if(x0==null||n<2)return;var dx=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(dx)>40){el._sw=Date.now();go(i+(dx<0?1:-1))}},{passive:true});
   el.addEventListener("click",function(e){if(Date.now()-(el._sw||0)<400){e.stopImmediatePropagation();e.preventDefault()}},true)});
  go(0)}
 else{stage.style.cursor="default";var ph=h("div","","No photos available");ph.style.cssText="height:100%;display:grid;place-items:center;color:var(--mute)";stage.appendChild(ph)}
 gal.appendChild(stage);if(n>1)gal.appendChild(thumbs);

 /* details panel */
 var info=h("aside","pd-info card");
 info.appendChild(h("span","meta",[p.kind,mode].filter(Boolean).join(" \u00B7 ")));
 info.appendChild(h("h1","",p.title||"Property"));
 if(p.location)info.appendChild(h("p","pd-loc",p.location));
 if(p.price)info.appendChild(h("div","pd-price",p.price));
 var dl=h("dl","pd-facts");
 [["Property ID",window.IGH_PID(p)],["Status",p.tag||"Available"],["Listing type",mode],["Category",p.kind]].forEach(function(r){if(!r[1])return;dl.appendChild(h("dt","",r[0]));dl.appendChild(h("dd","",r[1]))});
 info.appendChild(dl);
 var cta=h("div","pd-cta"),e=h("button","btn pri","Enquire about this property");e.type="button";e.onclick=function(){window.IGH_ENQUIRE(p)};
 var c=h("a","btn sec","Call us");c.href="tel:+918147172449";cta.appendChild(e);cta.appendChild(c);info.appendChild(cta);

 var main=h("div","pd-main");main.appendChild(gal);
 var ms=h("div","pd-msum"),mr=h("div","pd-mrow");mr.appendChild(h("div","pd-mt",p.title||"Property"));if(p.price)mr.appendChild(h("div","pd-mprice",p.price));ms.appendChild(mr);
 if(p.location)ms.appendChild(h("p","pd-mloc",p.location));main.appendChild(ms);
 var area=p.area?window.IGH_AREA(p.area):"",furn=(p.furnishing&&p.furnishing!="Not applicable")?p.furnishing:"";
 var IC={Area:'<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10M10 20v-6h4v6"/>',"Property type":'<path d="M5 21V4h9v17M14 9h5v12M3 21h18M8 8h3M8 12h3M8 16h3"/>',Bedrooms:'<path d="M3 18V7M3 14h18v4M21 14v-3a3 3 0 0 0-3-3h-7v6"/><circle cx="7" cy="11" r="1.6"/>',Bathrooms:'<path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4zM6 12V6a2 2 0 0 1 4 0M7 19l-1 2M17 19l1 2"/>',Furnishing:'<path d="M5 11V8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3M3 13a2 2 0 0 1 4 0v2h10v-2a2 2 0 0 1 4 0v5H3zM5 18v2M19 18v2"/>'};
 function sec(t,cls){var s=h("div","pd-sec"+(cls?" "+cls:"")),hd=h("div","pd-sh");hd.appendChild(h("h3","",t));s.appendChild(hd);s._hd=hd;main.appendChild(s);return s}
 function link(s,txt,fn){var b=h("button","pd-link",txt);b.type="button";b.onclick=function(){fn(b)};s._hd.appendChild(b)}
 var ov=[["Area",area],["Property type",p.ptype],["Bedrooms",p.bedrooms],["Bathrooms",p.bathrooms],["Furnishing",furn]].filter(function(r){return r[1]});
 if(ov.length){var s1=sec("Overview","pdov"),tl=h("div","pd-tiles c"+(ov.length>4?3:4));ov.forEach(function(r){var t=h("div","pd-tile"),ic=h("span","ti");ic.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true">'+IC[r[0]]+'</svg>';t.appendChild(ic);t.appendChild(h("b","",r[1]));t.appendChild(h("span","",r[0]));tl.appendChild(t)});s1.appendChild(tl)}
 if(p.description){var s2=sec("About this property"),dc=h("div","pd-desc");String(p.description).split(/\n{2,}/).forEach(function(x){if(x.trim())dc.appendChild(h("p","",x.trim()))});s2.appendChild(dc);
  if(String(p.description).length>180){dc.classList.add("clamp");link(s2,"Read more \u25BE",function(b){var c=dc.classList.toggle("clamp");b.textContent=c?"Read more \u25BE":"Show less \u25B4"})}}
 var am=Array.isArray(p.amenities)?p.amenities.filter(Boolean):[];
 if(am.length){var s3=sec("Amenities"),ag=h("div","pd-amen");am.forEach(function(a){var d=h("div","pd-am"),ic=h("span","ico");ic.innerHTML=window.IGH_ICON?window.IGH_ICON(a):"";d.appendChild(ic);d.appendChild(h("span","",a));ag.appendChild(d)});s3.appendChild(ag);
  if(am.length>8)link(s3,"View all \u2192",function(b){var o=ag.classList.toggle("all");b.textContent=o?"Show less":"View all \u2192"})}
 /* contact block (phones/tablets) */
 var ct=h("div","pd-contact");ct.appendChild(h("h3","","Contact"));ct.appendChild(h("p","","Get in touch for more details or to schedule a visit."));
 var cr=h("div","pd-ctr"),ca=h("a","pd-call"),wa=h("a","pd-wa");
 ca.href="tel:+918147172449";ca.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg><span>Call Us</span>';
 wa.href="https://wa.me/918147172449?text="+encodeURIComponent("Hello iGREY Holdings, I am interested in "+(p.title||"this property")+" ("+window.IGH_PID(p)+").");wa.target="_blank";wa.rel="noopener noreferrer";
 wa.innerHTML='<svg class="fl" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg><span>WhatsApp</span>';
 cr.appendChild(ca);cr.appendChild(wa);ct.appendChild(cr);
 grid.appendChild(main);grid.appendChild(info);grid.appendChild(ct);box.appendChild(grid);box.appendChild(lb)}
})();
