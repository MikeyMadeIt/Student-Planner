/* ============================================================
   CURRICULUM.JS — BS Computer Science, 2023-2024 Curriculum
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
          { code: 'MATH 1',  title: 'Mathematics in the Modern World',        units: 3, lec: 3, lab: 0,   prerequisite: [], corequisite: [] },
          { code: 'GEE 1',   title: 'Gender and Society',                      units: 3, lec: 3, lab: 0,   prerequisite: [], corequisite: [] },
          { code: 'GEE 2',   title: "People and the Earth's Ecosystems",       units: 3, lec: 3, lab: 0,   prerequisite: [], corequisite: [] },
          { code: 'MATH 2',  title: 'College Algebra',                         units: 3, lec: 3, lab: 0,   prerequisite: [], corequisite: [] },
          { code: 'CC101',   title: 'Introduction to Computing',               units: 3, lec: 2, lab: 3,   prerequisite: [], corequisite: [] },
          { code: 'CC102',   title: 'Fundamentals of Programming',             units: 3, lec: 2, lab: 3,   prerequisite: [], corequisite: [] },
          { code: 'PE 1',    title: 'Physical Fitness and Wellness',           units: 2, lec: 2, lab: 0,   prerequisite: [], corequisite: [] },
          { code: 'NSTP 1',  title: 'National Service Training Program 1',    units: 3, lec: 3, lab: 0,   prerequisite: [], corequisite: [] },
        ],
      },
      {
        name: 'Second Semester',
        subjects: [
          { code: 'SCI 1',    title: 'Science, Technology and Society',        units: 3, lec: 3, lab: 0,   prerequisite: [], corequisite: [] },
          { code: 'ENG 1',    title: 'Purposive Communication',                units: 3, lec: 3, lab: 0,   prerequisite: [], corequisite: [] },
          { code: 'GEE 3',    title: 'Philippine Popular Culture',              units: 3, lec: 3, lab: 0,   prerequisite: [], corequisite: [] },
          { code: 'SOCSCI 2', title: 'Readings in Philippine History',         units: 3, lec: 3, lab: 0,   prerequisite: [], corequisite: [] },
          { code: 'CC103',    title: 'Intermediate Programming',               units: 3, lec: 2, lab: 3,   prerequisite: ['CC101','CC102'], corequisite: [] },
          { code: 'DS101',    title: 'Discrete Structure 1',                   units: 3, lec: 3, lab: 0,   prerequisite: ['MATH 1'], corequisite: [] },
          { code: 'PE 2',     title: 'Rhythmic Activities',                    units: 2, lec: 2, lab: 0,   prerequisite: ['PE 1'], corequisite: [] },
          { code: 'NSTP 2',   title: 'National Service Training Program 2',   units: 3, lec: 3, lab: 0,   prerequisite: ['NSTP 1'], corequisite: [] },
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
          { code: 'RIZAL',  title: 'The Life and Works of Rizal',             units: 3, lec: 3, lab: 0,   prerequisite: [], corequisite: [] },
          { code: 'HUM 1',  title: 'Art Appreciation',                         units: 3, lec: 3, lab: 0,   prerequisite: [], corequisite: [] },
          { code: 'DS102',  title: 'Discrete Structure 2',                     units: 3, lec: 3, lab: 0,   prerequisite: ['DS101'], corequisite: [] },
          { code: 'CC104',  title: 'Data Structure and Algorithm',             units: 3, lec: 2, lab: 3,   prerequisite: ['CC103'], corequisite: [] },
          { code: 'CC105',  title: 'Information Management',                   units: 3, lec: 2, lab: 3,   prerequisite: ['CC103'], corequisite: [] },
          { code: 'SDF101', title: 'Object-Oriented Programming',             units: 3, lec: 2, lab: 3,   prerequisite: ['CC103'], corequisite: [] },
          { code: 'NC101',  title: 'Networks and Communications',              units: 3, lec: 2, lab: 3,   prerequisite: ['CC103'], corequisite: [] },
          { code: 'PE 3',   title: 'Individual and Dual Sports',               units: 2, lec: 2, lab: 0,   prerequisite: ['PE 1'], corequisite: [] },
        ],
      },
      {
        name: 'Second Semester',
        subjects: [
          { code: 'HUM 2',   title: 'Ethics',                                  units: 3, lec: 3, lab: 0,   prerequisite: [], corequisite: [] },
          { code: 'AR101',   title: 'Architecture and Organization',           units: 3, lec: 2, lab: 3,   prerequisite: ['DS102','CC104'], corequisite: [] },
          { code: 'SS100',   title: 'Understanding the Self',                  units: 3, lec: 3, lab: 0,   prerequisite: [], corequisite: [] },
          { code: 'IM101',   title: 'Advanced Database System',                units: 3, lec: 2, lab: 3,   prerequisite: ['CC105'], corequisite: [] },
          { code: 'PL101',   title: 'Programming Languages',                   units: 3, lec: 2, lab: 3,   prerequisite: ['CC104','SDF101','CC105'], corequisite: [] },
          { code: 'OS101',   title: 'Operating System',                        units: 3, lec: 2, lab: 3,   prerequisite: ['CC104','NC101'], corequisite: [] },
          { code: 'IAS101',  title: 'Information Assurance and Security',      units: 2, lec: 2, lab: 0,   prerequisite: ['IM101','NC101','SDF101'], corequisite: [] },
          { code: 'HCI101',  title: 'Human Computer Interaction',              units: 1, lec: 1, lab: 0,   prerequisite: ['SDF101'], corequisite: [] },
          { code: 'PE 4',    title: 'Team Sport',                               units: 2, lec: 2, lab: 0,   prerequisite: ['PE 1'], corequisite: [] },
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
          { code: 'SOCSCI 3', title: 'The Contemporary World',                        units: 3, lec: 3, lab: 0, prerequisite: [], corequisite: [] },
          { code: 'DM103',    title: 'Business Process Management',                   units: 3, lec: 3, lab: 0, prerequisite: [], corequisite: [] },
          { code: 'AL101',    title: 'Algorithm and Complexity',                      units: 3, lec: 3, lab: 0, prerequisite: ['DS102','CC104'], corequisite: [] },
          { code: 'CC106',    title: 'Application Development and Emerging Technologies', units: 3, lec: 2, lab: 3, prerequisite: ['3rd Year Standing','CC105'], corequisite: [] },
          { code: 'IPT101',   title: 'Integrative Programming and Technologies',      units: 3, lec: 2, lab: 3, prerequisite: ['SDF101','OS101'], corequisite: [] },
          { code: 'SE101',    title: 'Software Engineering 1',                        units: 3, lec: 2, lab: 3, prerequisite: ['SDF101','CC105'], corequisite: [] },
          { code: 'SF101',    title: 'System Fundamentals',                           units: 3, lec: 2, lab: 3, prerequisite: ['3rd Year Standing','PL101'], corequisite: [] },
        ],
      },
      {
        name: 'Second Semester',
        subjects: [
          { code: 'AL102',   title: 'Automata Theory and Formal Languages',           units: 3, lec: 3, lab: 0, prerequisite: ['3rd Year Standing','AL101'], corequisite: [] },
          { code: 'STAT 1',  title: 'Advanced Statistics and Computer Applications',  units: 3, lec: 3, lab: 0, prerequisite: ['MATH 2'], corequisite: [] },
          { code: 'SIA101',  title: 'System Integration and Architecture',            units: 3, lec: 2, lab: 3, prerequisite: ['3rd Year Standing','IPT101'], corequisite: [] },
          { code: 'SE102',   title: 'Software Engineering 2',                         units: 3, lec: 2, lab: 3, prerequisite: ['SE101'], corequisite: [] },
          { code: 'DM104',   title: 'Evaluation of Business Performance',             units: 3, lec: 3, lab: 0, prerequisite: ['DM103'], corequisite: [] },
          { code: 'GV101',   title: 'Graphics and Visual Computing',                  units: 3, lec: 2, lab: 3, prerequisite: ['3rd Year Standing'], corequisite: [] },
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
          { code: 'SP101',   title: 'Social Issues and Professional Practice 1', units: 3, lec: 3, lab: 0,   prerequisite: ['SE101'], corequisite: [] },
          { code: 'THS101',  title: 'CS Thesis Writing 1',                       units: 3, lec: 3, lab: 0,   prerequisite: ['4th Year Standing','SE102','STAT 1'], corequisite: [] },
          { code: 'PRC101',  title: 'Practicum',                                  units: 3, lec: 0, lab: 162, prerequisite: ['4th Year Standing','SE102'], corequisite: [] },
        ],
      },
      {
        name: 'Second Semester',
        subjects: [
          { code: 'THS102',  title: 'CS Thesis Writing 2',                        units: 3, lec: 3, lab: 0, prerequisite: ['THS101'], corequisite: [] },
          { code: 'SA101',   title: 'Systems Administration and Maintenance',      units: 3, lec: 2, lab: 3, prerequisite: ['4th Year Standing','IAS101'], corequisite: [] },
          { code: 'IS101',   title: 'Intelligent Systems',                         units: 3, lec: 2, lab: 3, prerequisite: ['4th Year Standing'], corequisite: [] },
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
   COMPACT COURSE LIST  — categorized per official list
   ============================================================ */

