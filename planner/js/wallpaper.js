/* ============================================================
   WALLPAPER.JS — canvas-based schedule wallpaper generator
   ============================================================ */

const WP_THEMES = {
  minimal:      { bg:['#f5f6fa','#eceff5'], text:'#1c2030', sub:'#6a7086', accent:'#7C6CF6', card:'rgba(20,25,45,.05)', line:'rgba(20,25,45,.08)' },
  dark:         { bg:['#12141d','#0a0c13'], text:'#f2f3fa', sub:'#9aa0b8', accent:'#7C6CF6', card:'rgba(255,255,255,.06)', line:'rgba(255,255,255,.1)' },
  glass:        { bg:['#2b2450','#151233'], text:'#ffffff', sub:'#c9c4e8', accent:'#a78bfa', card:'rgba(255,255,255,.1)', line:'rgba(255,255,255,.18)' },
  gradient:     { bg:['#7C6CF6','#4F8CFF'], text:'#ffffff', sub:'#eef0ff', accent:'#ffffff', card:'rgba(255,255,255,.14)', line:'rgba(255,255,255,.25)' },
  neon:         { bg:['#0b0c1e','#03030a'], text:'#eafcff', sub:'#7cf5e0', accent:'#39ffea', card:'rgba(57,255,234,.08)', line:'rgba(57,255,234,.35)' },
  cyberpunk:    { bg:['#1a0b2e','#0d0416'], text:'#fef08a', sub:'#f472b6', accent:'#f472b6', card:'rgba(244,114,182,.1)', line:'rgba(244,114,182,.4)' },
  pastel:       { bg:['#ffe8f0','#e8f0ff'], text:'#3a3355', sub:'#7a7398', accent:'#c084fc', card:'rgba(60,50,90,.06)', line:'rgba(60,50,90,.1)' },
  amoled:       { bg:['#000000','#000000'], text:'#ffffff', sub:'#8a8fa3', accent:'#7C6CF6', card:'rgba(255,255,255,.05)', line:'rgba(255,255,255,.12)' },
};
let wpTheme = 'dark';
let wpToggleState = { day:true, classes:true, next:true, tasks:true, countdown:true, quote:true, calendar:true, name:true, semester:true, logo:false, qr:false };

function initWallpaper(){
  const themeGrid = document.getElementById('themePicker');
  themeGrid.innerHTML = Object.keys(WP_THEMES).map(k=>{
    const t = WP_THEMES[k];
    return `<div class="col">
      <div onclick="selectWpTheme('${k}')" data-theme-swatch="${k}" style="height:44px;border-radius:10px;cursor:pointer;background:linear-gradient(135deg,${t.bg[0]},${t.bg[1]});border:2px solid ${k===wpTheme?'rgb(var(--accent))':'transparent'}"></div>
      <div class="text-center text-faint" style="font-size:.62rem;margin-top:3px;text-transform:capitalize">${k}</div>
    </div>`;
  }).join('');

  const toggles = document.getElementById('wpToggles');
  const labels = { day:'Current Day', classes:"Today's Classes", next:'Next Class', tasks:'Tasks', countdown:'Countdown', quote:'Motivational Quote', calendar:'Minimal Calendar', name:'Student Name', semester:'Semester', logo:'School Logo Placeholder', qr:'QR Code Placeholder' };
  toggles.innerHTML = Object.entries(labels).map(([k,label])=>`
    <div class="form-check">
      <input class="form-check-input" type="checkbox" id="wpT_${k}" ${wpToggleState[k]?'checked':''} onchange="wpToggleState['${k}']=this.checked">
      <label class="form-check-label">${label}</label>
    </div>`).join('');

  document.getElementById('wpSize').addEventListener('change', (e)=>{
    document.getElementById('customSizeRow').classList.toggle('d-none', e.target.value!=='custom');
  });

  generateWallpaper();
}
function selectWpTheme(k){
  wpTheme = k;
  document.querySelectorAll('[data-theme-swatch]').forEach(el=> el.style.border = `2px solid ${el.dataset.themeSwatch===k?'rgb(var(--accent))':'transparent'}`);
  generateWallpaper();
}

function getWpSize(){
  const sel = document.getElementById('wpSize').value;
  if(sel==='custom') return [parseInt(document.getElementById('wpW').value)||1080, parseInt(document.getElementById('wpH').value)||2400];
  const [w,h] = sel.split('x').map(Number);
  return [w,h];
}

