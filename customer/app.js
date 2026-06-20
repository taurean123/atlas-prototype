/* =====================================================================
   ATLAS — Customer App logic (prototype)
   ===================================================================== */

/* ---------- Demo data ---------- */
const VEHICLES = [
  { id:'bike', name:'Motorbike', cap:0.1,  base:5,  perKm:1.2, note:'Documents, small parcels' },
  { id:'car',  name:'Car',       cap:0.5,  base:8,  perKm:1.8, note:'Up to 25 kg, multiple parcels' },
  { id:'van',  name:'Van',       cap:6,    base:80, perKm:2.5, note:'Studio move, bulky items' },
  { id:'l1',   name:'1-Ton Lorry', cap:10, base:130,perKm:3.2, note:'1-bedroom, appliances' },
  { id:'l3',   name:'3-Ton Lorry', cap:18, base:220,perKm:4.0, note:'2–3 bedroom home' },
  { id:'l5',   name:'5-Ton Lorry', cap:28, base:320,perKm:4.8, note:'Large home / office · tail-lift' },
];
const DIST = 8.4; // km, demo

const SCENARIOS = {
  studio: { label:'Studio', items:[
    { ic:'sofa',    name:'Sofa (2-seater)', qty:1, vol:1.2, wt:45, frag:false, conf:96 },
    { ic:'bed',     name:'Mattress (Queen)', qty:1, vol:0.9, wt:35, frag:false, conf:94 },
    { ic:'wardrobe',name:'Wardrobe',        qty:1, vol:1.2, wt:60, frag:false, conf:88 },
    { ic:'fridge',  name:'Refrigerator',    qty:1, vol:0.8, wt:75, frag:true,  conf:97 },
    { ic:'box',     name:'Boxes (medium)',  qty:6, vol:0.12,wt:12, frag:false, conf:99 },
    { ic:'grid',    name:'TV 50"',          qty:1, vol:0.25,wt:18, frag:true,  conf:82 },
  ]},
  twobed: { label:'2-Bedroom', items:[
    { ic:'sofa',    name:'Sofa (3-seater)', qty:1, vol:1.6, wt:60, frag:false, conf:95 },
    { ic:'bed',     name:'Bed + mattress (Queen)', qty:2, vol:1.5, wt:70, frag:false, conf:90 },
    { ic:'wardrobe',name:'Wardrobe',        qty:2, vol:1.4, wt:65, frag:false, conf:88 },
    { ic:'fridge',  name:'Refrigerator',    qty:1, vol:0.9, wt:80, frag:true,  conf:97 },
    { ic:'box',     name:'Washing machine', qty:1, vol:0.6, wt:65, frag:true,  conf:96 },
    { ic:'grid',    name:'Dining table + chairs', qty:1, vol:1.3, wt:55, frag:false, conf:85 },
    { ic:'grid',    name:'TV 55"',          qty:1, vol:0.3, wt:20, frag:true,  conf:84 },
    { ic:'box',     name:'Boxes (medium)',  qty:15,vol:0.12,wt:12, frag:false, conf:99 },
  ]},
  office: { label:'Office', items:[
    { ic:'grid',    name:'Office desks',    qty:6, vol:0.7, wt:40, frag:false, conf:92 },
    { ic:'sofa',    name:'Office chairs',   qty:8, vol:0.4, wt:15, frag:false, conf:94 },
    { ic:'wardrobe',name:'Filing cabinets', qty:4, vol:0.6, wt:55, frag:false, conf:90 },
    { ic:'grid',    name:'Meeting table',   qty:1, vol:1.8, wt:80, frag:false, conf:86 },
    { ic:'box',     name:'Server rack',     qty:1, vol:1.2, wt:120,frag:true,  conf:80 },
    { ic:'grid',    name:'Monitors',        qty:10,vol:0.1, wt:6,  frag:true,  conf:88 },
    { ic:'sofa',    name:'Reception sofa',  qty:1, vol:1.6, wt:60, frag:false, conf:90 },
    { ic:'box',     name:'Boxes (medium)',  qty:20,vol:0.12,wt:12, frag:false, conf:99 },
  ]},
};

