/* ============================================================
   CURRICULUM.JS — BS Computer Science, 2025 Curriculum
   All curriculum data and rendering logic lives here.
   ============================================================ */

const CURRICULUM_META = {
  program: 'BS Computer Science',
  version: '2023-2024 Curriculum',
};

const curriculum = [
  {
    year: 'First Year',
    semesters: [
      {
        name: 'First Semester',
        subjects: [
          { code: 'MATH 1', title: 'Mathematics in the Modern World', units: 3, lec: 3, lab: 0, prerequisite: [], corequisite: [] },
          { code: 'GEE 1', title: 'Gender and Society', units: 3, lec: 2, lab: 0, prerequisite: [], corequisite: [] },
          { code: 'GEE 2', title: 'People and the Earth\'s Ecosystems', units: 3, lec: 3, lab: 0, prerequisite: [], corequisite: [] },
          { code: 'MATH 2', title: 'College Algebra', units: 3, lec: 3, lab: 0, prerequisite: [], corequisite: [] },
          { code: 'CC101', title: 'Introduction to Computing', units: 3, lec: 2, lab: 3, prerequisite: [], corequisite: [] },
          { code: 'CC102', title: 'Fundamentals of Programming', units: 3, lec: 2, lab: 3, prerequisite: [], corequisite: [] },
          { code: 'PE 1', title: 'Physical Fitness and Wellness', units: 2, lec: 2, lab: 0, prerequisite: [], corequisite: [] },
          { code: 'NSTP 1', title: 'National Service Training Program 1', units: 3, lec: 3, lab: 0, prerequisite: [], corequisite: [] },
        ],
      },
      {
        name: 'Second Semester',
        subjects: [
          { code: 'SCI 1', title: 'Science,Technology and Society', units: 3, lec: 3, lab: 0, prerequisite: [], corequisite: [] },
          { code: 'ENG 1', title: 'Purposive Communication', units: 3, lec: 3, lab: 0, prerequisite: [], corequisite: [] },
          { code: 'GEE 3', title: 'Philippine Popular Culture', units: 3, lec: 3, lab: 0, prerequisite: [], corequisite: [] },
          { code: 'SOCSCI 2', title: 'Readings in Philippine History', units: 3, lec: 3, lab: 0, prerequisite: [], corequisite: [] },
          { code: 'CC103', title: 'Intermediate Programming', units: 3, lec: 2, lab: 3, prerequisite: ['CC101', 'CC102'], corequisite: [] },
          { code: 'DS101', title: 'Discrete Structure 1', units: 3, lec: 3, lab: 0, prerequisite: ['MATH1'], corequisite: [] },
          { code: 'PE 2', title: 'Rhythmic Activities', units: 2, lec: 2, lab: 0, prerequisite: ['PE 1'], corequisite: [] },
          { code: 'NSTP 2', title: 'National Service Training Program 2', units: 3, lec: 3, lab: 0, prerequisite: ['NSTP 1'], corequisite: [] },
        ],
      },
    ],
  },
  {
    year: 'Second Year',
    semesters: [
      {
        name: 'First Semester',
        subjects: [
          { code: 'RIZAL', title: 'The Life and Works of Rizal', units: 3, lec: 3, lab: 0, prerequisite: [], corequisite: [] },
          { code: 'HUM 1', title: 'Art Appreciation', units: 3, lec: 3, lab: 0, prerequisite: [], corequisite: [] },
          { code: 'DS102', title: 'Discrete Structure 2', units: 3, lec: 3, lab: 0, prerequisite: ['DS101'], corequisite: [] },
          { code: 'CC104', title: 'Data Structure and Algorithm', units: 3, lec: 2, lab: 3, prerequisite: ['CC103'], corequisite: [] },
          { code: 'CC105', title: 'Information Management', units: 3, lec: 2, lab: 3, prerequisite: ['CC103'], corequisite: [] },
          { code: 'SDF101', title: 'Object-Oriented Programming', units: 3, lec: 2, lab: 3, prerequisite: ['CC103'], corequisite: [] },
          { code: 'NC101', title: 'Networks and Communications', units: 3, lec: 2, lab: 3, prerequisite: ['CC103'], corequisite: [] },
          { code: 'PE 3', title: 'Individual and Dual Sports', units: 2, lec: 2, lab: 0, prerequisite: ['PE 1'], corequisite: [] },
        ],
      },
      {
        name: 'Second Semester',
        subjects: [
          { code: 'HUM 2', title: 'Ethics', units: 3, lec: 3, lab: 0, prerequisite: [], corequisite: [] },
          { code: 'AR101', title: 'Architecture and Organization', units: 3, lec: 2, lab: 3, prerequisite: ['DS102', 'CC104'], corequisite: [] },
          { code: 'SS100', title: 'Understanding the Self', units: 3, lec: 3, lab: 0, prerequisite: [], corequisite: [] },
          { code: 'IM101', title: 'Advanced Database System', units: 3, lec: 2, lab: 3, prerequisite: ['CC105'], corequisite: [] },
          { code: 'PL101', title: 'Programming Languages', units: 3, lec: 2, lab: 3, prerequisite: ['CC104', 'SDF101', 'CC105'], corequisite: [] },
          { code: 'OS101', title: 'Operating System', units: 3, lec: 2, lab: 3, prerequisite: ['CC104', 'NC101'], corequisite: [] },
          { code: 'IAS101', title: 'Information Assurance and Security', units: 2, lec: 2, lab: 0, prerequisite: ['IM101', 'NC101', 'SDF101'], corequisite: [] },
          { code: 'HCI101', title: 'Human Computer Interaction', units: 1, lec: 1, lab: 0, prerequisite: ['SDF101'], corequisite: [] },
          { code: 'PE 4', title: 'Team Sport', units: 2, lec: 2, lab: 0, prerequisite: ['PE 1'], corequisite: [] },
        ],
      },
    ],
  },
  {
    year: 'Third Year',
    semesters: [
      {
        name: 'First Semester',
        subjects: [
          { code: 'SOCSCI 3', title: 'The Contemporary World', units: 3, lec: 3, lab: 0, prerequisite: [], corequisite: [] },
          { code: 'DM103', title: 'Business Process Management', units: 3, lec: 3, lab: 0, prerequisite: [], corequisite: [] },
          { code: 'AL101', title: 'Algorithm and Complexity', units: 3, lec: 3, lab: 0, prerequisite: ['DS102', 'CC104'], corequisite: [] },
          { code: 'CC106', title: 'Application Development and Emerging Technologies', units: 3, lec: 2, lab: 3, prerequisite: ['3rd Year Standing', 'CC105'], corequisite: [] },
          { code: 'IPT101', title: 'Integrative Programming and Technologies', units: 3, lec: 2, lab: 3, prerequisite: ['SDF101', 'OS101'], corequisite: [] },
          { code: 'SE101', title: 'Software Engineering 1', units: 3, lec: 2, lab: 3, prerequisite: ['SDF101', 'CC105'], corequisite: [] },
          { code: 'SF101', title: 'System Fundamentals', units: 3, lec: 2, lab: 3, prerequisite: ['3rd Year Standing', 'PL101'], corequisite: [] },
        ],
      },
      {
        name: 'Second Semester',
        subjects: [
          { code: 'AL102', title: 'Automata Theory and Formal Languages', units: 3, lec: 3, lab: 0, prerequisite: ['3rd Year Standing', 'AL101'], corequisite: [] },
          { code: 'STAT 1', title: 'Advanced Statistics and Computer Applications', units: 3, lec: 3, lab: 0, prerequisite: ['MATH 2'], corequisite: [] },
          { code: 'SIA101', title: 'System Integration and Architecture', units: 3, lec: 2, lab: 3, prerequisite: ['3rd Year Standing', 'IPT101'], corequisite: [] },
          { code: 'SE102', title: 'Software Engineering 2', units: 3, lec: 2, lab: 3, prerequisite: ['SE101'], corequisite: [] },
          { code: 'DM104', title: 'Evaluation of Business Performance', units: 3, lec: 3, lab: 0, prerequisite: ['DM103'], corequisite: [] },
          { code: 'GV101', title: 'Graphics and Visual Computing', units: 3, lec: 2, lab: 3, prerequisite: ['3rd Year Standing'], corequisite: [] },
        ],
      },
    ],
  },
  {
    year: 'Fourth Year',
    semesters: [
      {
        name: 'First Semester',
        subjects: [
          { code: 'SP101', title: 'Social Issues and Professional Practice 1', units: 3, lec: 3, lab: 0, prerequisite: ['SE101'], corequisite: [] },
          { code: 'THS101', title: 'CS Thesis Writing 1', units: 3, lec: 3, lab: 0, prerequisite: ['4th Year Standing', 'SE102', 'STAT 1'], corequisite: [] },
          { code: 'PRC101', title: 'Practicum', units: 3, lec: 0, lab: 162, prerequisite: ['4th Year Standing', 'SE102'], corequisite: [] },
        ],
      },
      {
        name: 'Second Semester',
        subjects: [
          { code: 'THS102', title: 'CS Thesis Writing 2', units: 3, lec: 3, lab: 0, prerequisite: ['THS101'], corequisite: [] },
          { code: 'SA101', title: 'Systems Administration and Maintenance', units: 3, lec: 2, lab: 3, prerequisite: ['4th Year Standing', 'IAS101'], corequisite: [] },
          { code: 'IS101', title: 'Intelligent Systems', units: 3, lec: 2, lab: 3, prerequisite: ['4th Year Standing'], corequisite: [] },
        ],
      },
    ],
  },
];

