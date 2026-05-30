function toggleMenu() {
  const menu = document.getElementById('navMenu');
  const btn = document.getElementById('hamburgerBtn');

  menu.classList.toggle('open');
  btn.classList.toggle('open');
}

//隠しリンク
if (window.location.pathname.includes('top.html')) {

  let secretCount = 0;
  let secretTimer;

  document.querySelector('.site-title')
    .addEventListener('click', (e) => {

      e.preventDefault();

      secretCount++;

      clearTimeout(secretTimer);

      secretTimer = setTimeout(() => {
        secretCount = 0;
      }, 3000);

      if (secretCount >= 9) {
        location.href = 'generator/generator.html';
      }
  });
}

// ページ送り
const pageElements = document.querySelectorAll('.novel-page');

if (pageElements.length > 0) {

  let currentPage = 0;

  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const indicator = document.getElementById('pageIndicator');

  function showPage(index) {
    pageElements.forEach(page => {
      page.classList.remove('active');
    });
    pageElements[index].classList.add('active');
    indicator.textContent = `${index + 1} / ${pageElements.length}`;
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === pageElements.length - 1;
  }

  prevBtn.addEventListener('click', () => {
    if (currentPage > 0) {
      currentPage--;
      showPage(currentPage);
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentPage < pageElements.length - 1) {
      currentPage++;
      showPage(currentPage);
    }
  });

  showPage(currentPage);
}

//作品カード
let worksData = [];
let selectedTags = [];
let searchMode = 'OR';

fetch('works.json')
  .then(res => res.json())
  .then(data => {
    worksData = data;
    buildTagButtons();
    renderWorks();
  });

function buildTagButtons() {
  const tagBar = document.getElementById('tagBar');
  if (!tagBar) return;

  const allTags = new Set();
  worksData.forEach(work => {
    (work.tags || []).forEach(tag => allTags.add(tag));
  });

  let html = `<button onclick="filterWorks('all')" data-tag="all">全て</button>`;
  allTags.forEach(tag => {
    html += `<button onclick="filterWorks('${tag}')" data-tag="${tag}">${tag}</button>`;
  });

  tagBar.innerHTML = html;
  setActiveButton();
}

function renderWorks() {
  const worksGrid = document.getElementById('worksGrid');
  if (!worksGrid) return;

  worksGrid.innerHTML = '';

  worksData.forEach(work => {
    const tags = work.tags || [];
    let match = false;

    if (selectedTags.length === 0) {
      match = true;
    } else if (searchMode === 'OR') {
      match = selectedTags.some(tag => tags.includes(tag));
    } else {
      match = selectedTags.every(tag => tags.includes(tag));
    }

    if (!match) return;

    worksGrid.innerHTML += `
      <a href="${work.folder}/index.html" class="work-card">
        <p class="work-title">${work.title}</p>
        <p class="work-meta">${work.meta}</p>
        <p class="work-summary">${work.summary}</p>
        <p class="work-tags">
          ${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </p>
      </a>
    `;
  });
}

function filterWorks(tag) {
  if (tag === 'all') {
    selectedTags = [];
  } else {
    if (selectedTags.includes(tag)) {
      selectedTags = selectedTags.filter(t => t !== tag);
    } else {
      selectedTags.push(tag);
    }
  }
  renderWorks();
  setActiveButton();
}

function toggleMode() {
  searchMode = (searchMode === 'OR') ? 'AND' : 'OR';
  const label = document.getElementById('modeLabel');
  if (label) label.textContent = searchMode;
  renderWorks();
}

function setActiveButton() {
  const buttons = document.querySelectorAll('#tagBar button');
  buttons.forEach(btn => {
    const tag = btn.dataset.tag;
    if (tag === 'all') {
      btn.classList.toggle('active', selectedTags.length === 0);
    } else {
      btn.classList.toggle('active', selectedTags.includes(tag));
    }
  });
}

// キャラ一覧
const charaGrid = document.getElementById('charaGrid');

if (charaGrid) {
  fetch('charas.json')
    .then(res => res.json())
    .then(data => {
      data.forEach(chara => {
        const imageTag = chara.image
          ? `<img src="${chara.image}" alt="${chara.name}" class="chara-card-image">`
          : '';
        charaGrid.innerHTML += `
          <a href="chara/${chara.id}.html" class="chara-card">
            ${imageTag}
            <p class="chara-card-name">${chara.name}</p>
            <span class="chara-card-ruby">${chara.ruby || ''}</span>
            <p class="chara-card-summary">${chara.summary}</p>
          </a>
        `;
      });
    });
}