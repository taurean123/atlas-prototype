/* =====================================================================
   ATLAS — Driver & Mover App logic (prototype)
   ===================================================================== */

const TOKENS = {
  _STAR_:'star', _TRUCK_:'truck', _BACK_:'back', _CHEV_:'chev', _CHAT_:'chat', _PHONE_:'phone',
  _CHECK_:'check', _CAMERA_:'camera', _CASH_:'cash', _DOWNLOAD_:'download', _DOC_:'doc',
  _SHIELD_:'shield', _NAV_:'nav', _BOX_:'box', _USERS_:'users', _PLUS_:'plus',
};
function tabbarHTML(active){
  const t = (id,ico,label)=>`<button data-t="${id}" class="${id===active?'active':''}" onclick="tab('${id}',this)">${icon(ico)}<span>${label}</span></button>`;
  return `<div class="tabbar">${t('v-home','grid','Jobs')}${t('v-earnings','chart','Earnings')}${t('v-wallet','wallet','Wallet')}${t('v-profile','user','Standing')}</div>`;
}
function boot(){
  document.getElementById('sb').innerHTML = statusbar(false);
  document.querySelectorAll('.view').forEach(v=>{ v.innerHTML = v.innerHTML.replace('_TABBAR_', tabbarHTML(v.id)); });
  let html = document.getElementById('app').innerHTML;
  for(const [k,name] of Object.entries(TOKENS)){ html = html.split(k).join(icon(name)); }
  document.getElementById('app').innerHTML = html;
  renderChecklist();
  // auto-pop a job after a moment
  setTimeout(()=>{ if(document.getElementById('v-home').classList.contains('active')) newJob(); }, 2600);
}
function tab(id){ go(id); document.querySelectorAll('.tabbar button').forEach(b=>b.classList.toggle('active', b.dataset.t===id)); }

let online = true;
function toggleOnline(el){
  online=!online; el.classList.toggle('on', online);
  document.getElementById('onlineLabel').textContent = online?"You're online":"You're offline";
  document.getElementById('onlineSub').textContent = online?'Receiving jobs in Mont Kiara zone':'Tap to start receiving jobs';
  document.getElementById('onlineBadge').textContent = online?'LIVE':'OFF';
  document.getElementById('onlineBadge').style.cssText = online?'background:rgba(24,169,87,.2);color:#7DFAB0':'background:rgba(255,255,255,.15);color:#fff';
}

/* incoming job sheet with countdown */
let jobTimer;
function newJob(){
  if(!online){ toast('Go online to receive jobs'); return; }
  openSheet('jobsheet');
  const bar = document.getElementById('job-timer-bar');
  bar.style.transition='none'; bar.style.width='100%';
  void bar.offsetWidth;
  bar.style.transition='width 15s linear'; bar.style.width='0%';
  clearTimeout(jobTimer);
  jobTimer = setTimeout(()=>{ if(document.getElementById('jobsheet').classList.contains('show')){ declineJob(); toast('Job expired — re-listed'); } }, 15000);
}
function declineJob(){ clearTimeout(jobTimer); closeSheet('jobsheet'); }
function acceptJob(){ clearTimeout(jobTimer); closeSheet('jobsheet'); toast('Job accepted — navigating to pickup'); go('v-job'); }

/* item checklist */
const CHECK = ['Sofa (3-seater)','Bed + mattress','Wardrobe ×2','Refrigerator','Dining set','Boxes ×15'];
function renderChecklist(){
  document.getElementById('checklist').innerHTML = CHECK.map((c,i)=>`
    <div class="checklist-item" id="ck${i}" onclick="toggleCheck(${i})">
      <div class="check-box">${icon('check')}</div>
      <div class="nm b small" style="flex:1">${c}</div>
    </div>`).join('');
  updateCheckCount();
}
function toggleCheck(i){
  const row=document.getElementById('ck'+i);
  row.classList.toggle('done');
  row.querySelector('.check-box').classList.toggle('on', row.classList.contains('done'));
  updateCheckCount();
}
function updateCheckCount(){
  const done=document.querySelectorAll('.checklist-item.done').length;
  document.getElementById('check-count').textContent = `${done} / ${CHECK.length} loaded`;
}

function capturePod(el){
  el.classList.add('filled');
  el.innerHTML = `<svg viewBox="0 0 100 75" style="width:100%" preserveAspectRatio="xMidYMid slice">
    <rect width="100" height="75" fill="#d8e0f2"/><rect y="50" width="100" height="25" fill="#c2cde6"/>
    <rect x="14" y="26" width="30" height="24" rx="2" fill="#9fb1d8"/><rect x="50" y="20" width="22" height="30" rx="2" fill="#aebcdf"/>
    <rect x="74" y="32" width="16" height="18" rx="2" fill="#92a6cf"/></svg>`;
  toast('Photo captured · geotagged');
}
function completeJob(){
  toast('Job complete · +RM 86.00 to wallet');
  setTimeout(()=>{ go('v-earnings'); tab('v-earnings'); }, 900);
}

boot();
