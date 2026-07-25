/* ============================================================
   ATTENDANCE.JS
   ============================================================ */

function initAttendance(){
  const subs = DB.getSubjects().filter(s=>!s.archived);
  document.getElementById('attSubject').innerHTML = subs.map(s=>`<option value="${s.id}">${s.code}</option>`).join('');
  document.getElementById('attDate').value = todayKey();
  renderAttendanceAll();
}

function logAttendance(){
  const subjectId = document.getElementById('attSubject').value;
  const date = document.getElementById('attDate').value;
  const status = document.getElementById('attStatus').value;
  if(!subjectId || !date){ Toast.show('Select subject and date','high','bi-exclamation-triangle'); return; }
  const records = DB.getAttendance();
  const existing = records.find(r=>r.subjectId===subjectId && r.date===date);
  if(existing){ existing.status = status; }
  else records.push({ id:DB.uid(), subjectId, date, status });
  DB.saveAttendance(records);
  Toast.show('Attendance logged');
  renderAttendanceAll();
}

function renderAttendanceAll(){
  renderOverallRate();
  renderRanking();
  renderLog();
}

function renderOverallRate(){
  const records = DB.getAttendance();
  const rate = records.length ? Math.round(records.filter(r=>r.status==='Present'||r.status==='Excused').length/records.length*100) : null;
  document.getElementById('aRate').textContent = rate===null ? '--%' : rate+'%';
  document.getElementById('aRateBar').style.width = (rate||0)+'%';
}

function renderRanking(){
  const subs = DB.getSubjects().filter(s=>!s.archived);
  const records = DB.getAttendance();
  const ranked = subs.map(s=>{
    const recs = records.filter(r=>r.subjectId===s.id);
    const rate = recs.length ? Math.round(recs.filter(r=>r.status==='Present'||r.status==='Excused').length/recs.length*100) : null;
    return { s, rate, count:recs.length };
  }).filter(r=>r.rate!==null).sort((a,b)=>b.rate-a.rate);
  const wrap = document.getElementById('subjectRanking');
  if(!ranked.length){ wrap.innerHTML = `<div class="text-faint text-center py-3" style="font-size:.82rem">Log attendance to see ranking</div>`; return; }
  wrap.innerHTML = ranked.map((r,i)=>`
    <div class="list-row">
      <span class="chip">#${i+1}</span>
      <span class="dot-color" style="background:${r.s.color}"></span>
      <div class="flex-grow-1"><b>${r.s.code}</b> <span class="text-faint" style="font-size:.75rem">${r.count} records</span></div>
      <div style="width:100px"><div class="progress" style="height:7px"><div class="progress-bar" style="width:${r.rate}%"></div></div></div>
      <span class="mono" style="font-size:.8rem;width:40px;text-align:right">${r.rate}%</span>
    </div>`).join('');
}

function renderLog(){
  const subs = DB.getSubjects();
  const records = [...DB.getAttendance()].sort((a,b)=>b.date.localeCompare(a.date));
  const wrap = document.getElementById('attendanceLog');
  if(!records.length){ wrap.innerHTML = `<div class="text-faint text-center py-4">No attendance logged yet</div>`; return; }
  const statusChip = { Present:'low', Late:'medium', Absent:'high', Excused:'' };
  wrap.innerHTML = records.map(r=>{
    const s = subs.find(x=>x.id===r.subjectId);
    return `<div class="list-row">
      <span class="dot-color" style="background:${s?s.color:'#888'}"></span>
      <div class="flex-grow-1"><b>${s?s.code:'Unknown'}</b> <span class="text-faint" style="font-size:.75rem">${r.date}</span></div>
      <span class="chip ${statusChip[r.status]||''}">${r.status}</span>
      <button class="btn-icon" style="width:28px;height:28px" onclick="deleteAttendance('${r.id}')"><i class="bi bi-trash" style="font-size:.75rem"></i></button>
    </div>`;
  }).join('');
}
function deleteAttendance(id){
  confirmAction({
    title:'Remove attendance record?',
    message:'This log entry will be permanently removed.',
    confirmLabel:'Remove', danger:true, icon:'bi-trash-fill',
    onConfirm(){
      DB.saveAttendance(DB.getAttendance().filter(r=>r.id!==id));
      Toast.show('Record removed');
      renderAttendanceAll();
    }
  });
}
