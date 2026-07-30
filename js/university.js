/* ============================================================
   UNIVERSITY.JS — University page: tab switching, directory
   accordion, and search/filter functionality
   ============================================================ */

function initUniversity() {
  const params = new URLSearchParams(window.location.search);
  const tab = params.get('tab');
  if (tab === 'directory') {
    switchTab('directory');
  }
}

/* ---------- TAB SWITCHING ---------- */
function switchTab(tab) {
  const tabInfo = document.getElementById('tabInfo');
  const tabDir  = document.getElementById('tabDirectory');
  const btnInfo = document.getElementById('tabBtnInfo');
  const btnDir  = document.getElementById('tabBtnDir');

  if (tab === 'info') {
    tabInfo.style.display = '';
    tabDir.style.display  = 'none';
    btnInfo.classList.add('active');
    btnDir.classList.remove('active');
  } else {
    tabInfo.style.display = 'none';
    tabDir.style.display  = '';
    btnInfo.classList.remove('active');
    btnDir.classList.add('active');
  }
}

/* ---------- DIRECTORY ACCORDION ---------- */
function toggleDir(btn) {
  const item    = btn.closest('.univ-dir-item');
  const body    = item.querySelector('.univ-dir-body');
  const chev    = btn.querySelector('.univ-dir-chev');
  const isOpen  = btn.getAttribute('aria-expanded') === 'true';

  if (isOpen) {
    collapseDir(btn, body, chev);
  } else {
    expandDir(btn, body, chev);
  }
}

function expandDir(btn, body, chev) {
  btn.setAttribute('aria-expanded', 'true');
  body.style.display = '';
  body.classList.add('univ-dir-body-open');
  chev.style.transform = 'rotate(180deg)';
}

function collapseDir(btn, body, chev) {
  btn.setAttribute('aria-expanded', 'false');
  body.style.display = 'none';
  body.classList.remove('univ-dir-body-open');
  chev.style.transform = 'rotate(0deg)';
}

function expandAllDir() {
  document.querySelectorAll('.univ-dir-item').forEach(item => {
    if (item.style.display === 'none') return;
    const btn  = item.querySelector('.univ-dir-toggle');
    const body = item.querySelector('.univ-dir-body');
    const chev = btn.querySelector('.univ-dir-chev');
    expandDir(btn, body, chev);
  });
}

function collapseAllDir() {
  document.querySelectorAll('.univ-dir-item').forEach(item => {
    const btn  = item.querySelector('.univ-dir-toggle');
    const body = item.querySelector('.univ-dir-body');
    const chev = btn.querySelector('.univ-dir-chev');
    collapseDir(btn, body, chev);
  });
}

/* ---------- SEARCH / FILTER ---------- */
function filterDirectory() {
  const query = document.getElementById('dirSearch').value.trim().toLowerCase();
  const items = document.querySelectorAll('.univ-dir-item');
  let visible = 0;

  items.forEach(item => {
    const text = (item.dataset.search || '') + ' ' +
                 item.querySelector('.univ-dir-office-name').textContent.toLowerCase() + ' ' +
                 item.querySelector('.univ-dir-body').textContent.toLowerCase();

    const match = !query || text.includes(query);
    item.style.display = match ? '' : 'none';

    if (match) {
      visible++;
      if (query) {
        const btn  = item.querySelector('.univ-dir-toggle');
        const body = item.querySelector('.univ-dir-body');
        const chev = btn.querySelector('.univ-dir-chev');
        expandDir(btn, body, chev);
      }
    }
  });

  const noResults = document.getElementById('dirNoResults');
  if (noResults) noResults.style.display = visible === 0 ? '' : 'none';
}
