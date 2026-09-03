const DB_NAME = 'nijritu-local';
const DB_VERSION = 2;
const STORE = 'state';
const APP_VERSION = '0.2.0';

const defaultState = {
  version: APP_VERSION,
  profile: null,
  logs: {},
  customSymptoms: [],
  settings: { persistentStorageRequested: false }
};

let state = structuredClone(defaultState);
let currentView = 'track';
let deferredInstallPrompt = null;
let calendarMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function dbGet(key) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function dbPut(key, value) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function save() { await dbPut('state', state); }

async function load() {
  const saved = await dbGet('state');
  if (saved) state = {
    ...structuredClone(defaultState),
    ...saved,
    version: APP_VERSION,
    customSymptoms: saved.customSymptoms || [],
    settings: { ...defaultState.settings, ...(saved.settings || {}) }
  };
}

function isoDate(date = new Date()) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function fromISO(value) { const [y,m,d] = value.split('-').map(Number); return new Date(y,m-1,d); }
function addDays(value, days) { const d = fromISO(value); d.setDate(d.getDate()+days); return isoDate(d); }
function diffDays(a,b) { return Math.round((fromISO(b)-fromISO(a))/86400000); }
function formatDate(value, options={day:'numeric',month:'short'}) { return value ? fromISO(value).toLocaleDateString(undefined,options) : 'Not set'; }
function monthLabel(date) { return date.toLocaleDateString(undefined,{month:'long',year:'numeric'}); }
function escapeHTML(value='') { return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
function average(values, fallback) { return values.length ? Math.round(values.reduce((a,b)=>a+b,0)/values.length) : fallback; }
function periodStarts() { return Object.entries(state.logs).filter(([,log])=>log.period).map(([date])=>date).sort(); }
function cycleLengths() { const starts=periodStarts(); return starts.slice(1).map((d,i)=>diffDays(starts[i],d)).filter(v=>v>=15&&v<=90).slice(-6); }

function stats() {
  const starts=periodStarts(), lengths=cycleLengths();
  const typicalCycle=state.profile?.cycleLength || average(lengths,28);
  const periodDays=[];
  starts.forEach(start=>{ let count=0; for(let i=0;i<15;i++){const log=state.logs[addDays(start,i)]; if(log?.period) count++; else if(i>0) break;} if(count) periodDays.push(count); });
  const typicalPeriod=state.profile?.periodLength || average(periodDays.slice(-6),5);
  const lastStart=starts.at(-1)||null;
  const nextStart=lastStart?addDays(lastStart,typicalCycle):null;
  const cycleDay=lastStart?diffDays(lastStart,isoDate())+1:null;
  return {starts,lengths,typicalCycle,typicalPeriod,lastStart,nextStart,cycleDay};
}
function phaseForDay(day,length){ if(!day)return 'No cycle logged'; if(day<=5)return 'Menstrual'; if(day<Math.max(12,Math.round(length*.45)))return 'Follicular'; if(day<=Math.round(length*.55))return 'Ovulatory estimate'; return 'Luteal'; }
function predictedDates(){ const s=stats(); if(!s.nextStart)return []; return Array.from({length:s.typicalPeriod},(_,i)=>addDays(s.nextStart,i)); }

function render(){
  $$('.nav-item').forEach(btn=>btn.classList.toggle('active',btn.dataset.view===currentView));
  const views={track:renderTrack,knowledge:renderKnowledge,community:renderCommunity,help:renderHelp,settings:renderSettings};
  $('#app').innerHTML=views[currentView](); bindViewEvents();
}

function renderTrack(){
  const s=stats(), displayName=state.profile?.name||(state.profile?.mode==='partner'?'Her cycle':'My cycle'), phase=phaseForDay(s.cycleDay,s.typicalCycle);
  const todayLog=state.logs[isoDate()]||{};
  return `<section class="view-head"><div><p class="eyebrow">${escapeHTML(displayName)}</p><h1>Track</h1></div><button class="button accent small-button" data-action="log" data-date="${isoDate()}">Log today</button></section>
  <div class="grid">
    <article class="card hero"><div><p class="eyebrow">Current cycle</p><div class="metric">${s.cycleDay||'—'}</div><div class="metric-label">cycle day · ${escapeHTML(phase)}</div></div><div class="row"><div><strong>${s.nextStart?formatDate(s.nextStart,{weekday:'short',day:'numeric',month:'short'}):'Add a period start'}</strong><div class="metric-label">expected next period</div></div><button class="button primary small-button" data-action="log" data-date="${isoDate()}">Quick log</button></div></article>
    <article class="card side"><p class="eyebrow">At a glance</p><div class="stat-list"><div class="stat row"><span>Typical cycle</span><strong>${s.typicalCycle} days</strong></div><div class="stat row"><span>Typical period</span><strong>${s.typicalPeriod} days</strong></div><div class="stat row"><span>Next period</span><strong>${s.nextStart?Math.max(0,diffDays(isoDate(),s.nextStart))+' days':'Not set'}</strong></div><div class="stat row"><span>Logged starts</span><strong>${s.starts.length}</strong></div></div></article>
    <article class="card calendar-card"><div class="row"><div><p class="eyebrow">Calendar</p><h2 class="section-title" id="calendarTitle">${monthLabel(calendarMonth)}</h2></div><div><button class="button ghost small-button" data-action="prev-month">Prev</button> <button class="button ghost small-button" data-action="next-month">Next</button></div></div><div id="calendarMount">${renderCalendar(calendarMonth)}</div></article>
    <article class="card"><p class="eyebrow">Today</p><h2 class="section-title">${formatDate(isoDate(),{weekday:'long',day:'numeric',month:'long'})}</h2>${todayLog.flow||todayLog.symptoms||todayLog.notes||todayLog.period?`<div class="stat-list"><div class="stat row"><span>Period</span><strong>${todayLog.period?'Yes':'No'}</strong></div><div class="stat row"><span>Flow</span><strong>${escapeHTML(todayLog.flow||'Not logged')}</strong></div><div class="stat row"><span>Pain</span><strong>${escapeHTML(todayLog.pain||'Not logged')}</strong></div></div>`:'<div class="empty">Nothing logged today.</div>'}</article>
    <article class="card"><p class="eyebrow">Privacy</p><h2 class="section-title">Your data stays here.</h2><p class="muted">NijRitu stores tracking data in this browser. There is no tracker account and no personal-health endpoint.</p><button class="button ghost" data-view-target="settings">Data & backups</button></article>
  </div>`;
}

function renderCalendar(month){
  const y=month.getFullYear(),m=month.getMonth(),first=new Date(y,m,1),last=new Date(y,m+1,0),offset=first.getDay(),weeks=Math.ceil((offset+last.getDate())/7),predicted=new Set(predictedDates()),cells=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=>`<div class="cal-label">${d}</div>`);
  for(let i=0;i<weeks*7;i++){if(i<offset||i>=offset+last.getDate()){cells.push('<div></div>');continue;}const day=i-offset+1,date=isoDate(new Date(y,m,day)),log=state.logs[date],classes=['day'];if(date===isoDate())classes.push('today');if(log?.period)classes.push('period');else if(predicted.has(date))classes.push('predicted');cells.push(`<button class="${classes.join(' ')}" data-action="log" data-date="${date}"><span>${day}</span>${log?'<span class="dot"></span>':''}</button>`);}
  return `<div class="calendar">${cells.join('')}</div><p class="muted calendar-note">Filled days are logged period days. Light days are estimates from recorded history.</p>`;
}

