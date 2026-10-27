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
 var area=p.area?window.IGH_AREA(p.area):"",furn=(p.furnishing&&p.furnishing!="Not applicable")?p.furnishing:"";
 function sec(t){var s=h("div","pd-sec");s.appendChild(h("h3","",t));main.appendChild(s);return s}
 var ov=[["Area",area],["Property type",p.ptype],["Furnished",furn],["Bedrooms",p.bedrooms],["Bathrooms",p.bathrooms]].filter(function(r){return r[1]});
 if(ov.length){var s1=sec("Overview"),tl=h("div","pd-tiles");ov.forEach(function(r){var t=h("div","pd-tile");t.appendChild(h("span","",r[0]));t.appendChild(h("b","",r[1]));tl.appendChild(t)});s1.appendChild(tl)}
 if(p.description){var s2=sec("About this property");String(p.description).split(/\n{2,}/).forEach(function(x){if(x.trim())s2.appendChild(h("p","",x.trim()))})}
 var am=Array.isArray(p.amenities)?p.amenities.filter(Boolean):[];
 if(am.length){var s3=sec("Amenities"),ag=h("div","pd-amen");am.forEach(function(a){var d=h("div","pd-am"),ic=h("span","ico");ic.innerHTML=window.IGH_ICON?window.IGH_ICON(a):"";d.appendChild(ic);d.appendChild(h("span","",a));ag.appendChild(d)});s3.appendChild(ag)}
 grid.appendChild(main);grid.appendChild(info);box.appendChild(grid);box.appendChild(lb)}
})();
