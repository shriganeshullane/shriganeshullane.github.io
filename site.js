/* Shared script for every page of the site. */
{
const $ = id => document.getElementById(id);
const esc = t => String(t).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ---- Articles: add new posts at the top of this list ----
   cat must be one of: Chartered Accountancy, Entrepreneurship, Technology & AI, Learning, Life & Travel, Astrology, Opinion */
const POSTS = [
  {date:'2020-05-26', title:'Farmer Producer Companies: modernising agriculture', cat:'Entrepreneurship', url:'https://shriganeshullane.blogspot.com/2020/05/', note:'How FPCs help farmers get a fair price for their produce.'},
  {date:'2020-05-15', title:"Government's efforts towards MSMEs", cat:'Entrepreneurship', url:'https://shriganeshullane.blogspot.com/2020/05/', note:"The lockdown's toll on small businesses and the stimulus package for them."},
  {date:'2017-12-18', title:'ಮತದಾರನೇ ಪ್ರಜಾಪ್ರಭುತ್ವದ ನ್ಯಾಯಾಧೀಶ!', kn:true, cat:'Opinion', url:'https://shriganeshullane.blogspot.com/2017/12/', note:'The voter as the judge of democracy.'},
  {date:'2017-12-13', title:'ಮನದಾಳದ ಕೂಗು', kn:true, cat:'Life & Travel', url:'https://shriganeshullane.blogspot.com/2017/12/', note:'A cry from the heart on integrity in society.'},
  {date:'2017-12-11', title:'ಅಭಿಮಾನವಿರಲಿ ಅಂಧಾಭಿಮಾನವಲ್ಲ', kn:true, cat:'Opinion', url:'https://shriganeshullane.blogspot.com/2017/12/', note:'Admiration, not blind devotion, for public figures.'},
  {date:'2017-03-31', title:'ಮೀಸಲಾತಿ ಎಂಬ ವಿಷಯದ ಸುತ್ತ ಮುತ್ತ', kn:true, cat:'Opinion', url:'https://shriganeshullane.blogspot.com/2017/03/', note:'On reservation, the economy and social policy.'},
  {date:'2017-03-28', title:'India a Vishwa Guru', cat:'Learning', url:'https://shriganeshullane.blogspot.com/2017/03/', note:"India's gurukula tradition and its place in world knowledge."},
  {date:'2017-03-19', title:'ನಗರಗಳೆಡೆ ಸಾಗುತ್ತಿರುವ ನಮ್ಮವರು', kn:true, cat:'Life & Travel', url:'https://shriganeshullane.blogspot.com/2017/03/', note:'Our people moving towards the cities, away from farm life.'},
  {date:'2017-03-18', title:'ಸೋಲಾರ್ ವಿದ್ಯುತ್ ಇಂದಿನ ಅಗತ್ಯ', kn:true, cat:'Technology & AI', url:'https://shriganeshullane.blogspot.com/2017/03/', note:"Why solar power is today's need."},
];

/* ---- Books for the Learning page: {title, author, note}. Covers load from Open Library. ---- */
const BOOKS = [
  {title:'Ikigai', author:'Héctor García and Francesc Miralles', note:'The Japanese idea of a reason for being, and how purpose shapes a long, happy life.'},
  {title:'Corporate Chanakya', author:'Radhakrishnan Pillai', note:"Chanakya's Arthashastra applied to leadership and management today."},
];

const M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const fd = d => { const [y,m,dd] = d.split('-'); return (+dd) + ' ' + M[m-1] + ' ' + y; };
const li = p => '<li><time datetime="' + esc(p.date) + '">' + fd(p.date) + '</time><div><a' + (p.kn ? ' class="kn"' : '') + ' href="' + esc(p.url) + '">' + esc(p.title) + '</a><p>' + esc(p.note) + '</p><span class="cat">' + esc(p.cat) + '</span></div></li>';
const empty = msg => '<li class="empty" style="display:block">' + esc(msg) + '</li>';

document.querySelectorAll('ul.posts[data-latest]').forEach(u => { u.innerHTML = POSTS.filter(p => p.cat !== 'Opinion').slice(0, +u.dataset.latest).map(li).join(''); });
document.querySelectorAll('ul.posts[data-cat]').forEach(u => { const l = POSTS.filter(p => p.cat === u.dataset.cat); u.innerHTML = l.length ? l.map(li).join('') : empty(u.dataset.empty); });

if ($('allposts')) {
  const cats = ['All', 'Chartered Accountancy', 'Entrepreneurship', 'Technology & AI', 'Learning', 'Life & Travel', 'Astrology', 'Opinion'];
  let cur = 'All';
  try { const h = decodeURIComponent(location.hash.slice(1)); if (cats.includes(h)) cur = h; } catch (_) {}
  const draw = () => {
    $('filters').innerHTML = cats.map(c => '<button type="button" aria-pressed="' + (c === cur) + '">' + esc(c) + '</button>').join('');
    const l = POSTS.filter(p => cur === 'All' || p.cat === cur);
    $('allposts').innerHTML = l.length ? l.map(li).join('') : empty('No articles on this theme yet.');
  };
  $('filters').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { cur = b.textContent; draw(); } });
  draw();
}
if ($('books')) {
  const box = $('books');
  box.innerHTML = BOOKS.map((b, i) => '<figure class="book"><div class="cover" id="cv' + i + '"><span class="ft">' + esc(b.title) + '</span><span class="fa">' + esc(b.author) + '</span></div><figcaption><b>' + esc(b.title) + '</b><span>' + esc(b.author) + '</span><p>' + esc(b.note) + '</p></figcaption></figure>').join('');
  BOOKS.forEach((b, i) => {
    try {
      fetch('https://openlibrary.org/search.json?limit=1&fields=cover_i&title=' + encodeURIComponent(b.title) + '&author=' + encodeURIComponent(b.author.split(' and ')[0]))
        .then(r => r.json()).then(d => {
          const id = d && d.docs && d.docs[0] && d.docs[0].cover_i; if (!id) return;
          const img = new Image(); img.alt = 'Cover of ' + b.title; img.loading = 'lazy';
          img.onload = () => { const c = $('cv' + i); c.textContent = ''; c.appendChild(img); c.classList.add('has'); };
          img.src = 'https://covers.openlibrary.org/b/id/' + Number(id) + '-L.jpg';
        }).catch(() => {});
    } catch (_) {}
  });
}