function renderKnowledge(){
  const articles=[['Periods and menstrual health','NHS','https://www.nhs.uk/conditions/periods/','A practical overview of periods, symptoms and when to seek help.'],['Period problems','NHS','https://www.nhs.uk/conditions/periods/period-problems/','Information about pain, heavy periods and common concerns.'],['Menstruation and the menstrual cycle','ACOG','https://www.acog.org/womens-health/faqs/menstruation-and-the-menstrual-cycle','A clinician-reviewed explanation of the menstrual cycle.'],['Endometriosis','WHO','https://www.who.int/news-room/fact-sheets/detail/endometriosis','An evidence-based overview of endometriosis and its symptoms.'],['Period pain','Cleveland Clinic','https://my.clevelandclinic.org/health/diseases/4148-menstrual-cramps','A clear guide to menstrual cramps and common treatment approaches.'],['PCOS','Office on Women’s Health','https://womenshealth.gov/a-z-topics/polycystic-ovary-syndrome','A government health resource covering PCOS symptoms and care.']];
  return `<section class="view-head"><div><p class="eyebrow">Source linked</p><h1>Knowledge</h1></div></section><div class="notice">NijRitu curates useful resources and sends you to the original publisher. Medical content belongs to its respective source.</div><div class="article-grid" style="margin-top:16px">${articles.map(a=>`<a class="card article" href="${a[2]}" target="_blank" rel="noopener noreferrer"><span class="tag">${a[1]}</span><h3>${a[0]}</h3><p>${a[3]}</p><p class="read-link">Read original ↗</p></a>`).join('')}</div>`;
}
function renderCommunity(){return `<section class="view-head"><div><p class="eyebrow">Anonymous by design</p><h1>Community</h1></div></section><div class="grid"><article class="card hero"><p class="eyebrow">Coming next</p><h2 class="section-title large-title">Ask without creating a profile.</h2><p class="muted">Anonymous submissions rather than accounts, follower graphs or public profiles. Private tracker data never becomes community identity.</p><div><span class="tag">No profiles</span> <span class="tag">No DMs</span> <span class="tag">No health-data feed</span></div></article><article class="card side"><p class="eyebrow">Professional help</p><h2 class="section-title">Community Pro</h2><p class="muted">A separate directory for professionals who choose to list themselves, with qualifications, registration details where applicable, contact information and links.</p><span class="tag">Self-listed</span> <span class="tag">Verification planned</span></article></div><article class="card community-note"><p class="eyebrow">Privacy boundary</p><p class="muted">A public community needs a server. Your private tracker does not. These systems stay separate.</p></article>`;}
function renderHelp(){return `<section class="view-head"><div><p class="eyebrow">Useful next steps</p><h1>Help</h1></div></section><div class="grid"><article class="card"><p class="eyebrow">Start here</p><h2 class="section-title">When something feels wrong</h2><p class="muted">NijRitu can help record patterns and prepare questions. It does not diagnose conditions or replace a clinician.</p><div class="stat-list"><a class="stat row article" href="https://www.nhs.uk/conditions/periods/period-problems/" target="_blank" rel="noopener"><span>Period problems</span><strong>Read NHS ↗</strong></a><a class="stat row article" href="https://www.acog.org/womens-health/faqs/menstruation-and-the-menstrual-cycle" target="_blank" rel="noopener"><span>Cycle information</span><strong>Read ACOG ↗</strong></a></div></article><article class="card"><p class="eyebrow">Urgent</p><h2 class="section-title">Get appropriate medical care</h2><p class="muted">If symptoms are severe, rapidly worsening, or you feel unsafe, seek local medical care. For an emergency, use your local emergency number or emergency department.</p><div class="notice danger">Do not use NijRitu predictions or community discussions to decide whether an emergency is happening.</div></article></div>`;}
function renderSettings(){return `<section class="view-head"><div><p class="eyebrow">Control stays with you</p><h1>Settings</h1></div></section><div class="grid"><article class="card"><p class="eyebrow">Profile</p><h2 class="section-title">Your setup</h2><p class="muted">Change the tracking mode, cycle assumptions or nickname stored locally.</p><button class="button ghost" data-action="edit-profile">Edit setup</button></article><article class="card"><p class="eyebrow">Backup</p><h2 class="section-title">Take your data with you.</h2><p class="muted">Export a complete JSON backup or restore one. NijRitu never receives these files.</p><div class="row"><button class="button primary" data-action="export">Export</button><label class="button ghost file-button">Import<input class="hidden" id="importFile" type="file" accept="application/json"></label></div></article><article class="card"><p class="eyebrow">Storage</p><h2 class="section-title">Browser storage</h2><p class="muted">NijRitu can ask your browser to protect local storage from automatic eviction. This is not a substitute for backups.</p><button class="button ghost" data-action="persist">Request persistent storage</button></article><article class="card"><p class="eyebrow">Data</p><h2 class="section-title">Delete everything</h2><p class="muted">This removes NijRitu data from this browser. A saved backup is the only way to restore it.</p><button class="button ghost" data-action="reset">Delete local data</button></article><article class="card" style="grid-column:span 12"><p class="eyebrow">Principle</p><h2 class="section-title">Liberate the data.</h2><p class="muted">NijRitu is built around a simple boundary: the company should not need to own a person's private health history for the product to be useful.</p></article></div>`;}

