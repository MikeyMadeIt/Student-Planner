/* ============================================================
   SETTINGS.JS
   ============================================================ */

function initSettings(){
  const s = DB.getSettings();
  document.getElementById('sName').value = s.name||'';
  document.getElementById('sNumber').value = s.studentNumber||'';
  document.getElementById('sCourse').value = s.course||'';
  document.getElementById('sYear').value = s.yearLevel||'';
  document.getElementById('sSection').value = s.section||'';
  document.getElementById('sSchool').value = s.school||'';

  const sem = DB.getSemester();
  document.getElementById('semName').value = sem.name;
  document.getElementById('semYear').value = sem.schoolYear;
  document.getElementById('semStart').value = sem.startDate;
  document.getElementById('semEnd').value = sem.endDate;
  document.getElementById('semFinals').value = sem.finalsDate;
  document.getElementById('semWeeks').value = sem.totalWeeks;

  highlightTheme(s.theme);
  renderAccentPicker(s.accent);
  renderNotifToggles(s.notifications);
}

function saveProfile(){
  const s = DB.getSettings();
  s.name = document.getElementById('sName').value.trim();
  s.studentNumber = document.getElementById('sNumber').value.trim();
  s.course = document.getElementById('sCourse').value.trim();
  s.yearLevel = document.getElementById('sYear').value.trim();
  s.section = document.getElementById('sSection').value.trim();
  s.school = document.getElementById('sSchool').value.trim();
  DB.saveSettings(s);
  Toast.show('Profile saved');
}

function saveSemesterSettings(){
  const sem = {
    name: document.getElementById('semName').value.trim(),
    schoolYear: document.getElementById('semYear').value.trim(),
    startDate: document.getElementById('semStart').value,
    endDate: document.getElementById('semEnd').value,
    finalsDate: document.getElementById('semFinals').value,
    totalWeeks: parseInt(document.getElementById('semWeeks').value)||15,
  };
  DB.saveSemester(sem);
  Toast.show('Semester updated');
}

function chooseTheme(theme){ setTheme(theme); highlightTheme(theme); }
function highlightTheme(theme){
  ['dark','light','amoled'].forEach(t=> document.getElementById('theme_'+t).classList.toggle('btn-accent', t===theme));
}
function renderAccentPicker(current){
  const accents = { violet:'#7C6CF6', blue:'#3B82F6', emerald:'#34D399', rose:'#FB7185', amber:'#FBBF24' };
  const wrap = document.getElementById('accentPicker');
  wrap.innerHTML = Object.entries(accents).map(([k,c])=>`
    <div onclick="chooseAccent('${k}')" data-accent-swatch="${k}" style="width:38px;height:38px;border-radius:12px;background:${c};cursor:pointer;box-shadow:${k===current?'0 0 0 3px rgba(255,255,255,.5)':'none'}"></div>`).join('');
}
function chooseAccent(a){
  setAccent(a);
  document.querySelectorAll('[data-accent-swatch]').forEach(el=> el.style.boxShadow = el.dataset.accentSwatch===a ? '0 0 0 3px rgba(255,255,255,.5)' : 'none');
}

function renderNotifToggles(n){
  const labels = { upcomingClass:'Upcoming Class', assignmentDue:'Assignment Due', examReminder:'Exam Reminder', pomodoroFinished:'Pomodoro Finished', dailyReview:'Daily Review Reminder' };
  document.getElementById('notifToggles').innerHTML = Object.entries(labels).map(([k,label])=>`
    <div class="form-check form-switch mb-2">
      <input class="form-check-input" type="checkbox" role="switch" id="notif_${k}" ${n[k]?'checked':''} onchange="updateNotifSetting('${k}', this.checked)">
      <label class="form-check-label">${label}</label>
    </div>`).join('');
}
function updateNotifSetting(key, val){
  const s = DB.getSettings();
  s.notifications[key] = val;
  DB.saveSettings(s);
}
function requestNotifPermission(){
  if(!('Notification' in window)){ Toast.show('Notifications not supported in this browser','high','bi-exclamation-triangle'); return; }
  Notification.requestPermission().then(p=>{
    Toast.show(p==='granted' ? 'Notifications enabled' : 'Permission not granted');
  });
}

function exportData(){
  const data = DB.exportAll();
  const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `student-planner-backup-${todayKey()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  Toast.show('Data exported');
}
function importData(file){
  if(!file) return;
  const reader = new FileReader();
  reader.onload = (e)=>{
    let data;
    try{ data = JSON.parse(e.target.result); }
    catch(err){ Toast.show('Invalid file — could not read backup','high','bi-exclamation-triangle'); return; }
    confirmAction({
      title:'Import this backup?',
      message:'This will overwrite your current subjects, tasks, notes, grades, and settings with the data from this file.',
      confirmLabel:'Import & Overwrite', danger:true, icon:'bi-upload',
      onConfirm(){
        DB.importAll(data);
        Toast.show('Data imported — reloading…');
        setTimeout(()=>location.reload(), 900);
      }
    });
  };
  reader.readAsText(file);
  document.getElementById('importFile').value = '';
}
function confirmReset(){
  confirmAction({
    title:'Reset all data?',
    message:'This permanently erases ALL your data — subjects, tasks, notes, grades, attendance, university calendar events, course syllabi — and restores the sample starter data. This cannot be undone.',
    confirmLabel:'Erase Everything', danger:true, icon:'bi-exclamation-octagon-fill',
    onConfirm(){
      DB.resetAll();
      Toast.show('Data reset');
      setTimeout(()=>location.reload(), 800);
    }
  });
}
window.exportData = exportData;
