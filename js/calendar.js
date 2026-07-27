/* ============================================================
   CALENDAR.JS
   ============================================================ */

let calMode = 'month';
let calDate = new Date();

const CATEGORY_COLORS = { Homework:'#FBBF24', Project:'#4F8CFF', Quiz:'#22D3EE', Exam:'#FB7185', Personal:'#34D399', Organization:'#A78BFA' };

function initCalendar(){ renderCalendar(); renderUnivCalendar(); }

/* ---------- MAIN SCHEDULE CALENDAR (classes + tasks) ---------- */
function setCalMode(m){
  calMode = m;
  document.querySelectorAll('[data-mode]').forEach(b=>b.classList.toggle('active', b.dataset.mode===m));
  renderCalendar();
}
function navCal(dir){
  if(calMode==='month') calDate.setMonth(calDate.getMonth()+dir);
  else if(calMode==='week') calDate.setDate(calDate.getDate()+dir*7);
  else calDate.setDate(calDate.getDate()+dir);
  renderCalendar();
}

function eventsForDate(dateStr){
  const events = [];
  const dayName = DAY_NAMES[new Date(dateStr+'T00:00').getDay()];
  DB.getSubjects().filter(s=>!s.archived && s.days.includes(dayName)).forEach(s=>{
    events.push({ title:`${s.code}`, color:s.color, type:'class', time:s.start });
  });
  DB.getTasks().filter(t=>t.dueDate===dateStr).forEach(t=>{
    events.push({ title:t.title, color:CATEGORY_COLORS[t.category]||'#8a90a6', type:'task', time:t.dueTime, task:t });
  });
  return events.sort((a,b)=> (a.time||'').localeCompare(b.time||''));
}

function renderCalendar(){
  document.getElementById('calBody').innerHTML = calMode==='month' ? monthHtml() : calMode==='week' ? weekHtml() : dayHtml();
}

function monthHtml(){
  const y = calDate.getFullYear(), m = calDate.getMonth();
  document.getElementById('calTitle').textContent = calDate.toLocaleDateString([], {month:'long', year:'numeric'});
  const first = new Date(y,m,1);
  const startOffset = first.getDay();
  const daysInMonth = new Date(y,m+1,0).getDate();
  const daysInPrevMonth = new Date(y,m,0).getDate();

  let html = `<div class="uc-grid mb-1">${DAY_NAMES.map(d=>`<div class="text-center text-faint" style="font-size:.72rem;font-weight:700">${d}</div>`).join('')}</div><div class="uc-grid">`;
  const totalCells = Math.ceil((startOffset+daysInMonth)/7)*7;
  for(let i=0;i<totalCells;i++){
    let dayNum, monthOffset=0, other=false;
    if(i < startOffset){ dayNum = daysInPrevMonth-startOffset+i+1; monthOffset=-1; other=true; }
    else if(i >= startOffset+daysInMonth){ dayNum = i-startOffset-daysInMonth+1; monthOffset=1; other=true; }
    else dayNum = i-startOffset+1;
    const d = new Date(y, m+monthOffset, dayNum);
    const dateStr = ymdLocal(d);
    const isToday = dateStr === todayKey();
    const evts = eventsForDate(dateStr);
    html += `<div class="uc-cell ${isToday?'today':''} ${other?'other-month':''}" onclick="openDayModal('${dateStr}')" title="${evts.map(e=>e.title).join(', ')}">
      <div class="uc-daynum">${dayNum}</div>
      <div class="uc-dots">${evts.slice(0,4).map(e=>`<span class="uc-dot" style="background:${e.color}"></span>`).join('')}</div>
    </div>`;
  }
  html += `</div>`;
  return html;
}