const ADDONS = [
  { id:'pack',  name:'Professional packing', desc:'Wrap & box fragile items', price:120, ic:'box',    on:false },
  { id:'crew',  name:'Manpower (2 movers)',  desc:'Carry, load & unload',      price:90,  ic:'users',  on:true  },
  { id:'ins',   name:'Move insurance',       desc:'Cover up to RM 5,000',      price:35,  ic:'shield', on:true  },
  { id:'store', name:'Short-term storage',   desc:'Per week, climate-controlled',price:200,ic:'home',   on:false },
];

/* ---------- State ---------- */
let S = { scenario:null, items:[], vehicle:null, addons:JSON.parse(JSON.stringify(ADDONS)), pkg:'standard' };

/* ---------- Boot: inject status bar + icons + tabbars ---------- */
const TOKENS = {
  _SEARCH_:'search', _SEND_:'send', _HOME_:'home', _TRUCK_:'truck', _CHEV_:'chev', _BOX_:'box',
  _USERS_:'users', _SHIELD_:'shield', _SPARK_:'spark', _BACK_:'back', _PLUS_:'plus', _CASH_:'cash',
  _CAMERA_:'camera', _VIDEO_:'video', _STAIRS_:'stairs', _CHECK_:'check', _EDIT_:'edit', _CLOCK_:'clock',
  _STAR_:'star', _CHAT_:'chat', _PHONE_:'phone', _PIN_:'pin', _LIST_:'list', _DOC_:'doc', _WALLET_:'wallet', _MINUS_:'minus',
};
function tabbarHTML(active){
  const t = (id,ico,label)=>`<button data-t="${id}" class="${id===active?'active':''}" onclick="tab('${id}',this)">${icon(ico)}<span>${label}</span></button>`;
  return `<div class="tabbar">${t('v-home','home','Home')}${t('v-activity','clock','Activity')}${t('v-wallet','wallet','Wallet')}${t('v-profile','user','Profile')}</div>`;
}
function boot(){
  document.getElementById('sb').innerHTML = statusbar(false);
  // tabbars (set active per containing view)
  document.querySelectorAll('.view').forEach(v=>{
    v.innerHTML = v.innerHTML.replace('_TABBAR_', tabbarHTML(v.id));
  });
  // icons
  document.querySelectorAll('.app').forEach(root=>{
    let html = root.innerHTML;
    for(const [k,name] of Object.entries(TOKENS)){ html = html.split(k).join(icon(name)); }
    root.innerHTML = html;
  });
  renderSendVehicles();
  renderTimeline();
}
function tab(id, el){
  go(id);
  document.querySelectorAll('.tabbar button').forEach(b=>b.classList.toggle('active', b.dataset.t===id));
}

/* ---------- SEND flow ---------- */
function startSend(){ go('v-send'); }
function renderSendVehicles(){
  const opts = [VEHICLES[0],VEHICLES[1],VEHICLES[2]];
  const el = document.getElementById('send-vehicles');
  el.innerHTML = opts.map((v,i)=>{
    const p = v.base + v.perKm*DIST;
    return `<div class="veh-opt ${i===0?'sel':''}" data-p="${p.toFixed(2)}" onclick="selSendVeh(this,${p.toFixed(2)})">
      <div class="vic">${icon(v.id==='bike'?'send':v.id==='car'?'box':'truck')}</div>
      <div style="flex:1"><div class="b">${v.name}</div><div class="tiny muted">${v.note}</div></div>
      <div class="price">${RM(p)}</div></div>`;
  }).join('');
}
function selSendVeh(el,p){
  document.querySelectorAll('#send-vehicles .veh-opt').forEach(x=>x.classList.remove('sel'));
  el.classList.add('sel');
  document.getElementById('send-price').textContent = RM(p);
}
function confirmSend(){
  document.getElementById('done-title').textContent = 'Parcel booked!';
  document.getElementById('done-sub').textContent = 'Matching the nearest rider — usually under 2 minutes.';
  openSheet('done');
}