/* ============================================================
   STATISTICS HELPERS
   ============================================================ */

function getCurriculumStats() {
  let totalSubjects = 0, totalUnits = 0, totalSemesters = 0;
  curriculum.forEach(y => {
    y.semesters.forEach(s => {
      totalSemesters++;
      s.subjects.forEach(sub => { totalSubjects++; totalUnits += sub.units; });
    });
  });
  return { totalSubjects, totalUnits, years: curriculum.length, semesters: totalSemesters };
}

/* ============================================================
   BADGE RENDERERS
   ============================================================ */

function renderReqBadges(arr) {
  if (!arr || arr.length === 0) return '<span class="text-faint" style="font-size:.75rem">None</span>';
  return arr.map(c => `<span class="badge cur-badge">${c}</span>`).join(' ');
}

/* ============================================================
   TABLE ROW (desktop)
   ============================================================ */

function renderSubjectRow(sub) {
  return `<tr>
    <td><span class="cur-code mono">${sub.code}</span></td>
    <td class="cur-title">${sub.title}</td>
    <td class="text-center cur-num">${sub.units}</td>
    <td class="text-center cur-num">${sub.lec}</td>
    <td class="text-center cur-num">${sub.lab}</td>
    <td>${renderReqBadges(sub.prerequisite)}</td>
    <td>${renderReqBadges(sub.corequisite)}</td>
  </tr>`;
}

