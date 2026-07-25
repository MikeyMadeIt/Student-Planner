/* ============================================================
   STORAGE.JS — localStorage data layer
   Every module reads/writes through DB.* so the storage shape
   lives in exactly one place.
   ============================================================ */

const DB_KEYS = {
  subjects: 'sp_subjects',
  tasks: 'sp_tasks',
  notes: 'sp_notes',
  attendance: 'sp_attendance',
  grades: 'sp_grades',
  habits: 'sp_habits',
  settings: 'sp_settings',
  semester: 'sp_semester',
  pomodoro: 'sp_pomodoro_stats',
};

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

function readKey(key, fallback){
  try{
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  }catch(e){ console.warn('DB read failed', key, e); return fallback; }
}
function writeKey(key, value){
  try{ localStorage.setItem(key, JSON.stringify(value)); return true; }
  catch(e){ console.warn('DB write failed', key, e); return false; }
}

const DEFAULT_SETTINGS = {
  name:'Student', studentNumber:'', course:'', yearLevel:'', section:'', school:'',
  theme:'dark', accent:'violet',
  notifications:{ upcomingClass:true, assignmentDue:true, examReminder:true, pomodoroFinished:true, dailyReview:false },
};

const DEFAULT_SEMESTER = {
  name:'1st Semester', schoolYear:'2026-2027',
  startDate: new Date().toISOString().slice(0,10),
  endDate: new Date(Date.now()+ 1000*60*60*24*105).toISOString().slice(0,10), // ~15 weeks
  finalsDate: new Date(Date.now()+ 1000*60*60*24*100).toISOString().slice(0,10),
  totalWeeks:15,
};

const SUBJECT_COLORS = ['#7C6CF6','#4F8CFF','#34D399','#FB7185','#FBBF24','#F472B6','#22D3EE','#A78BFA'];

function seedIfEmpty(){
  if(localStorage.getItem('sp_seeded')) return;

  const subjects = [
    { id: uid(), code:'CS101', desc:'Introduction to Computing', type:'Lecture', units:3, section:'BSCS-1A',
      days:['Mon','Wed'], start:'08:00', end:'09:30', room:'204', building:'IT Building',
      professor:'Dr. A. Reyes', email:'reyes@school.edu', color:SUBJECT_COLORS[0], notes:'Bring laptop',
      semester:'1st Semester', schoolYear:'2026-2027', archived:false },
    { id: uid(), code:'MATH104', desc:'Calculus II', type:'Lecture', units:4, section:'BSCS-1A',
      days:['Tue','Thu'], start:'10:00', end:'11:30', room:'110', building:'Main Hall',
      professor:'Prof. L. Santos', email:'santos@school.edu', color:SUBJECT_COLORS[1], notes:'',
      semester:'1st Semester', schoolYear:'2026-2027', archived:false },
    { id: uid(), code:'ENG102', desc:'Communication Arts', type:'Lecture', units:3, section:'BSCS-1A',
      days:['Mon','Wed','Fri'], start:'13:00', end:'14:00', room:'302', building:'Liberal Arts',
      professor:'Ms. K. Cruz', email:'cruz@school.edu', color:SUBJECT_COLORS[2], notes:'',
      semester:'1st Semester', schoolYear:'2026-2027', archived:false },
    { id: uid(), code:'CS102L', desc:'Programming Laboratory', type:'Laboratory', units:1, section:'BSCS-1A',
      days:['Fri'], start:'15:00', end:'18:00', room:'Lab 2', building:'IT Building',
      professor:'Dr. A. Reyes', email:'reyes@school.edu', color:SUBJECT_COLORS[3], notes:'Weekly submission',
      semester:'1st Semester', schoolYear:'2026-2027', archived:false },
  ];
  writeKey(DB_KEYS.subjects, subjects);

  const today = new Date();
  const inDays = (n)=>{ const d=new Date(today); d.setDate(d.getDate()+n); return d.toISOString().slice(0,10); };

  const tasks = [
    { id: uid(), title:'Problem Set 3', description:'Derivatives and limits, items 1-20', subjectId:subjects[1].id,
      priority:'high', category:'Homework', dueDate:inDays(1), dueTime:'23:59', status:'in-progress', progress:40,
      reminder:true, checklist:[{text:'Read chapter 4', done:true},{text:'Solve items 1-10', done:true},{text:'Solve items 11-20', done:false}],
      repeat:'none', score:null, remarks:'', createdAt:Date.now() },
    { id: uid(), title:'System Analysis Report', description:'Group report on requirements gathering', subjectId:subjects[0].id,
      priority:'medium', category:'Project', dueDate:inDays(4), dueTime:'17:00', status:'not-started', progress:10,
      reminder:true, checklist:[], repeat:'none', score:null, remarks:'', createdAt:Date.now() },
    { id: uid(), title:'Quiz 2 - Grammar', description:'Coverage: parts of speech, sentence structure', subjectId:subjects[2].id,
      priority:'medium', category:'Quiz', dueDate:inDays(2), dueTime:'13:00', status:'not-started', progress:0,
      reminder:true, checklist:[], repeat:'none', score:null, remarks:'', createdAt:Date.now() },
    { id: uid(), title:'Midterm Examination', description:'Coverage: chapters 1-5, comprehensive', subjectId:subjects[0].id,
      priority:'high', category:'Exam', dueDate:inDays(9), dueTime:'08:00', status:'not-started', progress:0,
      reminder:true, checklist:[], repeat:'none', score:null, remarks:'', createdAt:Date.now() },
    { id: uid(), title:'Clean my room', description:'', subjectId:null,
      priority:'low', category:'Personal', dueDate:inDays(0), dueTime:'20:00', status:'completed', progress:100,
      reminder:false, checklist:[], repeat:'none', score:null, remarks:'', createdAt:Date.now() },
  ];
  writeKey(DB_KEYS.tasks, tasks);

  const notes = [
    { id: uid(), title:'Welcome to your planner 👋', content:'This is your notes space. You can **bold**, make lists, add `code`, and organize by category.\n\n- Pin important notes\n- Star your favorites\n- Search anytime', category:'Organization', pinned:true, favorite:true, checklist:[], createdAt:Date.now(), updatedAt:Date.now() },
  ];
  writeKey(DB_KEYS.notes, notes);

  const attendance = [];
  writeKey(DB_KEYS.attendance, attendance);

  const grades = subjects.map(s=>({ subjectId:s.id, quiz:[], activity:[], lab:[], project:[], midterm:null, finals:null }));
  writeKey(DB_KEYS.grades, grades);

  const habits = [
    { id: uid(), name:'Drink Water', icon:'bi-cup-straw', color:'#4F8CFF', log:{} },
    { id: uid(), name:'Study 1 Hour', icon:'bi-book', color:'#7C6CF6', log:{} },
    { id: uid(), name:'Exercise', icon:'bi-heart-pulse', color:'#FB7185', log:{} },
    { id: uid(), name:'Sleep Early', icon:'bi-moon-stars', color:'#A78BFA', log:{} },
  ];
  writeKey(DB_KEYS.habits, habits);

  writeKey(DB_KEYS.settings, DEFAULT_SETTINGS);
  writeKey(DB_KEYS.semester, DEFAULT_SEMESTER);
  writeKey(DB_KEYS.pomodoro, { sessionsToday:0, totalFocusMinutes:0, lastDate:new Date().toDateString(), history:[] });

  localStorage.setItem('sp_seeded','1');
}

