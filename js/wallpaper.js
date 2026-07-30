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
let wpToggleState = { name:true, semester:true, room:true, professor:true, logo:false, qr:false };

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
  const labels = { name:'Student Name', semester:'Semester', room:'Room / Building', professor:'Professor', logo:'School Logo Placeholder', qr:'QR Code Placeholder' };
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
  let y = H*0.07;
  const scale = W/1080;

  // Student name / semester (fixed for the whole term, safe to keep permanent)
  if(wpToggleState.name){
    ctx.fillStyle = t.sub; ctx.font = `${26*scale}px 'Segoe UI', sans-serif`;
    ctx.fillText((settings.name||'Student').toUpperCase(), pad, y);
    y += 40*scale;
  }
  ctx.fillStyle = t.text; ctx.font = `700 ${46*scale}px 'Segoe UI', sans-serif`;
  ctx.fillText('MY SCHEDULE', pad, y+8*scale);
  y += 54*scale;
  if(wpToggleState.semester){
    ctx.fillStyle = t.sub; ctx.font = `${22*scale}px 'Segoe UI', sans-serif`;
    ctx.fillText(`${sem.name} · ${sem.schoolYear}`, pad, y);
    y += 40*scale;
  }

  const reserveBottom = (wpToggleState.qr ? 110*scale : 20*scale);
  const scheduleTop = y + 24*scale;
  const availableHeight = H - reserveBottom - scheduleTop;

  // Build the week's schedule, grouped by day, skipping days with no classes
  const weekOrder = [1,2,3,4,5,6,0]; // Mon..Sun
  const subjects = DB.getSubjects().filter(s=>!s.archived);
  const dayBlocks = weekOrder.map(dowIndex=>{
    const dayName = DAY_NAMES[dowIndex];
    const list = subjects.filter(s=>s.days.includes(dayName)).sort((a,b)=>a.start.localeCompare(b.start));
    return { dayName, list };
  }).filter(b=>b.list.length);

  const totalRows = dayBlocks.reduce((sum,b)=> sum + 1 + b.list.length, 0) || 1;
  // rows are weighted: a day header counts as 1.3, a class row as 1
  const weightedRows = dayBlocks.reduce((sum,b)=> sum + 1.3 + b.list.length, 0) || 1;
  let rowH = availableHeight / weightedRows;
  rowH = Math.max(30*scale, Math.min(64*scale, rowH));

  const dayFont = Math.max(18, Math.min(30, rowH*0.5)) ;
  const classFont = Math.max(15, Math.min(24, rowH*0.4));
  const subFont = Math.max(12, Math.min(19, rowH*0.32));

  y = scheduleTop;
  if(!dayBlocks.length){
    ctx.fillStyle = t.sub; ctx.font = `${26*scale}px 'Segoe UI', sans-serif`;
    ctx.fillText('No classes scheduled yet — add subjects in Schedule.', pad, y+40*scale);
  } else {
    dayBlocks.forEach(block=>{
      // day header
      ctx.fillStyle = t.accent; ctx.font = `700 ${dayFont}px 'Segoe UI', sans-serif`;
      ctx.fillText(fullDayName(block.dayName).toUpperCase(), pad, y+dayFont*0.8);
      y += rowH*1.3;
      block.list.forEach(s=>{
        // color dot
        ctx.fillStyle = s.color; ctx.beginPath(); ctx.arc(pad+7*scale, y-classFont*0.3, 6*scale, 0, 7); ctx.fill();
        // time
        ctx.fillStyle = t.text; ctx.font = `600 ${classFont}px 'Segoe UI', sans-serif`;
        const timeStr = `${fmtTime(s.start)}–${fmtTime(s.end)}`;
        ctx.fillText(timeStr, pad+24*scale, y);
        const timeW = ctx.measureText(timeStr).width;
        // code / desc
        ctx.fillStyle = t.text; ctx.font = `700 ${classFont}px 'Segoe UI', sans-serif`;
        ctx.fillText(`  ${s.code}`, pad+24*scale+timeW, y);
        // details line: room / professor
        const details = [];
        if(wpToggleState.room && (s.room || s.building)) details.push([s.room, s.building].filter(Boolean).join(', '));
        if(wpToggleState.professor && s.professor) details.push(s.professor);
        if(details.length){
          ctx.fillStyle = t.sub; ctx.font = `${subFont}px 'Segoe UI', sans-serif`;
          ctx.fillText(details.join(' · '), pad+24*scale, y+subFont*1.15);
        }
        y += rowH;
      });
    });
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
function fullDayName(short){
  const map = { Mon:'Monday', Tue:'Tuesday', Wed:'Wednesday', Thu:'Thursday', Fri:'Friday', Sat:'Saturday', Sun:'Sunday' };
  return map[short] || short;
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
