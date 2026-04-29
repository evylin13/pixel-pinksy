
// ============== DATA ==============
// Tiap karakter punya filter CSS biar bisa bikin variasi dari 2 base image
const characters = [
  { id: 'c1', name: 'Pinku',   src: 'assets/char1.png', filter: 'none' },
  { id: 'c2', name: 'Mochi',   src: 'assets/char2.png', filter: 'none' },
  { id: 'c3', name: 'Lavender', src: 'assets/char3.png', filter: 'none' },
  { id: 'c4', name: 'Sarah', src: 'assets/char4.png', filter: 'none' },
  { id: 'c5', name: 'Kilia', src: 'assets/char5.png', filter: 'none' },
];

const backgrounds = [
  { id: 'b1', name: 'Forest',   src: 'assets/bg1.jpg', filter: 'none' },
  { id: 'b2', name: 'Pine',     src: 'assets/bg2.jpeg', filter: 'none' },
  { id: 'b3', name: 'Mint Sky', src: 'assets/bg3.jpeg', filter: 'none' },
];

// ============== STATE ==============
const state = {
  charIndex: 0,
  bgIndex: 0,
};

// ============== ELEMENTS ==============
const charImg     = document.getElementById('charImg');
const bgLayer     = document.getElementById('bgLayer');
const charThumbs  = document.getElementById('charThumbs');
const bgThumbs    = document.getElementById('bgThumbs');
const btnPrevChar = document.getElementById('btnPrevChar');
const btnNextChar = document.getElementById('btnNextChar');
const btnNextBg   = document.getElementById('btnNextBg');

// ============== RENDER ==============
function renderCharacter() {
  const c = characters[state.charIndex];
  // restart bobble animation
  charImg.style.animation = 'none';
  charImg.offsetHeight;     // reflow trick
  charImg.style.animation = '';
  charImg.src = c.src;
  charImg.style.filter = c.filter;
  document.querySelectorAll('[data-thumb-char]').forEach((el, i) => {
    el.classList.toggle('active', i === state.charIndex);
  });
}

function renderBackground() {
  const b = backgrounds[state.bgIndex];
  bgLayer.classList.add('fade-out');
  setTimeout(() => {
    bgLayer.style.backgroundImage = `url(\"${b.src}\")`;
    bgLayer.style.filter = b.filter;
    bgLayer.classList.remove('fade-out');
  }, 180);
  document.querySelectorAll('[data-thumb-bg]').forEach((el, i) => {
    el.classList.toggle('active', i === state.bgIndex);
  });
}

function buildThumbs() {
  characters.forEach((c, i) => {
    const t = document.createElement('button');
    t.className = 'thumb';
    t.dataset.thumbChar = c.id;
    t.dataset.testid = `char-thumb-${i}`;
    t.title = c.name;
    t.setAttribute('aria-label', `Pilih karakter ${c.name}`);
    t.innerHTML = `<img src=\"${c.src}\" alt=\"${c.name}\" style=\"filter:${c.filter}\" />`;
    t.addEventListener('click', () => {
      state.charIndex = i;
      renderCharacter();
      pulse(t);
    });
    charThumbs.appendChild(t);
  });

  backgrounds.forEach((b, i) => {
    const t = document.createElement('button');
    t.className = 'thumb';
    t.dataset.thumbBg = b.id;
    t.dataset.testid = `bg-thumb-${i}`;
    t.title = b.name;
    t.setAttribute('aria-label', `Pilih background ${b.name}`);
    t.innerHTML = `<img src=\"${b.src}\" alt=\"${b.name}\" style=\"filter:${b.filter}\" />`;
    t.addEventListener('click', () => {
      state.bgIndex = i;
      renderBackground();
      pulse(t);
    });
    bgThumbs.appendChild(t);
  });
}

function pulse(el) {
  el.animate(
    [
      { transform: 'scale(1)' },
      { transform: 'scale(0.92)' },
      { transform: 'scale(1.04)' },
      { transform: 'scale(1)' },
    ],
    { duration: 280, easing: 'ease-out' }
  );
}

// ============== BUTTON ACTIONS ==============
btnPrevChar.addEventListener('click', () => {
  state.charIndex = (state.charIndex - 1 + characters.length) % characters.length;
  renderCharacter();
});
btnNextChar.addEventListener('click', () => {
  state.charIndex = (state.charIndex + 1) % characters.length;
  renderCharacter();
});
btnNextBg.addEventListener('click', () => {
  state.bgIndex = (state.bgIndex + 1) % backgrounds.length;
  renderBackground();
});

// keyboard support
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft')  btnPrevChar.click();
  if (e.key === 'ArrowRight') btnNextChar.click();
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') btnNextBg.click();
});



// ============== INIT ==============
buildThumbs();
renderCharacter();
renderBackground();

function renderCharacter() {
  const c = characters[state.charIndex];

  charImg.style.opacity = 0; // sembunyikan dulu

  // restart bobble animation
  charImg.style.animation = 'none';
  charImg.offsetHeight;
  charImg.style.animation = '';

  charImg.src = c.src;
  charImg.style.filter = c.filter;

  // tunggu gambar load baru munculkan
  charImg.onload = () => {
    charImg.style.opacity = 1;
  };

  document.querySelectorAll('[data-thumb-char]').forEach((el, i) => {
    el.classList.toggle('active', i === state.charIndex);
  });
}

// ===== SOUND =====
// ===== SOUND =====
const clickSound = new Audio("/assets/sounds/click.mp3");
clickSound.volume = 0.9;

// 🔓 UNLOCK AUDIO (WAJIB!)
document.addEventListener("click", () => {
  clickSound.play().then(() => {
    clickSound.pause();
    clickSound.currentTime = 0;
  }).catch(()=>{});
}, { once: true });


function playClick(){
  const s = clickSound.cloneNode(); // biar bisa spam klik
  s.volume = 0.9;
  s.play().catch(()=>{});
}

btnPrevChar.addEventListener('click', () => {
  playClick(); // 🔊 SOUND
  state.charIndex = (state.charIndex - 1 + characters.length) % characters.length;
  renderCharacter();
});

btnNextChar.addEventListener('click', () => {
  playClick();
  state.charIndex = (state.charIndex + 1) % characters.length;
  renderCharacter();
});

btnNextBg.addEventListener('click', () => {
  playClick();
  state.bgIndex = (state.bgIndex + 1) % backgrounds.length;
  renderBackground();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft'){  playClick(); btnPrevChar.click(); }
  if (e.key === 'ArrowRight'){ playClick(); btnNextChar.click(); }
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown'){ playClick(); btnNextBg.click(); }
});