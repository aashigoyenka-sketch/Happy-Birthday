const app = document.getElementById('app');

let passBuffer = '';
let openedGifts = new Set();
let giftClickCount = 0;
let isGiftTransitioning = false;

const audioState = {
  audio: null,
  enabled: true,
  unlocked: false
};

function el(tag, className = '', html = '') {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html) node.innerHTML = html;
  return node;
}

function ensureAudio() {
  if (!audioState.audio) {
    audioState.audio = new Audio(SITE_DATA.musicFile || 'assets/birthday-music.mp3');
    audioState.audio.loop = true;
    audioState.audio.volume = SITE_DATA.musicVolume ?? 0.45;
    audioState.audio.preload = 'auto';
  }
  return audioState.audio;
}

async function playMusic() {
  if (!audioState.enabled) return;
  const audio = ensureAudio();
  try {
    await audio.play();
    audioState.unlocked = true;
  } catch (error) {
    // autoplay may be blocked until user interaction on some browsers/mobile devices
  }
  updateAudioButton();
}

function pauseMusic() {
  if (audioState.audio) audioState.audio.pause();
  updateAudioButton();
}

function toggleMusic() {
  audioState.enabled = !audioState.enabled;
  if (audioState.enabled) playMusic();
  else pauseMusic();
}

function updateAudioButton() {
  const button = document.querySelector('.music-toggle');
  if (!button) return;
  const playing = !!(audioState.audio && !audioState.audio.paused && audioState.enabled);
  button.innerHTML = `<span class="music-icon">${playing ? '♫' : '🔇'}</span><span>${playing ? 'Music On' : 'Music Off'}</span>`;
}

function addChrome() {
  const musicBtn = el('button', 'music-toggle', '');
  musicBtn.type = 'button';
  musicBtn.setAttribute('aria-label', 'Toggle music');
  musicBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleMusic();
  });
  app.appendChild(musicBtn);
  updateAudioButton();
}

function setScreen(name) {
  app.innerHTML = '';
  const section = screens[name]();
  app.appendChild(section);
  addChrome();
}

function nextButton(text, target, classes = 'pill-btn') {
  const btn = el('button', classes, text);
  btn.type = 'button';
  btn.addEventListener('click', () => {
    playMusic();
    setScreen(target);
  });
  return btn;
}

function plainButton(text, classes = 'pill-btn') {
  const btn = el('button', classes, text);
  btn.type = 'button';
  return btn;
}

function passBoxMarkup() {
  return '<div class="pass-boxes">' + Array.from({ length: 4 }).map(() => '<span class="pass-box"></span>').join('') + '</div>';
}

function keypadMarkup() {
  const keys = ['1','2','3','4','5','6','7','8','9','*','0','#'];
  return `<div class="key-grid">${keys.map(key => `<button type="button" class="key-btn" data-key="${key}">${key}</button>`).join('')}</div>`;
}

function giftMarkup(index) {
  return `
    <div class="gift-icon gift-color-${index}">
      <span class="bow-loop left"></span>
      <span class="bow-loop right"></span>
      <span class="bow-knot"></span>
      <span class="box-lid"></span>
      <span class="ribbon-v"></span>
      <span class="ribbon-h"></span>
      <span class="box-base"></span>
    </div>`;
}

function candlesMarkup(count = 7) {
  return Array.from({ length: count }).map(() => `
    <div class="candle">
      <span class="wick"></span>
      <span class="flame"></span>
      <span class="smoke"></span>
    </div>`).join('');
}

function chooseNextScreenAfterGift() {
  giftClickCount += 1;
  if (giftClickCount === 1) return 'cake';
  if (giftClickCount === 2) return 'letter';
  return 'final';
}

function resetGiftState() {
  openedGifts = new Set();
  giftClickCount = 0;
  isGiftTransitioning = false;
}