function weekHtml(){
  const start = new Date(calDate); start.setDate(calDate.getDate()-calDate.getDay());
  const end = new Date(start); end.setDate(start.getDate()+6);
  document.getElementById('calTitle').textContent = `${start.toLocaleDateString([], {month:'short', day:'numeric'})} – ${end.toLocaleDateString([], {month:'short', day:'numeric', year:'numeric'})}`;
  let html = `<div class="uc-week-row">`;
  for(let i=0;i<7;i++){
    const d = new Date(start); d.setDate(start.getDate()+i);
    const dateStr = ymdLocal(d);
    const isToday = dateStr===todayKey();
    const evts = eventsForDate(dateStr);
    html += `<div class="uc-week-cell ${isToday?'today':''}" onclick="openDayModal('${dateStr}')" title="${evts.map(e=>e.title).join(', ')}">
        <div class="text-faint" style="font-size:.64rem">${DAY_NAMES[d.getDay()]}</div>
        <div class="fw-bold mono" style="font-size:.85rem">${d.getDate()}</div>
        <div class="uc-dots justify-content-center">${evts.slice(0,4).map(e=>`<span class="uc-dot" style="background:${e.color}"></span>`).join('')}</div>
      </div>`;
  }
  html += `</div>`;
  return html;
}

function dayHtml(){
  const dateStr = ymdLocal(calDate);
  document.getElementById('calTitle').textContent = calDate.toLocaleDateString([], {weekday:'long', month:'long', day:'numeric', year:'numeric'});
  const evts = eventsForDate(dateStr);
  if(!evts.length) return `<div class="text-center py-5 text-faint">No events for this day</div>`;
  return evts.map(e=>`
    <div class="list-row">
      <span class="dot-color" style="background:${e.color}"></span>
      <div class="flex-grow-1"><b>${escapeHtml(e.title)}</b><div class="text-faint" style="font-size:.78rem">${fmtTime(e.time)} · ${e.type==='class'?'Class':e.task.category}</div></div>
    </div>`).join('');
}

function openDayModal(dateStr){
  const evts = eventsForDate(dateStr);
  const body = document.getElementById('dayModalBody');
  const d = new Date(dateStr+'T00:00');
  body.innerHTML = `<h5 class="mb-3">${d.toLocaleDateString([], {weekday:'long', month:'long', day:'numeric'})}</h5>
  ${evts.length? evts.map(e=>`
    <div class="list-row"><span class="dot-color" style="background:${e.color}"></span>
      <div class="flex-grow-1"><b>${escapeHtml(e.title)}</b><div class="text-faint" style="font-size:.78rem">${fmtTime(e.time)} · ${e.type==='class'?'Class':e.task.category}</div></div>
    </div>`).join('') : `<div class="text-faint text-center py-3">Nothing scheduled</div>`}
  <button class="btn btn-ghost w-100 mt-3" onclick="location.href='tasks.html'">Manage Tasks</button>`;
  new bootstrap.Modal(document.getElementById('dayModal')).show();
}
function escapeHtml(s){ const d=document.createElement('div'); d.textContent=s||''; return d.innerHTML; }


/* ============================================================
   SEPARATE UNIVERSITY CALENDAR (its own month/week/day view)
   ============================================================ */
const UNIV_COLORS = ['#F59E0B','#7C6CF6','#4F8CFF','#FB7185','#34D399','#22D3EE','#F472B6','#A78BFA'];
let univCalMode = 'month';
let univCalDate = new Date();
let univModalMode = 'range';
let univModalColor = UNIV_COLORS[0];
let univEditingId = null;

function univEventsForDate(dateStr){
  return DB.getUniversityEvents().filter(u=>u.dates.includes(dateStr));
}

function setUnivCalMode(m){
  univCalMode = m;
  document.querySelectorAll('[data-ucmode]').forEach(b=>b.classList.toggle('active', b.dataset.ucmode===m));
  renderUnivCalendar();
}
function navUnivCal(dir){
  if(univCalMode==='month') univCalDate.setMonth(univCalDate.getMonth()+dir);
  else if(univCalMode==='week') univCalDate.setDate(univCalDate.getDate()+dir*7);
  else univCalDate.setDate(univCalDate.getDate()+dir);
  renderUnivCalendar();
}

