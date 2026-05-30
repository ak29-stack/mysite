const password = prompt('Password');

if (password !== 'moonpalace') {
  location.href = '../top.html';
}

let generatedHTML = '';

function convertBody(raw) {
  let text = raw.replace(/[｜|]([^《\n]+)《([^》]+)》/g, '<ruby>$1<rt>$2</rt></ruby>');

  const lines = text.split('\n');
  const blocks = [];
  let current = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (/^\s*――\s*$/.test(line)) {
      if (current.length > 0) {
        blocks.push({ type: 'p', lines: current });
        current = [];
      }
      blocks.push({ type: 'scene' });
    } else if (trimmed === '') {
      if (current.length > 0) {
        blocks.push({ type: 'p', lines: current });
        current = [];
      }
    } else {
      current.push(line);
    }
  }
  if (current.length > 0) {
    blocks.push({ type: 'p', lines: current });
  }

  let html = '';
  let currentPage = [];
  let pageCount = 0;

  blocks.forEach(b => {
    if (b.type === 'scene') {
      if (currentPage.length > 0) {
        html += `
      <section class="novel-page ${pageCount === 0 ? 'active' : ''}">
        ${currentPage.join('\n')}
      </section>`;
        currentPage = [];
        pageCount++;
      }
    } else {
      const content = b.lines.join('<br>');
      currentPage.push(`<p>${content}</p>`);
    }
  });

  if (currentPage.length > 0) {
    html += `
      <section class="novel-page ${pageCount === 0 ? 'active' : ''}">
        ${currentPage.join('\n')}
      </section>`;
  }

  return html;
}

function generate() {
  const siteName = document.getElementById('siteName').value || 'mysite';
  const workFolder = document.getElementById('workFolder').value || 'work1';
  const workTitle = document.getElementById('workTitle').value || '作品タイトル1';
  const epNumber = document.getElementById('epNumber').value || '第1話';
  const epTitle = document.getElementById('epTitle').value || '';
  const prevEp = document.getElementById('prevEp').value.trim();
  const nextEp = document.getElementById('nextEp').value.trim();
  const body = document.getElementById('body').value;

  const fullTitle = epTitle ? `${epNumber}　${epTitle}` : epNumber;
  const convertedBody = convertBody(body);

  const prevNav = prevEp
    ? `<a href="${prevEp}" class="ep-nav-prev">← 前の話</a>`
    : `<span></span>`;
  const nextNav = nextEp
    ? `<a href="${nextEp}" class="ep-nav-next">次の話 →</a>`
    : `<span></span>`;

  generatedHTML = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <title>${fullTitle} - ${workTitle} - ${siteName}</title>
  <link rel="stylesheet" href="../style.css">
</head>
<body>

  <header class="header">
    <div class="header-inner">
      <a href="../top.html" class="site-title">${siteName}</a>
      <button class="hamburger" onclick="toggleMenu()" id="hamburgerBtn">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </header>

  <nav class="nav-menu" id="navMenu">
    <ul>
      <li><a href="../top.html">トップ</a></li>
      <li><a href="../${workFolder}/index.html">${workTitle}</a></li>
      <li><a href="../chara.html">キャラクター</li>
      <li><a href="../notice.html">注意事項</a></li>
    </ul>
  </nav>

  <main class="main">
    <h1 class="page-title">${fullTitle}</h1>

    <div class="ep-body">

  ${convertedBody}

  <div class="pager">
    <button id="prevBtn">← 前へ</button>
    <span id="pageIndicator"></span>
    <button id="nextBtn">次へ →</button>
  </div>

</div>

    <div class="ep-nav">
      ${prevNav}
      ${nextNav}
    </div>
  </main>

  <script src="../script.js"><\/script>
</body>
</html>`;

  document.getElementById('output').textContent = generatedHTML;
  document.getElementById('dlBtn').disabled = false;
  document.getElementById('copyBtn').disabled = false;
}

function download() {
  if (!generatedHTML) return;
  const fileName = document.getElementById('fileName').value || 'ep.html';
  const blob = new Blob([generatedHTML], { type: 'text/html;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
}

function copyOutput() {
  if (!generatedHTML) return;
  navigator.clipboard.writeText(generatedHTML).then(() => {
    const btn = document.getElementById('copyBtn');
    btn.textContent = 'コピーしました！';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = 'HTMLをコピー';
      btn.classList.remove('copied');
    }, 2000);
  });
}

function clearAll() {
  ['siteName','workFolder','workTitle','epNumber','epTitle','prevEp','nextEp','fileName','body'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('output').textContent = 'ここに生成結果が表示されます';
  document.getElementById('dlBtn').disabled = true;
  document.getElementById('copyBtn').disabled = true;
  generatedHTML = '';
}