function buildGiftScreen() {
  const section = el('section', 'screen white');
  const available = [0, 1, 2].filter(index => !openedGifts.has(index));

  section.innerHTML = `
    <div class="gifts-wrap center-box">
      <h1 class="gifts-title">Gift for you</h1>
      <div class="gift-row"></div>
      <div class="gifts-sub">${available.length > 1 ? 'click any gift to open' : available.length === 1 ? 'open the last gift' : 'all gifts opened'}</div>
    </div>`;

  const row = section.querySelector('.gift-row');

  if (available.length === 0) {
    const done = nextButton('CONTINUE', 'final', 'pill-btn accent');
    row.appendChild(done);
    return section;
  }

  available.forEach(index => {
    const btn = el('button', 'gift-btn', giftMarkup(index));
    btn.type = 'button';
    btn.setAttribute('aria-label', `Open gift ${index + 1}`);
    btn.addEventListener('click', () => {
      if (isGiftTransitioning) return;
      isGiftTransitioning = true;
      playMusic();
      btn.disabled = true;
      openedGifts.add(index);
      const nextScreen = chooseNextScreenAfterGift();
      setTimeout(() => {
        setScreen(nextScreen);
        isGiftTransitioning = false;
      }, 120);
    }, { once: true });
    row.appendChild(btn);
  });

  return section;
}

