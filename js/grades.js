/* ============================================================
   GRADES.JS
   ============================================================ */

function initGrades(){
  syncGradesWithSubjects();
  renderGradesOverview();
  renderGradeCards();
}

// make sure every non-archived subject has a grades record
function syncGradesWithSubjects(){
  const subs = DB.getSubjects().filter(s=>!s.archived);
  let grades = DB.getGrades();
  subs.forEach(s=>{
    if(!grades.find(g=>g.subjectId===s.id)){
      grades.push({ subjectId:s.id, quiz:[], activity:[], lab:[], project:[], midterm:null, finals:null });
    }
  });
  DB.saveGrades(grades);
}

function avgArr(arr){ return arr && arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : null; }

function renderGradeCards(){
  const wrap = document.getElementById('gradesWrap');
  const subs = DB.getSubjects().filter(s=>!s.archived);
  const grades = DB.getGrades();
  if(!subs.length){ wrap.innerHTML = `<div class="col-12"><div class="glass card-pad text-center py-5 text-faint">Add subjects in Schedule to start tracking grades.</div></div>`; return; }

  wrap.innerHTML = subs.map(s=>{
    const g = grades.find(x=>x.subjectId===s.id) || {quiz:[],activity:[],lab:[],project:[]};
    const avg = computeSubjAvg(g);
    return `<div class="col-md-6 col-xl-4">
      <div class="glass card-pad hover-lift h-100" style="border-left:4px solid ${s.color}">
        <div class="d-flex justify-content-between align-items-start">
          <div><div class="fw-bold">${s.code}</div><div class="text-faint" style="font-size:.78rem">${escapeHtml(s.desc)}</div></div>
          <button class="btn-ghost btn btn-sm" onclick="openGradeModal('${s.id}')"><i class="bi bi-pencil"></i></button>
        </div>
        <div class="d-flex justify-content-between align-items-end mt-3">
          <div>
            <div class="stat-num">${avg===null?'--':avg.toFixed(1)+'%'}</div>
            <div class="text-faint" style="font-size:.72rem">Overall average</div>
          </div>
          <span class="chip">${avg===null?'--':percentTo4ptG(avg).toFixed(1)+' GP'}</span>
        </div>
        <div class="progress mt-2"><div class="progress-bar" style="width:${avg||0}%"></div></div>
        <div class="row text-center mt-3" style="font-size:.7rem">
          <div class="col"><div class="text-faint">Quiz</div><b>${fmtAvg(avgArr(g.quiz))}</b></div>
          <div class="col"><div class="text-faint">Activity</div><b>${fmtAvg(avgArr(g.activity))}</b></div>
          <div class="col"><div class="text-faint">Lab</div><b>${fmtAvg(avgArr(g.lab))}</b></div>
          <div class="col"><div class="text-faint">Project</div><b>${fmtAvg(avgArr(g.project))}</b></div>
          <div class="col"><div class="text-faint">Midterm</div><b>${fmtAvg(g.midterm)}</b></div>
          <div class="col"><div class="text-faint">Finals</div><b>${fmtAvg(g.finals)}</b></div>
        </div>
      </div>
    </div>`;
  }).join('');
}
function fmtAvg(v){ return v===null || v===undefined || isNaN(v) ? '--' : Math.round(v); }
function computeSubjAvg(g){
  const parts = [avgArr(g.quiz), avgArr(g.activity), avgArr(g.lab), avgArr(g.project), g.midterm, g.finals]
    .filter(v=>v!==null && v!==undefined && !isNaN(v));
  return parts.length ? parts.reduce((a,b)=>a+b,0)/parts.length : null;
}
function percentTo4ptG(pct){
  if(pct>=97) return 4.0; if(pct>=93) return 3.7; if(pct>=90) return 3.3;
  if(pct>=87) return 3.0; if(pct>=83) return 2.7; if(pct>=80) return 2.3;
  if(pct>=77) return 2.0; if(pct>=73) return 1.7; if(pct>=70) return 1.3;
  if(pct>=60) return 1.0; return 0;
}