/* ---------- MOVE flow ---------- */
function resetMove(){
  S.scenario=null; S.items=[]; S.vehicle=null; S.pkg='standard'; S.addons=JSON.parse(JSON.stringify(ADDONS)); capCount=0;
  // reset capture screen UI
  const tiles=document.querySelectorAll('#v-move-capture .capture-tile');
  tiles.forEach((t,i)=>{ t.classList.remove('filled'); t.innerHTML=icon(i===2?'video':'camera'); });
  const cc=document.getElementById('cap-count'); if(cc) cc.textContent='0';
  document.querySelectorAll('.scenario-card').forEach(x=>x.classList.remove('sel'));
  const nx=document.getElementById('cap-next'); if(nx) nx.disabled=true;
}
function startMove(){ resetMove(); go('v-move-route'); }
function startTransport(){ resetMove(); S.scenario='office'; S.items=JSON.parse(JSON.stringify(SCENARIOS.office.items)); go('v-move-route'); toast('Transport · interstate AI estimate'); }

let capCount = 0;
function addRoom(el){
  capCount++;
  el.classList.add('filled');
  el.innerHTML = roomThumb(capCount);
  document.getElementById('cap-count').textContent = capCount;
  // auto-pick a scenario by number of rooms if none chosen
  if(!S.scenario){ const sc = capCount<=1?'studio':capCount===2?'twobed':'office'; primeScenario(sc); }
  document.getElementById('cap-next').disabled = false;
}
function roomThumb(n){
  const tones=['#cdd9f2','#d8cdf2','#cdeee9'];
  const t=tones[n%3];
  return `<svg viewBox="0 0 100 100" class="room-img" preserveAspectRatio="xMidYMid slice">
    <rect width="100" height="100" fill="${t}"/><rect y="68" width="100" height="32" fill="#b9c6e6"/>
    <rect x="12" y="40" width="34" height="30" rx="3" fill="#9fb1d8"/><rect x="56" y="30" width="30" height="40" rx="3" fill="#aebcdf"/>
    <circle cx="74" cy="50" r="9" fill="#92a6cf"/></svg>`;
}
function pickScenario(sc, el){
  document.querySelectorAll('.scenario-card').forEach(x=>x.classList.remove('sel'));
  el.classList.add('sel');
  primeScenario(sc);
  document.getElementById('cap-next').disabled = false;
}
function primeScenario(sc){
  S.scenario = sc;
  S.items = JSON.parse(JSON.stringify(SCENARIOS[sc].items));
}

/* ----- scan animation ----- */
function runScan(){
  if(!S.scenario){ primeScenario('studio'); }
  go('v-move-scan');
  // reset
  ['ss0','ss1','ss2','ss3','ss4'].forEach(id=>{ const e=document.getElementById(id); e.classList.remove('on','done'); });
  ['d1','d2','d3','d4'].forEach(id=>{ document.getElementById(id).style.opacity='0'; });
  const dets=['d1','d2','d3','d4'];
  dets.forEach((id,i)=> setTimeout(()=>{ const e=document.getElementById(id); e.style.opacity='1'; e.classList.add('pop'); }, 500+i*420));
  const steps=['ss0','ss1','ss2','ss3','ss4'];
  steps.forEach((id,i)=>{
    setTimeout(()=>{
      if(i>0) document.getElementById(steps[i-1]).classList.add('done');
      document.getElementById(id).classList.add('on');
    }, 300+i*620);
  });
  setTimeout(()=>{ document.getElementById('ss4').classList.add('done'); renderItems(); go('v-move-items'); }, 300+5*620+400);
}