const COURSE_CATEGORIES = [
  {
    label: 'I. General Education Courses',
    courses: [
      { code: 'HUM 1',    title: 'Art Appreciation',                units: 3 },
      { code: 'HUM 2',    title: 'Ethics',                           units: 3 },
      { code: 'MATH 1',   title: 'Mathematics in the Modern World',  units: 3 },
      { code: 'ENG 1',    title: 'Purposive Communication',          units: 3 },
      { code: 'SOCSCI 2', title: 'Readings in Philippine History',   units: 3 },
      { code: 'SCI 1',    title: 'Science, Technology and Society',  units: 3 },
      { code: 'RIZAL',    title: 'The Life and Works of Rizal',      units: 3 },
      { code: 'SOCSCI 3', title: 'The Contemporary World',           units: 3 },
      { code: 'SS100',    title: 'Understanding the Self',           units: 3 },
    ],
  },
  {
    label: 'II. General Education Electives',
    courses: [
      { code: 'GEE 1', title: 'Gender and Society',                  units: 3 },
      { code: 'GEE 2', title: "People and the Earth\'s Ecosystems",  units: 3 },
      { code: 'GEE 3', title: 'Philippine Popular Culture',           units: 3 },
    ],
  },
  {
    label: 'III. NSTP',
    courses: [
      { code: 'NSTP 1', title: 'National Service Training Program 1', units: 3 },
      { code: 'NSTP 2', title: 'National Service Training Program 2', units: 3 },
    ],
  },
  {
    label: 'IV. Physical Education',
    courses: [
      { code: 'PE 1', title: 'Physical Fitness and Wellness',  units: 2 },
      { code: 'PE 2', title: 'Rhythmic Activities',            units: 2 },
      { code: 'PE 3', title: 'Individual and Dual Sports',     units: 2 },
      { code: 'PE 4', title: 'Team Sport',                     units: 2 },
    ],
  },
  {
    label: 'V. Common Courses',
    courses: [
      { code: 'CC101', title: 'Introduction to Computing',                          units: 3 },
      { code: 'CC102', title: '*Fundamentals of Programming',                        units: 3 },
      { code: 'CC103', title: '*Intermediate Programming',                           units: 3 },
      { code: 'CC104', title: 'Data Structures and Algorithms',                      units: 3 },
      { code: 'CC105', title: 'Information Management',                              units: 3 },
      { code: 'CC106', title: 'Application Development and Emerging Technologies',   units: 3 },
    ],
  },
  {
    label: 'VI. Professional Courses',
    courses: [
      { code: 'IM101',   title: 'Advanced Database Systems',                     units: 3 },
      { code: 'AL101',   title: 'Algorithm and Complexity',                      units: 3 },
      { code: 'AR101',   title: 'Architecture and Organization',                 units: 3 },
      { code: 'AL102',   title: 'Automata Theory and Formal Languages',          units: 3 },
      { code: 'DM103',   title: 'Business Process Management',                   units: 3 },
      { code: 'THS101',  title: 'CS Thesis Writing 1',                           units: 3 },
      { code: 'THS102',  title: 'CS Thesis Writing 2',                           units: 3 },
      { code: 'DS101',   title: 'Discrete Structure 1',                          units: 3 },
      { code: 'DS102',   title: 'Discrete Structure 2',                          units: 3 },
      { code: 'DM104',   title: 'Evaluation of Business Performance',            units: 3 },
      { code: 'HCI101',  title: 'Human Computer Interaction',                    units: 1 },
      { code: 'IAS101',  title: 'Information Assurance and Security',            units: 2 },
      { code: 'IPT101',  title: 'Integrative Programming and Technologies',      units: 3 },
      { code: 'NC101',   title: 'Networks and Communications',                   units: 3 },
      { code: 'SDF101',  title: 'Object-Oriented Programming',                   units: 3 },
      { code: 'OS101',   title: 'Operating Systems',                             units: 3 },
      { code: 'PRC101',  title: 'Practicum',                                     units: 3 },
      { code: 'PL101',   title: 'Programming Languages',                         units: 3 },
      { code: 'SP101',   title: 'Social Issues and Professional Practice 1',     units: 3 },
      { code: 'SE101',   title: 'Software Engineering 1',                        units: 3 },
      { code: 'SE102',   title: 'Software Engineering 2',                        units: 3 },
      { code: 'SA101',   title: 'Systems Administration and Maintenance',        units: 3 },
      { code: 'SIA101',  title: 'Systems Integration and Architecture',          units: 3 },
    ],
  },
  {
    label: 'VII. Professional Electives',
    courses: [
      { code: 'SF101',  title: 'System Fundamentals',         units: 3 },
      { code: 'GV101',  title: 'Graphics and Visual Computing', units: 3 },
      { code: 'IS101',  title: 'Intelligent Systems',          units: 3 },
    ],
  },
  {
    label: 'VIII. Additional Mathematics',
    courses: [
      { code: 'MATH 2', title: 'College Algebra',                                    units: 3 },
      { code: 'STAT 1', title: 'Advanced Statistics with Computer Applications',     units: 3 },
    ],
  },
];