function openLog(date){const log=state.logs[date]||{};$('#logDate').value=date;$('#logTitle').textContent=`Log ${formatDate(date,{weekday:'short',day:'numeric',month:'short'})}`;$('#flow').value=log.flow||'';$('#pain').value=log.pain||'';$('#symptoms').value=log.symptoms||'';$('#notes').value=log.notes||'';$('#periodDay').checked=!!log.period;$('#logDialog').showModal();}
async function saveLog(){const date=$('#logDate').value;state.logs[date]={period:$('#periodDay').checked,flow:$('#flow').value,pain:$('#pain').value,symptoms:$('#symptoms').value.trim(),notes:$('#notes').value.trim(),updatedAt:new Date().toISOString()};if(!state.logs[date].period&&!state.logs[date].flow&&!state.logs[date].pain&&!state.logs[date].symptoms&&!state.logs[date].notes)delete state.logs[date];await save();$('#logDialog').close();render();}
function openOnboarding(edit=false){return()=>{const p=state.profile||{};$('#profileMode').value=p.mode||'self';$('#profileName').value=p.name||'';$('#onboardStart').value=p.lastPeriodStart||stats().lastStart||'';$('#cycleLength').value=p.cycleLength||28;$('#periodLength').value=p.periodLength||5;$('#onboarding h1').textContent=edit?'Edit your setup.':'Your cycle. Your data. Your choice.';$('#onboarding').showModal();};}
async function saveProfile(){state.profile={mode:$('#profileMode').value,name:$('#profileName').value.trim(),lastPeriodStart:$('#onboardStart').value,cycleLength:Number($('#cycleLength').value)||28,periodLength:Number($('#periodLength').value)||5};if(state.profile.lastPeriodStart&&!state.logs[state.profile.lastPeriodStart])state.logs[state.profile.lastPeriodStart]={period:true,flow:'Medium',pain:'',symptoms:'',notes:'',updatedAt:new Date().toISOString()};await save();$('#onboarding').close();render();await requestPersistentStorage(true);}
async function requestPersistentStorage(silent=false){if(!navigator.storage?.persist){if(!silent)alert('Persistent browser storage is not available here. Keep an exported backup.');return;}const granted=await navigator.storage.persist();state.settings.persistentStorageRequested=granted;await save();if(!silent)alert(granted?'Persistent storage was granted by the browser.':'The browser did not grant persistent storage. Keep an exported backup.');}
function exportBackup(){const payload={...state,exportedAt:new Date().toISOString(),app:'NijRitu',format:2};const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`nijritu-backup-${isoDate()}.json`;a.click();URL.revokeObjectURL(url);}
async function handleImport(event){const file=event.target.files?.[0];if(!file)return;try{const parsed=JSON.parse(await file.text());if(!['Flow','NijRitu'].includes(parsed?.app)||!parsed.profile||typeof parsed.logs!=='object')throw new Error('Invalid backup');if(!confirm('Replace current local NijRitu data with this backup?'))return;state={...structuredClone(defaultState),...parsed,version:APP_VERSION,customSymptoms:parsed.customSymptoms||[],settings:{...defaultState.settings,...(parsed.settings||{})}};await save();render();alert('Backup restored locally.');}catch{alert('That file could not be imported as a valid NijRitu backup.');}finally{event.target.value='';}}
async function resetData(){if(!confirm('Delete all NijRitu data stored in this browser? This cannot be undone unless you have a backup.'))return;state=structuredClone(defaultState);await save();render();openOnboarding()();}