/* ---- Mobile menu ---- */
if ($('menu')) $('menu').addEventListener('click', () => { const o = $('links').classList.toggle('open'); $('menu').setAttribute('aria-expanded', o); });

/* ---- Home slider ---- */
const sl = [...document.querySelectorAll('.slide')];
if (sl.length && $('dots')) {
  let cur = 0, timer = null;
  const dots = $('dots');
  dots.innerHTML = sl.map((_, i) => '<button type="button" aria-label="Slide ' + (i + 1) + '"></button>').join('');
  const show = i => { cur = (i + sl.length) % sl.length; sl.forEach((s, k) => s.classList.toggle('on', k === cur)); [...dots.children].forEach((d, k) => d.setAttribute('aria-current', k === cur)); };
  const auto = () => { clearInterval(timer); if (!matchMedia('(prefers-reduced-motion: reduce)').matches) timer = setInterval(() => show(cur + 1), 6000); };
  $('prev').addEventListener('click', () => { show(cur - 1); auto(); });
  $('next').addEventListener('click', () => { show(cur + 1); auto(); });
  [...dots.children].forEach((d, k) => d.addEventListener('click', () => { show(k); auto(); }));
  document.querySelector('.hero').addEventListener('keydown', e => { if (e.key === 'ArrowLeft') { show(cur - 1); auto(); } if (e.key === 'ArrowRight') { show(cur + 1); auto(); } });
  show(0); auto();
}

/* ---- Raag Puriya Kalyan player: starts at 2:30.
   On the home page it tries to play as soon as the page opens. Browsers block sound until the
   visitor has interacted with the site, so when blocked it starts on their first click, tap or key press. ---- */