function generateWallpaper(){
  const [W,H] = getWpSize();
  const canvas = document.getElementById('wpCanvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  const t = WP_THEMES[wpTheme];
  const settings = DB.getSettings();
  const sem = DB.getSemester();

  // background
  const grad = ctx.createLinearGradient(0,0,W,H);
  grad.addColorStop(0, t.bg[0]); grad.addColorStop(1, t.bg[1]);
  ctx.fillStyle = grad; ctx.fillRect(0,0,W,H);

  if(wpTheme==='neon' || wpTheme==='cyberpunk'){
    ctx.strokeStyle = t.line; ctx.lineWidth = 1;
    for(let y=0;y<H;y+=Math.round(H/40)){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.globalAlpha=.15; ctx.stroke(); }
    ctx.globalAlpha=1;
  }

  const pad = W*0.08;
  let y = H*0.09;
  const scale = W/1080;

  // Student name / semester
  if(wpToggleState.name){
    ctx.fillStyle = t.sub; ctx.font = `${28*scale}px 'Segoe UI', sans-serif`;
    ctx.fillText((settings.name||'Student').toUpperCase(), pad, y);
    y += 44*scale;
  }
  if(wpToggleState.semester){
    ctx.fillStyle = t.sub; ctx.font = `${22*scale}px 'Segoe UI', sans-serif`;
    ctx.fillText(`${sem.name} · ${sem.schoolYear}`, pad, y);
    y += 50*scale;
  }

  // Current day / date
  if(wpToggleState.day){
    const now = new Date();
    ctx.fillStyle = t.text; ctx.font = `700 ${64*scale}px 'Segoe UI', sans-serif`;
    ctx.fillText(now.toLocaleDateString([], {weekday:'long'}), pad, y+40*scale);
    y += 90*scale;
    ctx.fillStyle = t.sub; ctx.font = `${30*scale}px 'Segoe UI', sans-serif`;
    ctx.fillText(now.toLocaleDateString([], {month:'long', day:'numeric', year:'numeric'}), pad, y);
    y += 60*scale;
  }

  // Countdown to next class
  const nextClass = findNextClassWp();
  if(wpToggleState.countdown && nextClass){
    roundRect(ctx, pad, y, W-2*pad, 130*scale, 24*scale, t.card, t.line);
    ctx.fillStyle = t.accent; ctx.font = `700 ${26*scale}px 'Segoe UI', sans-serif`;
    ctx.fillText('NEXT CLASS IN', pad+30*scale, y+45*scale);
    ctx.fillStyle = t.text; ctx.font = `700 ${44*scale}px 'Segoe UI', sans-serif`;
    ctx.fillText(fmtDuration(nextClass.mins), pad+30*scale, y+95*scale);
    y += 160*scale;
  }

  // Next class detail
  if(wpToggleState.next && nextClass){
    ctx.fillStyle = t.sub; ctx.font = `${24*scale}px 'Segoe UI', sans-serif`;
    ctx.fillText(`${nextClass.s.code} · ${fmtTime(nextClass.s.start)} · ${nextClass.s.room}`, pad, y);
    y += 50*scale;
  }

  y += 20*scale;

  // Today's classes
  if(wpToggleState.classes){
    const dayName = DAY_NAMES[new Date().getDay()];
    const list = DB.getSubjects().filter(s=>!s.archived && s.days.includes(dayName)).sort((a,b)=>a.start.localeCompare(b.start));
    ctx.fillStyle = t.text; ctx.font = `700 ${28*scale}px 'Segoe UI', sans-serif`;
    ctx.fillText("TODAY'S CLASSES", pad, y); y += 20*scale;
    list.slice(0,5).forEach(s=>{
      y += 50*scale;
      ctx.fillStyle = s.color; ctx.beginPath(); ctx.arc(pad+8*scale, y-8*scale, 7*scale, 0, 7); ctx.fill();
      ctx.fillStyle = t.text; ctx.font = `600 ${26*scale}px 'Segoe UI', sans-serif`;
      ctx.fillText(`${s.code}`, pad+28*scale, y);
      ctx.fillStyle = t.sub; ctx.font = `${22*scale}px 'Segoe UI', sans-serif`;
      ctx.fillText(`${fmtTime(s.start)} · ${s.room}`, pad+28*scale, y+28*scale);
      y += 24*scale;
    });
    if(!list.length){ ctx.fillStyle = t.sub; ctx.font=`${24*scale}px 'Segoe UI', sans-serif`; ctx.fillText('No classes today 🎉', pad, y+40*scale); y+=40*scale; }
    y += 30*scale;
  }

  // Tasks
  if(wpToggleState.tasks){
    const tasks = DB.getTasks().filter(t2=>t2.status!=='completed').sort((a,b)=>(a.dueDate+a.dueTime).localeCompare(b.dueDate+b.dueTime)).slice(0,4);
    ctx.fillStyle = t.text; ctx.font = `700 ${28*scale}px 'Segoe UI', sans-serif`;
    ctx.fillText('UPCOMING TASKS', pad, y); y+= 20*scale;
    tasks.forEach(tk=>{
      y += 46*scale;
      ctx.fillStyle = t.accent; ctx.font = `${24*scale}px 'Segoe UI', sans-serif`; ctx.fillText('•', pad, y);
      ctx.fillStyle = t.text; ctx.font = `600 ${24*scale}px 'Segoe UI', sans-serif`;
      ctx.fillText(truncateText(ctx, tk.title, W-2*pad-40*scale), pad+24*scale, y);
    });
    if(!tasks.length){ ctx.fillStyle = t.sub; ctx.font=`${22*scale}px 'Segoe UI', sans-serif`; ctx.fillText('Nothing due — you\'re all caught up', pad, y+40*scale); y+=30*scale; }
    y += 40*scale;
  }

  // Mini calendar (current week)
  if(wpToggleState.calendar){
    ctx.fillStyle = t.text; ctx.font = `700 ${28*scale}px 'Segoe UI', sans-serif`;
    ctx.fillText('THIS WEEK', pad, y); y += 30*scale;
    const now = new Date(); const start = new Date(now); start.setDate(now.getDate()-now.getDay());
    const cellW = (W-2*pad)/7;
    for(let i=0;i<7;i++){
      const d = new Date(start); d.setDate(start.getDate()+i);
      const isToday = d.toDateString()===now.toDateString();
      const cx = pad + i*cellW + cellW/2;
      if(isToday){ ctx.fillStyle = t.accent; ctx.beginPath(); ctx.arc(cx, y+18*scale, 26*scale, 0, 7); ctx.fill(); }
      ctx.fillStyle = isToday ? '#fff' : t.sub; ctx.font = `${20*scale}px 'Segoe UI', sans-serif`; ctx.textAlign='center';
      ctx.fillText(DAY_NAMES[d.getDay()][0], cx, y);
      ctx.fillStyle = isToday ? '#fff' : t.text; ctx.font = `700 ${22*scale}px 'Segoe UI', sans-serif`;
      ctx.fillText(d.getDate(), cx, y+26*scale);
      ctx.textAlign='left';
    }
    y += 80*scale;
  }

  // Quote near bottom
  if(wpToggleState.quote){
    const quoteY = H - 140*scale;
    ctx.fillStyle = t.accent; ctx.font = `${40*scale}px Georgia, serif`; ctx.fillText('"', pad, quoteY-10*scale);
    ctx.fillStyle = t.sub; ctx.font = `italic ${22*scale}px 'Segoe UI', sans-serif`;
    wrapText(ctx, todaysQuote(), pad+20*scale, quoteY, W-2*pad-20*scale, 30*scale);
  }

  // logo / qr placeholders
  if(wpToggleState.logo){
    ctx.strokeStyle = t.line; ctx.lineWidth=2; ctx.setLineDash([6,6]);
    roundRectStroke(ctx, W-pad-80*scale, 40*scale, 80*scale, 80*scale, 16*scale, t.line);
    ctx.setLineDash([]);
    ctx.fillStyle = t.sub; ctx.font = `${14*scale}px sans-serif`; ctx.textAlign='center';
    ctx.fillText('LOGO', W-pad-40*scale, 85*scale); ctx.textAlign='left';
  }
  if(wpToggleState.qr){
    const qs = 90*scale;
    ctx.strokeStyle = t.line; ctx.lineWidth=2; ctx.setLineDash([6,6]);
    roundRectStroke(ctx, W-pad-qs, H-pad-qs, qs, qs, 12*scale, t.line);
    ctx.setLineDash([]);
    ctx.fillStyle = t.sub; ctx.font = `${14*scale}px sans-serif`; ctx.textAlign='center';
    ctx.fillText('QR CODE', W-pad-qs/2, H-pad-qs/2); ctx.textAlign='left';
  }
}

function findNextClassWp(){
  const now = new Date();
  for(let d=0; d<7; d++){
    const day = new Date(now); day.setDate(now.getDate()+d);
    const dayName = DAY_NAMES[day.getDay()];
    const subs = DB.getSubjects().filter(s=>!s.archived && s.days.includes(dayName)).sort((a,b)=>a.start.localeCompare(b.start));
    for(const s of subs){
      const mins = minutesUntil(day.toISOString().slice(0,10), s.start);
      if(mins >= -5) return { s, mins };
    }
  }
  return null;
}
function roundRect(ctx,x,y,w,h,r,fill,stroke){
  ctx.beginPath(); ctx.moveTo(x+r,y);
  ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r);
  ctx.closePath();
  if(fill){ ctx.fillStyle=fill; ctx.fill(); }
  if(stroke){ ctx.strokeStyle=stroke; ctx.lineWidth=1.5; ctx.stroke(); }
}
function roundRectStroke(ctx,x,y,w,h,r,stroke){ roundRect(ctx,x,y,w,h,r,null,stroke); }
function wrapText(ctx, text, x, y, maxWidth, lineHeight){
  const words = text.split(' '); let line=''; let curY=y;
  words.forEach(word=>{
    const test = line+word+' ';
    if(ctx.measureText(test).width > maxWidth && line){ ctx.fillText(line, x, curY); line=word+' '; curY+=lineHeight; }
    else line = test;
  });
  ctx.fillText(line, x, curY);
}
function truncateText(ctx, text, maxWidth){
  if(ctx.measureText(text).width <= maxWidth) return text;
  let t = text;
  while(ctx.measureText(t+'…').width > maxWidth && t.length>0){ t = t.slice(0,-1); }
  return t+'…';
}

function downloadWallpaper(format){
  const canvas = document.getElementById('wpCanvas');
  const link = document.createElement('a');
  link.download = `wallpaper-${wpTheme}.${format==='jpeg'?'jpg':'png'}`;
  link.href = canvas.toDataURL(format==='jpeg' ? 'image/jpeg' : 'image/png', 0.95);
  link.click();
  Toast.show('Wallpaper downloaded');
}