/* ----- volume / price helpers ----- */
function totalVolume(){ return S.items.reduce((s,it)=>s+it.vol*it.qty,0); }
function totalWeight(){ return S.items.reduce((s,it)=>s+it.wt*it.qty,0); }
function recommendVehicle(){
  const need = totalVolume()*1.15; // headroom
  // moving vehicles only (van and up)
  const movers = VEHICLES.filter(v=>v.cap>=4);
  return movers.find(v=>v.cap>=need) || movers[movers.length-1];
}
function moveBasePrice(veh){
  return veh.base + veh.perKm*DIST + totalVolume()*12;
}
function addonsTotal(){ return S.addons.filter(a=>a.on).reduce((s,a)=>s+a.price,0); }

/* ----- item list ----- */
function renderItems(){
  const el = document.getElementById('item-list');
  el.innerHTML = S.items.map((it,i)=>{
    const conf = it.conf>=90?'hi':'mid';
    return `<div class="item-row">
      <div class="iic">${icon(it.ic)}</div>
      <div class="grow">
        <div class="nm">${it.name} ${it.frag?'<span class="badge danger" style="height:18px">Fragile</span>':''}</div>
        <div class="meta">${(it.vol).toFixed(2)} m³ each · <span class="conf ${conf}">${it.conf}%</span></div>
      </div>
      <div class="stepper">
        <button onclick="chQty(${i},-1)">${icon('minus')}</button>
        <span class="q">${it.qty}</span>
        <button onclick="chQty(${i},1)">${icon('plus')}</button>
      </div></div>`;
  }).join('');
  document.getElementById('total-vol').textContent = totalVolume().toFixed(1);
  document.getElementById('total-wt').textContent = Math.round(totalWeight());
  document.getElementById('item-count').textContent = S.items.length;
}
function chQty(i,d){
  S.items[i].qty = Math.max(0, S.items[i].qty+d);
  if(S.items[i].qty===0) S.items.splice(i,1);
  renderItems();
}

/* ----- vehicle recommendation screen ----- */
function renderVehicles(){
  const rec = recommendVehicle();
  S.vehicle = S.vehicle || rec;
  document.getElementById('veh-vol').textContent = totalVolume().toFixed(1)+' m³';
  const idx = VEHICLES.indexOf(rec);
  const opts = [rec, VEHICLES[Math.min(idx+1, VEHICLES.length-1)]].filter((v,i,a)=>a.indexOf(v)===i);
  const el = document.getElementById('veh-list');
  el.innerHTML = opts.map((v,i)=>{
    const p = moveBasePrice(v);
    const sel = (S.vehicle.id===v.id);
    const fill = Math.min(100, Math.round(totalVolume()/v.cap*100));
    return `<div class="veh-opt ${sel?'sel':''}" onclick="selVeh('${v.id}',this)">
      <div class="vic">${icon('truck')}</div>
      <div style="flex:1">
        <div class="row" style="justify-content:space-between"><div class="b">${v.name}</div>${i===0?'<span class="rec">✓ RECOMMENDED</span>':'<span class="tiny muted">Next size up</span>'}</div>
        <div class="tiny muted">${v.cap} m³ capacity · ${v.note}</div>
        <div class="progress" style="margin-top:7px"><i style="width:${fill}%"></i></div>
        <div class="tiny muted" style="margin-top:3px">${fill}% full</div>
      </div>
      <div class="price">${RM(p)}</div></div>`;
  }).join('');
}
function selVeh(id,el){
  S.vehicle = VEHICLES.find(v=>v.id===id);
  document.querySelectorAll('#veh-list .veh-opt').forEach(x=>x.classList.remove('sel'));
  el.classList.add('sel');
}