function welcomeIllustration() {
  return `
  <svg class="welcome-svg" viewBox="0 0 620 380" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <g class="confetti confetti-one">
      <circle cx="95" cy="120" r="5" fill="#ffb645" />
      <circle cx="128" cy="139" r="5" fill="#58c7ff" />
      <rect x="148" y="112" width="12" height="12" rx="3" fill="#b886ff" />
      <circle cx="470" cy="126" r="5" fill="#58c7ff" />
      <rect x="496" y="118" width="12" height="12" rx="3" fill="#ffd654" />
      <circle cx="522" cy="144" r="5" fill="#ff89c8" />
      <circle cx="311" cy="104" r="5" fill="#a2e66f" />
      <rect x="334" y="95" width="10" height="10" rx="3" fill="#ff84c8" />
      <circle cx="265" cy="138" r="4" fill="#7ae3ff" />
      <circle cx="363" cy="136" r="4" fill="#ffd35e" />
    </g>

    <g class="char-group" style="animation-delay:.1s">
      <ellipse cx="135" cy="104" rx="22" ry="28" fill="#ff8ac5"/>
      <path d="M123 129 C116 152, 120 176, 129 194" fill="none" stroke="#8ed0ff" stroke-width="4" stroke-linecap="round"/>
      <ellipse cx="135" cy="104" rx="15" ry="20" fill="#ffb6dd"/>
      <circle cx="129" cy="100" r="2.6" fill="#513c45"/>
      <circle cx="141" cy="100" r="2.6" fill="#513c45"/>
      <path d="M129 110 Q135 116 141 110" fill="none" stroke="#ff6f9f" stroke-width="3" stroke-linecap="round"/>
    </g>

    <g class="char-group" style="animation-delay:.18s">
      <ellipse cx="487" cy="101" rx="22" ry="28" fill="#75d9ff"/>
      <path d="M498 126 C504 149, 503 176, 494 196" fill="none" stroke="#8ed0ff" stroke-width="4" stroke-linecap="round"/>
      <ellipse cx="487" cy="101" rx="15" ry="20" fill="#b6edff"/>
      <circle cx="481" cy="97" r="2.6" fill="#513c45"/>
      <circle cx="493" cy="97" r="2.6" fill="#513c45"/>
      <path d="M481 107 Q487 113 493 107" fill="none" stroke="#4bb5f6" stroke-width="3" stroke-linecap="round"/>
    </g>

    <g class="floating-scene">
      <g class="char-group" style="animation-delay:.22s">
        <rect x="72" y="250" width="86" height="72" rx="12" fill="#8ad7ff" stroke="#45b4ea" stroke-width="5"/>
        <rect x="67" y="233" width="96" height="26" rx="12" fill="#a6e3ff" stroke="#45b4ea" stroke-width="5"/>
        <rect x="108" y="232" width="14" height="90" rx="6" fill="#ffe169"/>
        <rect x="72" y="268" width="86" height="12" rx="6" fill="#ffe169"/>
        <ellipse cx="102" cy="228" rx="18" ry="12" fill="#ff7dbc" stroke="#eb4a9d" stroke-width="4" transform="rotate(-18 102 228)"/>
        <ellipse cx="128" cy="228" rx="18" ry="12" fill="#ff7dbc" stroke="#eb4a9d" stroke-width="4" transform="rotate(18 128 228)"/>
        <circle cx="115" cy="232" r="8" fill="#ff7dbc" stroke="#eb4a9d" stroke-width="4"/>
        <circle cx="100" cy="279" r="4.5" fill="#564149"/>
        <circle cx="129" cy="279" r="4.5" fill="#564149"/>
        <path d="M100 294 Q114 307 129 294" fill="none" stroke="#564149" stroke-width="4" stroke-linecap="round"/>
        <circle cx="95" cy="290" r="5" fill="#ff9cc9"/>
        <circle cx="134" cy="290" r="5" fill="#ff9cc9"/>
      </g>

      <g class="char-group" style="animation-delay:.32s">
        <ellipse cx="311" cy="313" rx="118" ry="18" fill="#d9f3ff"/>
        <ellipse cx="311" cy="315" rx="98" ry="11" fill="#ffe2f0"/>
        <ellipse cx="311" cy="278" rx="108" ry="18" fill="#e291bb"/>
        <rect x="214" y="233" width="194" height="52" rx="16" fill="#4b2b1d"/>
        <rect x="227" y="216" width="168" height="30" rx="14" fill="#ffb45d"/>
        <circle cx="255" cy="225" r="6" fill="#ff8d2c"/>
        <circle cx="286" cy="225" r="6" fill="#ff8d2c"/>
        <circle cx="317" cy="225" r="6" fill="#ff8d2c"/>
        <circle cx="348" cy="225" r="6" fill="#ff8d2c"/>
        <circle cx="379" cy="225" r="6" fill="#ff8d2c"/>
        <path d="M229 219 C240 236, 251 211, 262 228 C273 245, 284 216, 295 231 C306 246, 317 214, 328 229 C339 244, 350 214, 361 230 C372 245, 383 218, 394 231" fill="none" stroke="#fff3fb" stroke-width="10" stroke-linecap="round"/>
        <rect x="249" y="158" width="124" height="64" rx="18" fill="#a2e8ff" stroke="#63c9ee" stroke-width="5"/>
        <path d="M254 169 C269 186, 284 161, 299 178 C314 195, 329 163, 344 179 C356 190, 364 178, 368 173" fill="none" stroke="#fff3fb" stroke-width="10" stroke-linecap="round"/>
        <circle cx="292" cy="189" r="5" fill="#4d3a42"/>
        <circle cx="330" cy="189" r="5" fill="#4d3a42"/>
        <path d="M292 203 Q311 219 330 203" fill="none" stroke="#ff8b54" stroke-width="6" stroke-linecap="round"/>
        <circle cx="284" cy="204" r="7" fill="#ffb2d4"/>
        <circle cx="338" cy="204" r="7" fill="#ffb2d4"/>
        <g>
          <rect x="265" y="122" width="10" height="42" rx="4" fill="#ffe79b"/>
          <path d="M270 117 C264 107, 267 98, 270 94 C273 98, 277 107, 270 117 Z" fill="#ff8f2f"/>
          <rect x="291" y="116" width="10" height="48" rx="4" fill="#ffe79b"/>
          <path d="M296 111 C290 101, 293 92, 296 88 C299 92, 303 101, 296 111 Z" fill="#ff8f2f"/>
          <rect x="317" y="120" width="10" height="44" rx="4" fill="#ffe79b"/>
          <path d="M322 115 C316 105, 319 96, 322 92 C325 96, 329 105, 322 115 Z" fill="#ff8f2f"/>
          <rect x="343" y="117" width="10" height="47" rx="4" fill="#ffe79b"/>
          <path d="M348 112 C342 102, 345 93, 348 89 C351 93, 355 102, 348 112 Z" fill="#ff8f2f"/>
        </g>
      </g>

      <g class="char-group" style="animation-delay:.42s">
        <rect x="457" y="240" width="72" height="100" rx="16" fill="#7c4b35" stroke="#613521" stroke-width="5"/>
        <rect x="463" y="246" width="60" height="88" rx="12" fill="#a8684b"/>
        <path d="M463 264 H523" stroke="#8b553f" stroke-width="4"/>
        <path d="M463 282 H523" stroke="#8b553f" stroke-width="4"/>
        <path d="M463 300 H523" stroke="#8b553f" stroke-width="4"/>
        <path d="M463 318 H523" stroke="#8b553f" stroke-width="4"/>
        <circle cx="480" cy="274" r="4.3" fill="#47383e"/>
        <circle cx="507" cy="274" r="4.3" fill="#47383e"/>
        <path d="M480 289 Q493 301 507 289" fill="none" stroke="#47383e" stroke-width="4" stroke-linecap="round"/>
        <circle cx="476" cy="286" r="5" fill="#ff9bc8"/>
        <circle cx="511" cy="286" r="5" fill="#ff9bc8"/>
        <rect x="444" y="215" width="33" height="38" rx="10" fill="#ffbbe0" stroke="#ec7bb7" stroke-width="4"/>
        <path d="M444 236 C449 227, 455 219, 460 212 C466 220, 472 228, 477 236" fill="#fff1f8"/>
        <circle cx="460" cy="233" r="4" fill="#ec7bb7"/>
      </g>

      <g class="char-group" style="animation-delay:.5s">
        <path d="M188 243 C201 207, 219 197, 237 210 C250 220, 252 241, 251 260" fill="#7de3ff" stroke="#4dbfe9" stroke-width="5"/>
        <path d="M179 244 C188 211, 205 195, 219 197 C206 212, 209 240, 211 259" fill="#53cdf7" stroke="#4dbfe9" stroke-width="5"/>
        <circle cx="220" cy="246" r="4" fill="#523e47"/>
        <circle cx="237" cy="246" r="4" fill="#523e47"/>
        <path d="M220 258 Q228 266 237 258" fill="none" stroke="#ff8d58" stroke-width="4" stroke-linecap="round"/>
      </g>
    </g>
  </svg>`;
}

