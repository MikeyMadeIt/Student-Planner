/* ============================================================
   CALENDAR.JS
   ============================================================ */

let calMode = 'month';
let calDate = new Date();

const CATEGORY_COLORS = { Homework:'#FBBF24', Project:'#4F8CFF', Quiz:'#22D3EE', Exam:'#FB7185', Personal:'#34D399', Organization:'#A78BFA' };

function initCalendar(){ renderCalendar(); }

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

  let html = `<div class="cal-grid mb-1">${DAY_NAMES.map(d=>`<div class="text-center text-faint" style="font-size:.72rem;font-weight:700">${d}</div>`).join('')}</div><div class="cal-grid">`;
  const totalCells = Math.ceil((startOffset+daysInMonth)/7)*7;
  for(let i=0;i<totalCells;i++){
    let dayNum, monthOffset=0, other=false;
    if(i < startOffset){ dayNum = daysInPrevMonth-startOffset+i+1; monthOffset=-1; other=true; }
    else if(i >= startOffset+daysInMonth){ dayNum = i-startOffset-daysInMonth+1; monthOffset=1; other=true; }
    else dayNum = i-startOffset+1;
    const d = new Date(y, m+monthOffset, dayNum);
    const dateStr = d.toISOString().slice(0,10);
    const isToday = dateStr === todayKey();
    const evts = eventsForDate(dateStr);
    html += `<div class="cal-cell ${isToday?'today':''} ${other?'other-month':''}" style="cursor:pointer" onclick="openDayModal('${dateStr}')">
      <div class="cal-daynum">${dayNum}</div>
      ${evts.slice(0,3).map(e=>`<div class="cal-evt" style="background:${e.color}">${escapeHtml(e.title)}</div>`).join('')}
      ${evts.length>3?`<div class="text-faint" style="font-size:.6rem">+${evts.length-3} more</div>`:''}
    </div>`;
  }
  html += `</div>`;
  return html;
}

function weekHtml(){
  const start = new Date(calDate); start.setDate(calDate.getDate()-calDate.getDay());
  const end = new Date(start); end.setDate(start.getDate()+6);
  document.getElementById('calTitle').textContent = `${start.toLocaleDateString([], {month:'short', day:'numeric'})} – ${end.toLocaleDateString([], {month:'short', day:'numeric', year:'numeric'})}`;
  let html = `<div style="display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px">`;
  for(let i=0;i<7;i++){
    const d = new Date(start); d.setDate(start.getDate()+i);
    const dateStr = d.toISOString().slice(0,10);
    const isToday = dateStr===todayKey();
    const evts = eventsForDate(dateStr);
    html += `<div style="min-width:0;overflow:hidden;background:var(--surface-2);border:1px solid ${isToday?'rgba(var(--accent),.5)':'var(--border)'};border-radius:14px;padding:8px 6px;min-height:200px;cursor:pointer" onclick="openDayModal('${dateStr}')">
        <div class="text-center mb-2"><div class="text-faint" style="font-size:.64rem">${DAY_NAMES[d.getDay()]}</div><div class="fw-bold mono" style="font-size:.85rem">${d.getDate()}</div></div>
        ${evts.map(e=>`<div class="cal-evt mb-1" style="background:${e.color};white-space:normal;word-break:break-word">${fmtTime(e.time)} ${escapeHtml(e.title)}</div>`).join('')}
      </div>`;
  }
  html += `</div>`;
  return html;
}

function dayHtml(){
  const dateStr = calDate.toISOString().slice(0,10);
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