function renderUnivCalendar(){
  const body = document.getElementById('univCalBody');
  if(!body) return;
  body.innerHTML = univCalMode==='month' ? univMonthHtml() : univCalMode==='week' ? univWeekHtml() : univDayHtml();
  renderUnivEventListForPeriod();
}

function univMonthHtml(){
  const y = univCalDate.getFullYear(), m = univCalDate.getMonth();
  document.getElementById('univCalTitle').textContent = univCalDate.toLocaleDateString([], {month:'long', year:'numeric'});
  const first = new Date(y,m,1);
  const startOffset = first.getDay();
  const daysInMonth = new Date(y,m+1,0).getDate();
  const daysInPrevMonth = new Date(y,m,0).getDate();

  let html = `<div class="uc-grid mb-1">${DAY_NAMES.map(d=>`<div class="text-center text-faint" style="font-size:.68rem;font-weight:700">${d}</div>`).join('')}</div><div class="uc-grid">`;
  const totalCells = Math.ceil((startOffset+daysInMonth)/7)*7;
  for(let i=0;i<totalCells;i++){
    let dayNum, monthOffset=0, other=false;
    if(i < startOffset){ dayNum = daysInPrevMonth-startOffset+i+1; monthOffset=-1; other=true; }
    else if(i >= startOffset+daysInMonth){ dayNum = i-startOffset-daysInMonth+1; monthOffset=1; other=true; }
    else dayNum = i-startOffset+1;
    const d = new Date(y, m+monthOffset, dayNum);
    const dateStr = ymdLocal(d);
    const isToday = dateStr === todayKey();
    const evts = univEventsForDate(dateStr);
    html += `<div class="uc-cell ${isToday?'today':''} ${other?'other-month':''}" onclick="openUnivEventModal(null,'${dateStr}')" title="${evts.map(e=>e.title).join(', ')}">
      <div class="uc-daynum">${dayNum}</div>
      <div class="uc-dots">${evts.slice(0,4).map(e=>`<span class="uc-dot" style="background:${e.color}"></span>`).join('')}</div>
    </div>`;
  }
  html += `</div>`;
  return html;
}

function univWeekHtml(){
  const start = new Date(univCalDate); start.setDate(univCalDate.getDate()-univCalDate.getDay());
  const end = new Date(start); end.setDate(start.getDate()+6);
  document.getElementById('univCalTitle').textContent = `${start.toLocaleDateString([], {month:'short', day:'numeric'})} – ${end.toLocaleDateString([], {month:'short', day:'numeric', year:'numeric'})}`;
  let html = `<div class="uc-week-row">`;
  for(let i=0;i<7;i++){
    const d = new Date(start); d.setDate(start.getDate()+i);
    const dateStr = ymdLocal(d);
    const isToday = dateStr===todayKey();
    const evts = univEventsForDate(dateStr);
    html += `<div class="uc-week-cell ${isToday?'today':''}" onclick="openUnivEventModal(null,'${dateStr}')" title="${evts.map(e=>e.title).join(', ')}">
        <div class="text-faint" style="font-size:.64rem">${DAY_NAMES[d.getDay()]}</div>
        <div class="fw-bold mono" style="font-size:.85rem">${d.getDate()}</div>
        <div class="uc-dots justify-content-center">${evts.slice(0,4).map(e=>`<span class="uc-dot" style="background:${e.color}"></span>`).join('')}</div>
      </div>`;
  }
  html += `</div>`;
  return html;
}

function univDayHtml(){
  const dateStr = ymdLocal(univCalDate);
  document.getElementById('univCalTitle').textContent = univCalDate.toLocaleDateString([], {weekday:'long', month:'long', day:'numeric', year:'numeric'});
  const evts = univEventsForDate(dateStr);
  if(!evts.length) return `<div class="text-center py-3 text-faint" style="cursor:pointer" onclick="openUnivEventModal(null,'${dateStr}')"><i class="bi bi-plus-circle me-1"></i>No events — tap to add one for this day</div>`;
  return `<div class="text-center text-faint" style="font-size:.78rem;cursor:pointer" onclick="openUnivEventModal(null,'${dateStr}')"><i class="bi bi-plus-circle me-1"></i>Tap to add another event for this day</div>`;
}