const screens = {
  passcode() {
    passBuffer = '';
    resetGiftState();

    const section = el('section', 'screen red');
    section.innerHTML = `
      <div class="pass-layout">
        <div class="polaroid">
          <span class="polaroid-ribbon"><span></span></span>
          <img src="${SITE_DATA.mainPhoto}" alt="Main photo" />
          <div class="teddy-tag">
            <div class="part ear1"></div><div class="part ear2"></div><div class="part head"></div>
            <div class="part body"></div><div class="part leg1"></div><div class="part leg2"></div>
          </div>
        </div>
        <div class="pass-panel">
          <h1 class="pass-title">${SITE_DATA.passcodeTitle}</h1>
          ${passBoxMarkup()}
          ${keypadMarkup()}
          <div class="pass-hint">${SITE_DATA.passcodeHint}</div>
        </div>
      </div>`;

    section.querySelectorAll('.key-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        playMusic();
        typeKey(btn.dataset.key, section);
      });
    });
    return section;
  },

  welcome() {
    const section = el('section', 'screen blue');
    section.innerHTML = `
      <div class="welcome-wrap">
        <div class="welcome-scene">
          <div class="bubble-title">
            <div class="top">HAPPY</div>
            <div class="bottom">BIRTHDAY</div>
          </div>
          ${welcomeIllustration()}
        </div>
      </div>`;
    section.querySelector('.welcome-wrap').appendChild(nextButton('NEXT', 'gifts', 'pill-btn scene-next'));
    return section;
  },

  gifts() {
    return buildGiftScreen();
  },

  cake() {
    const section = el('section', 'screen red wish-screen');
    section.innerHTML = `
      <span class="sparkle s1">✦</span>
      <span class="sparkle s2">✦</span>
      <span class="sparkle s3">✦</span>
      <span class="sparkle s4">✦</span>
      <div class="wish-wrap">
        <h1 class="wish-title">Make a wish ✨</h1>
        <p class="wish-tip">Tap the cake or button to blow the candles</p>
        <div class="cake-stage" id="cakeStage" role="button" tabindex="0" aria-label="Blow the candles">
          <div class="candles">${candlesMarkup(5)}</div>
          <div class="cake-tier tier-top"></div>
          <div class="cake-tier tier-mid"></div>
          <div class="cake-tier tier-base"></div>
          <div class="cake-plate"></div>
        </div>
        <div class="cake-message" id="cakeMessage">Make your wish first, then blow 🌟</div>
      </div>`;

    const blowBtn = plainButton('TAP TO BLOW', 'pill-btn accent');
    const stage = section.querySelector('#cakeStage');
    const wrap = section.querySelector('.wish-wrap');
    wrap.appendChild(blowBtn);

    const blowHandler = (event) => {
      if (event) event.preventDefault();
      playMusic();
      if (section.dataset.blown === 'yes') {
        setScreen('birthday');
        return;
      }
      blowCandles(section, blowBtn);
    };

    stage.addEventListener('click', blowHandler);
    stage.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') blowHandler(event);
    });
    blowBtn.addEventListener('click', blowHandler);
    return section;
  },

  birthday() {
    const section = el('section', 'screen red birthday-screen');
    section.innerHTML = `
      <span class="sparkle s1">✦</span>
      <span class="sparkle s2">✦</span>
      <div class="wish-wrap center-box">
        <h1 class="birthday-heading">happy birthday <span>${SITE_DATA.birthdayName}</span></h1>
        <div class="cake-stage" style="cursor:default">
          <div class="candles">${candlesMarkup(5)}</div>
          <div class="cake-tier tier-top"></div>
          <div class="cake-tier tier-mid"></div>
          <div class="cake-tier tier-base"></div>
          <div class="cake-plate"></div>
        </div>
      </div>`;
    section.querySelectorAll('.candle').forEach(candle => candle.classList.add('out'));
    const next = nextButton('NEXT', 'gifts', 'pill-btn scene-next');
    next.style.position = 'absolute';
    next.style.right = '8%';
    next.style.bottom = '20%';
    section.appendChild(next);
    return section;
  },

  letter() {
    const section = el('section', 'screen red letter-screen');
    section.innerHTML = `
      <div class="letter-stage">
        <article class="letter-card">
          <span class="letter-leaf">🍁</span>
          <h2>${SITE_DATA.letterTitle}</h2>
          <img src="${SITE_DATA.letterPhoto}" alt="Letter photo" />
          <p>${SITE_DATA.letter}</p>
          <span class="letter-flower">🌹</span>
        </article>
      </div>`;
    section.appendChild(nextButton('NEXT', 'gifts', 'pill-btn letter-next'));
    return section;
  },

  final() {
    const section = el('section', 'screen red final-screen');
    section.innerHTML = `
      <div class="final-wrap">
        <div class="film-strip">${SITE_DATA.gallery.map(src => `<img src="${src}" alt="Gallery photo" />`).join('')}</div>
        <div class="envelope-card">
          <div class="final-tag">love you</div>
          <div class="final-note">${SITE_DATA.finalNote}</div>
          <div class="final-heart">♥</div>
        </div>
      </div>`;
    section.appendChild(nextButton('BACK', 'passcode', 'pill-btn back-btn'));
    return section;
  }
};