/* ----- add-ons ----- */
function renderAddons(){
  const el = document.getElementById('addon-list');
  el.innerHTML = S.addons.map((a,i)=>`
    <div class="addon-line">
      <div class="aic">${icon(a.ic)}</div>
      <div style="flex:1"><div class="b">${a.name}</div><div class="tiny muted">${a.desc}</div></div>
      <div class="price small" style="margin-right:6px">${RM(a.price)}</div>
      <div class="toggle ${a.on?'on':''}" onclick="tgAddon(${i},this)"><i></i></div>
    </div>`).join('');
}
function tgAddon(i,el){ S.addons[i].on=!S.addons[i].on; el.classList.toggle('on'); }

/* ----- quote ----- */
function renderQuote(){
  const veh = S.vehicle || recommendVehicle();
  const base = moveBasePrice(veh);
  const vehBase = veh.base + veh.perKm*DIST;
  const volC = totalVolume()*12;
  const add = addonsTotal();
  const sub = base + add;
  const disc = sub*0.20;
  const std = sub - disc;
  const pri = std + 60;
  const rows = [
    ['Vehicle base + distance ('+DIST+' km)', vehBase],
    ['Volume — '+totalVolume().toFixed(1)+' m³', volC],
  ];
  S.addons.filter(a=>a.on).forEach(a=>rows.push([a.name, a.price]));
  rows.push(['ATLAS20 promo (−20%)', -disc, true]);
  document.getElementById('breakdown').innerHTML = rows.map(r=>`
    <div class="between" style="padding:5px 0"><div class="small ${r[2]?'':'muted'}" style="${r[2]?'color:var(--ok);font-weight:700':''}">${r[0]}</div>
    <div class="b small" style="${r[2]?'color:var(--ok)':''}">${r[1]<0?'−':''}${RM(Math.abs(r[1]))}</div></div>`).join('');
  document.getElementById('quote-total').textContent = RM(std);
  document.getElementById('pkg-std-price').textContent = RM(std);
  document.getElementById('pkg-pri-price').textContent = RM(pri);
  S._std = std; S._pri = pri;
  updatePay();
}
function pickPkg(p,el){
  S.pkg=p;
  document.querySelectorAll('.pkg').forEach(x=>x.classList.remove('sel'));
  el.classList.add('sel');
  updatePay();
}
function updatePay(){
  const v = S.pkg==='priority'?S._pri:S._std;
  document.getElementById('final-pay').textContent = RM(v);
}
function confirmMove(){
  document.getElementById('done-title').textContent = 'Move booked!';
  document.getElementById('done-sub').textContent = 'Your crew is confirmed for today, 2:00 PM. Live tracking starts on dispatch.';
  openSheet('done');
}

/* ---------- hook navigation to render dependent screens ---------- */
const _go = go;
go = function(id){
  if(id==='v-move-items') renderItems();
  if(id==='v-move-vehicle') renderVehicles();
  if(id==='v-move-addons') renderAddons();
  if(id==='v-move-quote') renderQuote();
  _go(id);
};

/* ---------- tracking timeline ---------- */
function renderTimeline(){
  const steps = [
    ['done','Order confirmed','Today, 1:52 PM'],
    ['done','Driver assigned — Faiz','1:54 PM'],
    ['now','En route to pickup','ETA 6 min'],
    ['','Loading & in transit',''],
    ['','Delivered + proof of delivery',''],
  ];
  document.getElementById('track-timeline').innerHTML = steps.map((s,i)=>`
    <div class="tl-step ${s[0]}">
      <div class="c"><div class="d">${s[0]==='done'?icon('check'):''}</div>${i<steps.length-1?'<div class="ln"></div>':''}</div>
      <div class="body"><div class="t">${s[1]}</div><div class="s">${s[2]||'Pending'}</div></div>
    </div>`).join('');
  // animate vehicle along route
  let t=0; const veh=document.getElementById('track-veh');
  clearInterval(window._trk);
  window._trk=setInterval(()=>{ t=(t+1)%100; const x=135-(t*0.9); const y=118-(t*0.6); veh.style.left=x+'px'; veh.style.top=y+'px'; },120);
}

boot();
