/* Shared amenity list + icons (used by property.html and /admin). Add a line here to offer a new amenity. */
(function(){
var A=[
["Lift",'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 10l3-3 3 3M9 14l3 3 3-3"/>'],
["Power backup",'<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>'],
["Covered parking",'<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/>'],
["24x7 security",'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>'],
["CCTV surveillance",'<rect x="3" y="7" width="14" height="8" rx="2"/><path d="M17 10l4-2v8l-4-2M7 15v4M5 19h4"/>'],
["Gym",'<path d="M6 8v8M3 10v4M18 8v8M21 10v4M6 12h12"/>'],
["Swimming pool",'<path d="M3 18c2 0 2-1.5 4.5-1.5S10 18 12 18s2-1.5 4.5-1.5S19 18 21 18M3 13c2 0 2-1.5 4.5-1.5S10 13 12 13s2-1.5 4.5-1.5S19 13 21 13M8 9V5a2 2 0 0 1 4 0"/>'],
["Clubhouse",'<path d="M3 21h18M5 21V9l7-5 7 5v12M10 21v-6h4v6"/>'],
["Children's play area",'<circle cx="12" cy="12" r="9"/><path d="M8.5 9.5v.01M15.5 9.5v.01M8 14c1 2 2.5 3 4 3s3-1 4-3"/>'],
["Garden / park",'<circle cx="12" cy="9" r="5"/><path d="M12 14v7M9 21h6"/>'],
["24x7 water supply",'<path d="M12 3c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11z"/>'],
["Intercom",'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>'],
["Wi-Fi / internet",'<path d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M12 19.5v.01"/>'],
["Air conditioning",'<path d="M12 3v18M4.5 7.5l15 9M19.5 7.5l-15 9"/>'],
["Fire safety",'<path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z"/>'],
["Terrace",'<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>'],
["Balcony",'<path d="M3 11h18M5 11v9M9 11v9M15 11v9M19 11v9M3 20h18"/>'],
["Pet friendly",'<circle cx="7" cy="10" r="1.6"/><circle cx="12" cy="7" r="1.6"/><circle cx="17" cy="10" r="1.6"/><path d="M12 12c-3 0-5 3-5 5 0 1.5 1.5 2 3 1.5 1-.3 1.5-.5 2-.5s1 .2 2 .5c1.5.5 3 0 3-1.5 0-2-2-5-5-5z"/>'],
["Jogging track",'<rect x="3" y="7" width="18" height="10" rx="5"/><path d="M8 12h8"/>'],
["Community hall",'<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6M15 14.5c3 0 6 1.5 6 5.5"/>'],
["EV charging",'<path d="M9 3v5M15 3v5M7 8h10v4a5 5 0 0 1-10 0zM12 17v4"/>'],
["Vastu compliant",'<circle cx="12" cy="12" r="9"/><path d="M15 9l-2 6-4 0 2-6z"/>'],
["Rainwater harvesting",'<path d="M7 15a4 4 0 1 1 1-7.9A5 5 0 0 1 18 9a3.5 3.5 0 0 1-1 6.9M9 18v2M13 18v3M17 18v2"/>']
];
var CHECK='<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>';
window.IGH_AMENITIES=A.map(function(a){return a[0]});
window.IGH_ICON=function(label){var f=A.filter(function(a){return a[0]===label})[0];
 return '<svg viewBox="0 0 24 24" aria-hidden="true">'+(f?f[1]:CHECK)+'</svg>'};
})();