if ($('raag')) {
  const a = $('raag'), START = 150, home = !!document.querySelector('nav[data-autoplay]');
  const btn = $('apbtn'), seek = $('apseek');
  let userPaused = false;
  const t = x => { x = Math.max(0, Math.floor(x || 0)); return Math.floor(x / 60) + ':' + String(x % 60).padStart(2, '0'); };
  const pill = document.createElement('button'); pill.type = 'button'; pill.className = 'nowplaying'; pill.hidden = true; document.body.appendChild(pill);
  const sync = () => {
    const on = !a.paused;
    btn.classList.toggle('on', on); btn.setAttribute('aria-label', (on ? 'Pause' : 'Play') + ' Raag Puriya Kalyan');
    pill.hidden = !home || (!on && !userPaused);
    pill.innerHTML = on ? '<i class="eq"></i>Raag Puriya Kalyan · Pause' : '▶ Raag Puriya Kalyan · Play';
  };
  const go = () => { if (a.currentTime < START - 1 && !a.dataset.jumped) a.currentTime = START; a.dataset.jumped = '1'; return a.play(); };
  a.addEventListener('loadedmetadata', () => { seek.max = Math.floor(a.duration); $('apdur').textContent = t(a.duration); if (!a.dataset.jumped) { a.currentTime = START; } });
  a.addEventListener('timeupdate', () => { if (!seek.matches(':active')) seek.value = a.currentTime; $('apcur').textContent = t(a.currentTime); });
  ['play', 'pause', 'ended'].forEach(ev => a.addEventListener(ev, sync));
  a.addEventListener('ended', () => { userPaused = true; sync(); });
  seek.addEventListener('input', () => { a.dataset.jumped = '1'; a.currentTime = +seek.value; $('apcur').textContent = t(seek.value); });
  const toggle = e => { if (e) e.stopPropagation(); if (a.paused) { userPaused = false; go().catch(() => {}); } else { userPaused = true; a.pause(); } };
  btn.addEventListener('click', toggle); pill.addEventListener('click', toggle);
  if (home) {
    const kick = () => { if (a.paused && !userPaused) go().catch(() => {}); };
    const p = go(); if (p && p.catch) p.catch(() => {
      ['pointerdown', 'keydown', 'touchstart'].forEach(ev => document.addEventListener(ev, kick, {once: true, capture: true}));
    });
  }
}

/* ---- Click-to-load video ---- */
document.querySelectorAll('.facade').forEach(b => b.addEventListener('click', () => {
  const f = document.createElement('iframe'); f.src = b.dataset.src; f.allow = 'autoplay; encrypted-media; picture-in-picture'; f.allowFullscreen = true; f.title = b.querySelector('b').textContent; b.replaceWith(f);
}));

/* ---- Contact helpers ---- */
if ($('copy')) $('copy').addEventListener('click', e => { const b = e.currentTarget; try { navigator.clipboard.writeText('shriganeshullane@gmail.com').then(() => { b.textContent = 'Copied'; }, () => { b.textContent = 'Select and copy'; }); } catch (_) { b.textContent = 'Select and copy'; } });
if ($('vcf')) $('vcf').addEventListener('click', e => {
  e.preventDefault();
  const v = 'BEGIN:VCARD\nVERSION:3.0\nFN:CA Shriganesh Hegde Ullane\nORG:Shriganesh & Subrahmanya Chartered Accountants\nTITLE:Partner\nTEL;TYPE=CELL:+919449203522\nTEL;TYPE=CELL:+919380959304\nEMAIL:shriganeshullane@gmail.com\nADR;TYPE=WORK:;;Gokul Road;Hubballi;Karnataka;580030;India\nURL:https://shriganeshullane.github.io/website/\nEND:VCARD';
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([v], {type: 'text/vcard'})); a.download = 'Shriganesh-Hegde-Ullane.vcf'; document.body.appendChild(a); a.click(); a.remove();
});
if ($('enq')) {
  const msg = () => 'Hello Shriganesh,\n\nName: ' + $('en').value.trim() + '\nTopic: ' + $('et').value + '\n\n' + $('em').value.trim();
  const ok = () => { if (!$('en').value.trim() || !$('em').value.trim()) { $('enqnote').textContent = 'Please add your name and a message.'; return false; } $('enqnote').textContent = ''; return true; };
  $('enq').addEventListener('submit', e => { e.preventDefault(); if (ok()) location.href = 'https://wa.me/919380959304?text=' + encodeURIComponent(msg()); });
  $('enqmail').addEventListener('click', () => { if (ok()) location.href = 'mailto:shriganeshullane@gmail.com?subject=' + encodeURIComponent('Enquiry: ' + $('et').value) + '&body=' + encodeURIComponent(msg()); });
}
if ($('share')) {
  const url = 'https://shriganeshullane.github.io/website/';
  const note = t => { $('sharenote').textContent = t; };
  const copy = () => { try { navigator.clipboard.writeText(url).then(() => note('Link copied.'), () => note(url)); } catch (_) { note(url); } };
  $('share').addEventListener('click', () => { if (navigator.share) navigator.share({title: 'CA Shriganesh Hegde Ullane', url}).catch(() => {}); else copy(); });
  $('copylink').addEventListener('click', copy);
}
if ($('yr')) $('yr').textContent = new Date().getFullYear();
}