/* ============================================================
   MOBILE CARD
   ============================================================ */

function renderSubjectCard(sub) {
  return `<div class="cur-subject-card">
    <div class="cur-card-head">
      <span class="cur-code mono">${sub.code}</span>
      <span class="cur-units-badge">${sub.units} <span style="font-weight:500;opacity:.75">units</span></span>
    </div>
    <div class="cur-card-title">${sub.title}</div>
    <div class="cur-card-meta">
      <span><i class="bi bi-broadcast-pin"></i> Lec <strong>${sub.lec}</strong></span>
      <span><i class="bi bi-cpu"></i> Lab <strong>${sub.lab}</strong></span>
    </div>
    <div class="cur-card-req">
      <span class="cur-req-label">Pre:</span> ${renderReqBadges(sub.prerequisite)}
    </div>
    <div class="cur-card-req">
      <span class="cur-req-label">Co:</span> ${renderReqBadges(sub.corequisite)}
    </div>
  </div>`;
}

/* ============================================================
   SEMESTER PANEL
   ============================================================ */

function renderSemester(sem, semIndex, yearIndex, accordionId) {
  const semId = `sem-${yearIndex}-${semIndex}`;
  const totalUnits = sem.subjects.reduce((a, s) => a + s.units, 0);
  const isFirst = yearIndex === 0 && semIndex === 0;

  return `<div class="accordion-item cur-accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button cur-accordion-btn ${isFirst ? '' : 'collapsed'}"
              type="button" data-bs-toggle="collapse"
              data-bs-target="#${semId}" aria-expanded="${isFirst}">
        <span class="cur-sem-label">
          <i class="bi bi-calendar2-week"></i>
          ${sem.name}
        </span>
        <span class="cur-sem-meta ms-auto me-3">
          <span class="cur-sem-stat">${sem.subjects.length} subjects</span>
          <span class="cur-sem-dot">·</span>
          <span class="cur-sem-stat">${totalUnits} units</span>
        </span>
      </button>
    </h2>
    <div id="${semId}" class="accordion-collapse collapse ${isFirst ? 'show' : ''}" data-bs-parent="#${accordionId}">
      <div class="accordion-body cur-accordion-body">
        <!-- Desktop table -->
        <div class="cur-table-wrap d-none d-md-block">
          <table class="cur-table w-100">
            <thead>
              <tr>
                <th>Code</th>
                <th>Course Title</th>
                <th class="text-center">Units</th>
                <th class="text-center">Lec</th>
                <th class="text-center">Lab</th>
                <th>Prerequisite</th>
                <th>Corequisite</th>
              </tr>
            </thead>
            <tbody>
              ${sem.subjects.map(renderSubjectRow).join('')}
            </tbody>
          </table>
        </div>
        <!-- Mobile cards -->
        <div class="cur-mobile-cards d-md-none">
          ${sem.subjects.map(renderSubjectCard).join('')}
        </div>
      </div>
    </div>
  </div>`;
}