function getUnivPeriodDates(){
  const dates = [];
  if(univCalMode==='month'){
    const y = univCalDate.getFullYear(), m = univCalDate.getMonth();
    const daysInMonth = new Date(y,m+1,0).getDate();
    for(let d=1; d<=daysInMonth; d++) dates.push(ymdLocal(new Date(y,m,d)));
  } else if(univCalMode==='week'){
    const start = new Date(univCalDate); start.setDate(univCalDate.getDate()-univCalDate.getDay());
    for(let i=0;i<7;i++){ const d=new Date(start); d.setDate(start.getDate()+i); dates.push(ymdLocal(d)); }
  } else {
    dates.push(ymdLocal(univCalDate));
  }
  return dates;
}
function univPeriodLabel(){
  if(univCalMode==='month') return 'Events This Month';
  if(univCalMode==='week') return 'Events This Week';
  return 'Events Today';
}

function renderUnivEventListForPeriod(){
  const titleEl = document.getElementById('univListTitle');
  if(titleEl) titleEl.innerHTML = `<i class="bi bi-calendar-event"></i>${univPeriodLabel()}`;
  const wrap = document.getElementById('univEventList');
  if(!wrap) return;
  const periodDates = getUnivPeriodDates();
  const events = DB.getUniversityEvents()
    .filter(e=> e.dates.some(d=>periodDates.includes(d)))
    .sort((a,b)=> (a.dates[0]||'').localeCompare(b.dates[0]||''));
  if(!events.length){
    wrap.innerHTML = `<div class="text-center py-4"><i class="bi bi-calendar-plus" style="font-size:1.6rem;color:var(--text-faint)"></i><div class="text-soft mt-2" style="font-size:.85rem;font-weight:600">No university events in this period</div><div class="text-faint" style="font-size:.75rem">Tap "Add Event" or any date above to add one.</div></div>`;
    return;
  }
  wrap.innerHTML = events.map(e=>`
    <div class="list-row">
      <span class="dot-color" style="background:${e.color}"></span>
      <div class="flex-grow-1">
        <div style="font-weight:700;font-size:.85rem">${escapeHtml(e.title)}</div>
        <div class="text-faint" style="font-size:.75rem"><i class="bi bi-calendar3 me-1"></i>${formatUnivDates(e.dates)}</div>
        ${e.note?`<div class="text-faint" style="font-size:.72rem">${escapeHtml(e.note)}</div>`:''}
      </div>
      <button class="btn-icon" onclick="openUnivEventModal('${e.id}')"><i class="bi bi-pencil"></i></button>
      <button class="btn-icon" onclick="deleteUnivEvent('${e.id}')"><i class="bi bi-trash3"></i></button>
    </div>`).join('');
}