function updatePassBoxes(section) {
  section.querySelectorAll('.pass-box').forEach((box, index) => {
    box.textContent = passBuffer[index] ? '•' : '';
  });
}

function typeKey(key, section) {
  if (key === '*') {
    passBuffer = '';
    updatePassBoxes(section);
    return;
  }

  if (key === '#') {
    passBuffer = passBuffer.slice(0, -1);
    updatePassBoxes(section);
    return;
  }

  if (passBuffer.length < 4) {
    passBuffer += key;
    updatePassBoxes(section);
  }

  if (passBuffer.length === 4) {
    if (passBuffer === SITE_DATA.passcode) {
      setTimeout(() => setScreen('welcome'), 180);
    } else {
      const panel = section.querySelector('.pass-panel');
      panel.classList.add('shake');
      setTimeout(() => {
        passBuffer = '';
        updatePassBoxes(section);
        panel.classList.remove('shake');
      }, 420);
    }
  }
}

function blowCandles(section, button) {
  section.dataset.blown = 'yes';
  const candles = [...section.querySelectorAll('.candle')];
  const message = section.querySelector('#cakeMessage');

  candles.forEach((candle, index) => {
    const delay = 60 + Math.random() * 240 + index * 30;
    setTimeout(() => candle.classList.add('out'), delay);
  });

  message.textContent = 'Aww... wish made. Tap NEXT ✨';
  button.textContent = 'NEXT';
}

setScreen('passcode');