/* ============================================================
   YEAR SECTION
   ============================================================ */

function renderYear(year, yearIndex) {
  const accordionId = `acc-year-${yearIndex}`;
  const totalYearUnits = year.semesters.reduce((a, s) => a + s.subjects.reduce((b, sub) => b + sub.units, 0), 0);
  const totalYearSubjects = year.semesters.reduce((a, s) => a + s.subjects.length, 0);

  return `<div class="cur-year-block mb-3">
    <div class="cur-year-header">
      <div class="cur-year-pill">${yearIndex + 1}</div>
      <div>
        <div class="cur-year-title">${year.year}</div>
        <div class="cur-year-sub">${totalYearSubjects} subjects &nbsp;·&nbsp; ${totalYearUnits} units</div>
      </div>
    </div>
    <div class="accordion cur-semester-accordion" id="${accordionId}">
      ${year.semesters.map((s, si) => renderSemester(s, si, yearIndex, accordionId)).join('')}
    </div>
  </div>`;
}

/* ============================================================
   SEARCH FILTER
   ============================================================ */

function filterCurriculum(query) {
  const q = query.toLowerCase().trim();
  document.querySelectorAll('.cur-subject-card').forEach(card => {
    const text = card.textContent.toLowerCase();
    card.style.display = !q || text.includes(q) ? '' : 'none';
  });
  document.querySelectorAll('.cur-table tbody tr').forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = !q || text.includes(q) ? '' : 'none';
  });
  // Show/hide empty notices
  document.querySelectorAll('.cur-accordion-body').forEach(body => {
    const visibleCards = body.querySelectorAll('.cur-subject-card:not([style*="display: none"])');
    const visibleRows = body.querySelectorAll('tbody tr:not([style*="display: none"])');
    let notice = body.querySelector('.cur-empty-notice');
    if (!notice) {
      notice = document.createElement('div');
      notice.className = 'cur-empty-notice text-faint text-center py-2';
      notice.style.fontSize = '.82rem';
      notice.textContent = 'No matching subjects';
      body.appendChild(notice);
    }
    const hasVisible = visibleCards.length > 0 || visibleRows.length > 0;
    notice.style.display = (!q || hasVisible) ? 'none' : '';
  });
}

/* ============================================================
   INIT
   ============================================================ */

function initCurriculum() {
  const stats = getCurriculumStats();

  // Stats cards
  document.getElementById('curTotalSubjects').textContent = stats.totalSubjects;
  document.getElementById('curTotalUnits').textContent = stats.totalUnits;
  document.getElementById('curTotalYears').textContent = stats.years;
  document.getElementById('curTotalSemesters').textContent = stats.semesters;

  // Program meta
  document.getElementById('curProgram').textContent = CURRICULUM_META.program;
  document.getElementById('curVersion').textContent = CURRICULUM_META.version;

  // Render years
  const container = document.getElementById('curriculumContainer');
  container.innerHTML = curriculum.map((y, i) => renderYear(y, i)).join('');

  // Search
  const searchInput = document.getElementById('curSearch');
  if (searchInput) {
    searchInput.addEventListener('input', e => filterCurriculum(e.target.value));
  }
}