const DB = {
  init: seedIfEmpty,
  uid,
  colors: SUBJECT_COLORS,

  // generic
  get(key, fallback){ return readKey(DB_KEYS[key], fallback); },
  set(key, value){ return writeKey(DB_KEYS[key], value); },

  // subjects
  getSubjects(){ return readKey(DB_KEYS.subjects, []); },
  saveSubjects(list){ return writeKey(DB_KEYS.subjects, list); },
  getSubject(id){ return this.getSubjects().find(s=>s.id===id); },

  // tasks
  getTasks(){ return readKey(DB_KEYS.tasks, []); },
  saveTasks(list){ return writeKey(DB_KEYS.tasks, list); },

  // notes
  getNotes(){ return readKey(DB_KEYS.notes, []); },
  saveNotes(list){ return writeKey(DB_KEYS.notes, list); },

  // attendance
  getAttendance(){ return readKey(DB_KEYS.attendance, []); },
  saveAttendance(list){ return writeKey(DB_KEYS.attendance, list); },

  // grades
  getGrades(){ return readKey(DB_KEYS.grades, []); },
  saveGrades(list){ return writeKey(DB_KEYS.grades, list); },

  // habits
  getHabits(){ return readKey(DB_KEYS.habits, []); },
  saveHabits(list){ return writeKey(DB_KEYS.habits, list); },

  // settings
  getSettings(){ return readKey(DB_KEYS.settings, DEFAULT_SETTINGS); },
  saveSettings(s){ return writeKey(DB_KEYS.settings, s); },

  // semester
  getSemester(){ return readKey(DB_KEYS.semester, DEFAULT_SEMESTER); },
  saveSemester(s){ return writeKey(DB_KEYS.semester, s); },

  // pomodoro
  getPomo(){ return readKey(DB_KEYS.pomodoro, { sessionsToday:0, totalFocusMinutes:0, lastDate:new Date().toDateString(), history:[] }); },
  savePomo(p){ return writeKey(DB_KEYS.pomodoro, p); },

  exportAll(){
    const out = {};
    Object.entries(DB_KEYS).forEach(([k,v])=>{ out[k] = readKey(v, null); });
    out._exportedAt = new Date().toISOString();
    return out;
  },
  importAll(obj){
    Object.entries(DB_KEYS).forEach(([k,v])=>{
      if(obj[k] !== undefined) writeKey(v, obj[k]);
    });
    return true;
  },
  resetAll(){
    Object.values(DB_KEYS).forEach(k=>localStorage.removeItem(k));
    localStorage.removeItem('sp_seeded');
    seedIfEmpty();
  }
};

DB.init();