function renderCourseList() {
  const totalCourses = COURSE_CATEGORIES.reduce((a, c) => a + c.courses.length, 0);
  const totalUnits   = COURSE_CATEGORIES.reduce((a, c) => a + c.courses.reduce((b, s) => b + s.units, 0), 0);

  let rows = '';
  COURSE_CATEGORIES.forEach(cat => {
    // Category header row
    rows += `<tr class="cur-cat-row">
      <td colspan="4" class="cur-cat-label">${cat.label}</td>
    </tr>`;
    // Course rows — local counter per category
    cat.courses.forEach((sub, idx) => {
      rows += `<tr class="cur-list-row">
        <td class="cur-list-num">${idx + 1}</td>
        <td><span class="cur-code mono">${sub.code}</span></td>
        <td class="cur-list-title">${sub.title}</td>
        <td class="text-center cur-num">${sub.units}</td>
      </tr>`;
    });
  });

  // Total row
  rows += `<tr class="cur-total-row">
    <td colspan="3" class="cur-total-label">Total</td>
    <td class="text-center cur-num" style="font-weight:800">${totalUnits}</td>
  </tr>`;

  return `<div class="cur-year-block mb-3">
    <div class="cur-year-header" style="cursor:pointer" data-bs-toggle="collapse" data-bs-target="#courseListBody" aria-expanded="false">
      <div class="cur-year-pill" style="background:rgba(var(--accent),.18);color:rgb(var(--accent));box-shadow:none">
        <i class="bi bi-list-ul" style="font-size:.85rem"></i>
      </div>
      <div style="flex:1">
        <div class="cur-year-title">Complete Course List</div>
        <div class="cur-year-sub">${totalCourses} courses &nbsp;·&nbsp; ${totalUnits} total units</div>
      </div>
      <i class="bi bi-chevron-down cur-list-chevron me-2"></i>
    </div>
    <div id="courseListBody" class="collapse">
      <div class="cur-table-wrap">
        <table class="cur-table cur-list-table w-100">
          <thead>
            <tr>
              <th style="width:36px">#</th>
              <th>Course Code</th>
              <th>Course Title</th>
              <th class="text-center" style="width:60px">Units</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  </div>`;
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
   SEMESTER PANEL — all collapsed by default
   ============================================================ */

function renderSemester(sem, semIndex, yearIndex, accordionId) {
  const semId = `sem-${yearIndex}-${semIndex}`;
  const totalUnits = sem.subjects.reduce((a, s) => a + s.units, 0);

  return `<div class="accordion-item cur-accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button cur-accordion-btn collapsed"
              type="button" data-bs-toggle="collapse"
              data-bs-target="#${semId}" aria-expanded="false">
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
    <div id="${semId}" class="accordion-collapse collapse" data-bs-parent="#${accordionId}">
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

  document.getElementById('curTotalSubjects').textContent = stats.totalSubjects;
  document.getElementById('curTotalUnits').textContent = stats.totalUnits;
  document.getElementById('curTotalYears').textContent = stats.years;
  document.getElementById('curTotalSemesters').textContent = stats.semesters;

  document.getElementById('curProgram').textContent = CURRICULUM_META.program;
  document.getElementById('curVersion').textContent = CURRICULUM_META.version;

  const container = document.getElementById('curriculumContainer');
  // Course list first, then year-by-year breakdown
  container.innerHTML = renderCourseList() + curriculum.map((y, i) => renderYear(y, i)).join('');

  // Chevron toggle for course list
  const listHeader = document.querySelector('[data-bs-target="#courseListBody"]');
  const listBody = document.getElementById('courseListBody');
  if (listHeader && listBody) {
    listBody.addEventListener('show.bs.collapse', () => listHeader.querySelector('.cur-list-chevron').style.transform = 'rotate(180deg)');
    listBody.addEventListener('hide.bs.collapse', () => listHeader.querySelector('.cur-list-chevron').style.transform = '');
  }

  const searchInput = document.getElementById('curSearch');
  if (searchInput) {
    searchInput.addEventListener('input', e => filterCurriculum(e.target.value));
  }
}