/* ---------- University event modal (add/edit) ---------- */
function openUnivEventModal(id, presetDate){
  univEditingId = id || null;
  const existing = id ? DB.getUniversityEvents().find(e=>e.id===id) : null;
  univModalColor = existing ? (existing.color||UNIV_COLORS[0]) : UNIV_COLORS[0];
  univModalMode = existing && existing.dates.length>2 && isContiguousRange(existing.dates) ? 'range' : (existing ? 'multiple' : 'range');

  const initialDates = existing ? existing.dates.slice().sort() : (presetDate ? [presetDate] : [todayKey()]);
  const rangeStart = initialDates[0];
  const rangeEnd = initialDates[initialDates.length-1];

  const body = document.getElementById('univEventModalBody');
  body.innerHTML = `
    <h5 class="mb-3"><i class="bi bi-bank2 me-2"></i>${existing?'Edit':'Add'} University Event</h5>
    <div class="mb-2"><label>Event Title</label><input class="form-control" id="ueTitle" placeholder="e.g. Semestral Break, Enrollment, Foundation Day" value="${existing?escapeHtml(existing.title):''}"></div>
    <div class="mb-3"><label>Note (optional)</label><textarea class="form-control" id="ueNote" rows="2" placeholder="Additional details…">${existing?escapeHtml(existing.note||''):''}</textarea></div>

    <div class="mb-2">
      <label>Color</label>
      <div class="d-flex gap-2 flex-wrap" id="ueColorPicker">
        ${UNIV_COLORS.map(c=>`<div onclick="selectUnivColor('${c}')" data-color-swatch="${c}" style="width:26px;height:26px;border-radius:50%;cursor:pointer;background:${c};border:2px solid ${c===univModalColor?'#fff':'transparent'};box-shadow:0 0 0 1px rgba(0,0,0,.15)"></div>`).join('')}
      </div>
    </div>

    <div class="mb-3">
      <div class="btn-group w-100" role="group">
        <button type="button" class="btn btn-ghost btn-sm ${univModalMode==='range'?'active':''}" id="ueModeRangeBtn" onclick="setUnivMode('range')"><i class="bi bi-calendar-range me-1"></i>Date Range</button>
        <button type="button" class="btn btn-ghost btn-sm ${univModalMode==='multiple'?'active':''}" id="ueModeMultiBtn" onclick="setUnivMode('multiple')"><i class="bi bi-calendar-plus me-1"></i>Specific Dates</button>
      </div>
    </div>

    <div id="ueRangeFields" class="${univModalMode==='range'?'':'d-none'}">
      <div class="row g-2 mb-2">
        <div class="col-6"><label>From</label><input type="date" class="form-control" id="ueRangeStart" value="${rangeStart}"></div>
        <div class="col-6"><label>To</label><input type="date" class="form-control" id="ueRangeEnd" value="${rangeEnd}"></div>
      </div>
      <div class="text-faint" style="font-size:.75rem">Every day in this range (inclusive) will show the event.</div>
    </div>

    <div id="ueMultiFields" class="${univModalMode==='multiple'?'':'d-none'}">
      <label>Dates</label>
      <div id="ueDateRows">
        ${(existing ? existing.dates.slice().sort() : (presetDate?[presetDate]:[todayKey()])).map(d=>univDateRowHtml(d)).join('')}
      </div>
      <button type="button" class="btn btn-ghost btn-sm mt-1" onclick="addUnivDateRow()"><i class="bi bi-plus-lg me-1"></i>Add Another Date</button>
    </div>

    <div class="d-flex gap-2 mt-3">
      <button class="btn btn-accent flex-grow-1" onclick="saveUnivEvent()"><i class="bi bi-check2 me-1"></i>Save Event</button>
      ${existing?`<button class="btn btn-ghost" onclick="deleteUnivEvent('${existing.id}')"><i class="bi bi-trash3"></i></button>`:''}
    </div>`;
  new bootstrap.Modal(document.getElementById('univEventModal')).show();
}
function univDateRowHtml(value){
  return `<div class="d-flex gap-2 mb-2 uev-date-row">
    <input type="date" class="form-control" value="${value||''}">
    <button type="button" class="btn-icon" onclick="this.parentElement.remove()"><i class="bi bi-x-lg"></i></button>
  </div>`;
}
function addUnivDateRow(){
  document.getElementById('ueDateRows').insertAdjacentHTML('beforeend', univDateRowHtml(''));
}
function setUnivMode(mode){
  univModalMode = mode;
  document.getElementById('ueModeRangeBtn').classList.toggle('active', mode==='range');
  document.getElementById('ueModeMultiBtn').classList.toggle('active', mode==='multiple');
  document.getElementById('ueRangeFields').classList.toggle('d-none', mode!=='range');
  document.getElementById('ueMultiFields').classList.toggle('d-none', mode!=='multiple');
}
function selectUnivColor(c){
  univModalColor = c;
  document.querySelectorAll('[data-color-swatch]').forEach(el=>{
    el.style.border = `2px solid ${el.dataset.colorSwatch===c?'#fff':'transparent'}`;
  });
}
function collectUnivDates(){
  if(univModalMode==='range'){
    const start = document.getElementById('ueRangeStart').value;
    const end = document.getElementById('ueRangeEnd').value;
    if(!start || !end) return [];
    const dates = [];
    let d = new Date(start+'T00:00');
    const endD = new Date(end+'T00:00');
    if(d > endD) return [];
    while(d <= endD){
      dates.push(ymdLocal(d));
      d.setDate(d.getDate()+1);
    }
    return dates;
  } else {
    const inputs = document.querySelectorAll('#ueDateRows input[type="date"]');
    const dates = [];
    inputs.forEach(i=>{ if(i.value) dates.push(i.value); });
    return [...new Set(dates)].sort();
  }
}
function saveUnivEvent(){
  const title = document.getElementById('ueTitle').value.trim();
  if(!title){ Toast.show('Please enter a title','high','bi-exclamation-triangle'); return; }
  const dates = collectUnivDates();
  if(!dates.length){ Toast.show('Please add at least one valid date','high','bi-exclamation-triangle'); return; }
  const note = document.getElementById('ueNote').value.trim();
  const events = DB.getUniversityEvents();
  if(univEditingId){
    const ev = events.find(e=>e.id===univEditingId);
    if(ev){ ev.title=title; ev.note=note; ev.dates=dates; ev.color=univModalColor; }
  } else {
    events.push({ id:DB.uid(), title, note, dates, color:univModalColor, createdAt:Date.now() });
  }
  DB.saveUniversityEvents(events);
  bootstrap.Modal.getInstance(document.getElementById('univEventModal')).hide();
  Toast.show('University event saved');
  renderUnivCalendar();
}
function deleteUnivEvent(id){
  const events = DB.getUniversityEvents().filter(e=>e.id!==id);
  DB.saveUniversityEvents(events);
  const modalEl = document.getElementById('univEventModal');
  const inst = bootstrap.Modal.getInstance(modalEl);
  if(inst) inst.hide();
  Toast.show('University event deleted');
  renderUnivCalendar();
}
function isContiguousRange(dates){
  const sorted = dates.slice().sort();
  for(let i=1;i<sorted.length;i++){
    const prev = new Date(sorted[i-1]+'T00:00');
    const cur = new Date(sorted[i]+'T00:00');
    if((cur-prev)/86400000 !== 1) return false;
  }
  return true;
}
function formatUnivDates(dates){
  const sorted = dates.slice().sort();
  const ranges = [];
  let rangeStart = sorted[0], prev = sorted[0];
  for(let i=1;i<=sorted.length;i++){
    const cur = sorted[i];
    const prevD = new Date(prev+'T00:00');
    const curD = cur ? new Date(cur+'T00:00') : null;
    if(curD && (curD-prevD)/86400000===1){ prev = cur; continue; }
    ranges.push([rangeStart, prev]);
    if(cur){ rangeStart = cur; prev = cur; }
  }
  return ranges.map(([s,e])=>{
    const sd = new Date(s+'T00:00'), ed = new Date(e+'T00:00');
    if(s===e) return sd.toLocaleDateString([], {month:'short', day:'numeric', year:'numeric'});
    if(sd.getMonth()===ed.getMonth() && sd.getFullYear()===ed.getFullYear()){
      return `${sd.toLocaleDateString([], {month:'short'})} ${sd.getDate()}–${ed.getDate()}, ${ed.getFullYear()}`;
    }
    return `${sd.toLocaleDateString([], {month:'short', day:'numeric'})} – ${ed.toLocaleDateString([], {month:'short', day:'numeric', year:'numeric'})}`;
  }).join(', ');
}