function renderGradesOverview(){
  const subs = DB.getSubjects().filter(s=>!s.archived);
  const grades = DB.getGrades();
  let totalPoints=0, totalUnits=0;
  let ranked = [];
  subs.forEach(s=>{
    const g = grades.find(x=>x.subjectId===s.id); if(!g) return;
    const avg = computeSubjAvg(g);
    if(avg!==null){ totalPoints += percentTo4ptG(avg)*s.units; totalUnits += s.units; ranked.push({s, avg}); }
  });
  const gpa = totalUnits ? totalPoints/totalUnits : null;
  document.getElementById('gGpa').textContent = gpa===null ? '--' : gpa.toFixed(2);
  const standing = gpa===null ? '--' : gpa>=3.5?"Dean's List": gpa>=3.0?'Very Good': gpa>=2.0?'Good':'Needs Improvement';
  document.getElementById('gStanding').textContent = standing;
  document.getElementById('gStandingSub').textContent = gpa===null ? 'Add scores to see standing' : `Based on ${ranked.length} subject(s)`;
  ranked.sort((a,b)=>b.avg-a.avg);
  if(ranked.length){
    document.getElementById('gTop').textContent = ranked[0].s.code;
    document.getElementById('gTopSub').textContent = `${ranked[0].avg.toFixed(1)}% average`;
  }
}

function openGradeModal(subjectId){
  const s = DB.getSubject(subjectId);
  const grades = DB.getGrades();
  const g = grades.find(x=>x.subjectId===subjectId);
  document.querySelector('#gradeModal .modal-title').textContent = `${s.code} — Scores`;
  document.getElementById('gradeModalBody').innerHTML = `
    <input type="hidden" id="gmSubjectId" value="${subjectId}">
    ${scoreListEditor('Quiz Scores','quiz', g.quiz)}
    ${scoreListEditor('Activity Scores','activity', g.activity)}
    ${scoreListEditor('Laboratory Scores','lab', g.lab)}
    ${scoreListEditor('Project Scores','project', g.project)}
    <div class="row g-2 mt-2">
      <div class="col-6"><label>Midterm (%)</label><input type="number" min="0" max="100" class="form-control" id="gmMidterm" value="${g.midterm ?? ''}"></div>
      <div class="col-6"><label>Finals (%)</label><input type="number" min="0" max="100" class="form-control" id="gmFinals" value="${g.finals ?? ''}"></div>
    </div>
    <button class="btn btn-accent w-100 mt-3" onclick="saveGrades()"><i class="bi bi-check2 me-1"></i>Save Scores</button>`;
  new bootstrap.Modal(document.getElementById('gradeModal')).show();
}
function scoreListEditor(label, key, arr){
  return `<div class="mb-3">
    <label>${label}</label>
    <div id="gm_${key}">${(arr||[]).map((v,i)=>scoreRow(key,i,v)).join('')}</div>
    <button type="button" class="btn btn-ghost btn-sm mt-1" onclick="addScoreRow('${key}')"><i class="bi bi-plus"></i> Add score</button>
  </div>`;
}
function scoreRow(key,i,v){
  return `<div class="d-flex gap-2 mb-1 score-row" data-key="${key}"><input type="number" min="0" max="100" class="form-control form-control-sm" value="${v}" placeholder="%"><button type="button" class="btn-icon" style="width:28px;height:28px" onclick="this.parentElement.remove()"><i class="bi bi-x" style="font-size:.8rem"></i></button></div>`;
}
function addScoreRow(key){
  document.getElementById('gm_'+key).insertAdjacentHTML('beforeend', scoreRow(key,0,''));
}
function saveGrades(){
  const subjectId = document.getElementById('gmSubjectId').value;
  const grades = DB.getGrades();
  const idx = grades.findIndex(g=>g.subjectId===subjectId);
  const readArr = (key)=> [...document.querySelectorAll(`.score-row[data-key="${key}"] input`)].map(i=>parseFloat(i.value)).filter(v=>!isNaN(v));
  const updated = {
    subjectId,
    quiz: readArr('quiz'), activity: readArr('activity'), lab: readArr('lab'), project: readArr('project'),
    midterm: document.getElementById('gmMidterm').value !== '' ? parseFloat(document.getElementById('gmMidterm').value) : null,
    finals: document.getElementById('gmFinals').value !== '' ? parseFloat(document.getElementById('gmFinals').value) : null,
  };
  if(idx>-1) grades[idx] = updated; else grades.push(updated);
  DB.saveGrades(grades);
  bootstrap.Modal.getInstance(document.getElementById('gradeModal')).hide();
  Toast.show('Scores saved');
  renderGradesOverview(); renderGradeCards();
}
function escapeHtml(s){ const d=document.createElement('div'); d.textContent=s||''; return d.innerHTML; }