function bindViewEvents(){
  $$('[data-action="log"]').forEach(el=>el.addEventListener('click',()=>openLog(el.dataset.date)));
  $$('[data-view-target]').forEach(el=>el.addEventListener('click',()=>{currentView=el.dataset.viewTarget;render();}));
  $$('[data-action="prev-month"]').forEach(el=>el.addEventListener('click',()=>{calendarMonth=new Date(calendarMonth.getFullYear(),calendarMonth.getMonth()-1,1);render();}));
  $$('[data-action="next-month"]').forEach(el=>el.addEventListener('click',()=>{calendarMonth=new Date(calendarMonth.getFullYear(),calendarMonth.getMonth()+1,1);render();}));
  $$('[data-action="edit-profile"]').forEach(el=>el.addEventListener('click',openOnboarding(true)));
  $$('[data-action="export"]').forEach(el=>el.addEventListener('click',exportBackup));
  $$('[data-action="persist"]').forEach(el=>el.addEventListener('click',()=>requestPersistentStorage(false)));
  $$('[data-action="reset"]').forEach(el=>el.addEventListener('click',resetData));
  const importFile=$('#importFile');if(importFile)importFile.addEventListener('change',handleImport);
  $$('.nav-item').forEach(btn=>btn.addEventListener('click',()=>{currentView=btn.dataset.view;render();}));
}
$('#logForm').addEventListener('submit',e=>{e.preventDefault();saveLog();});
$('#onboardingForm').addEventListener('submit',e=>{e.preventDefault();saveProfile();});
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstallPrompt=e;$('#installBtn').hidden=false;});
$('#installBtn').addEventListener('click',async()=>{if(!deferredInstallPrompt)return;deferredInstallPrompt.prompt();await deferredInstallPrompt.userChoice;deferredInstallPrompt=null;$('#installBtn').hidden=true;});
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));

async function boot(){if(!('indexedDB' in window)){ $('#app').innerHTML='<div class="card"><h1>Local storage is unavailable.</h1><p class="muted">Use a modern browser with IndexedDB support.</p></div>';return;}await load();render();if(!state.profile)openOnboarding()();}
boot();