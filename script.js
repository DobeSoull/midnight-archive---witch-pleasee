/* ==========================================================================
   THE MIDNIGHT ARCHIVE // MASTER CINEMATIC HORROR ENGINE
   Features:
   - 15-Frame Scroll Scrubbing Engine (Welcome to Derry frames)
   - Live Countdown to Midnight
   - Realistic 3D Floating Red Balloons with Physics Strings & Pop Mechanics
   - Atmospheric Particles, Glowing Red Embers & Fog (Canvas FX)
   - Flashlight Spotlight Cursor
   - Horror Web Audio API Synthesizer (Generative Ambience & SFX)
   - Live Story Search, Filtering & XSS-Safe Storage
   - Pennywise Easter Eggs & Kapidhwaj Innovations Magazine Dossier
   ========================================================================== */

(() => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. LIVE COUNTDOWN TO MIDNIGHT
  // --------------------------------------------------------------------------
  const countdownEl = document.getElementById('midnightCountdown');
  const countdownStatusEl = document.getElementById('midnightStatus');
  const bigHoursEl = document.getElementById('bigTimerHours');
  const bigMinutesEl = document.getElementById('bigTimerMinutes');
  const bigSecondsEl = document.getElementById('bigTimerSeconds');

  function updateMidnightCountdown() {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0); // Next 00:00:00

    const diff = midnight - now;
    if (diff <= 0) {
      if (countdownEl) countdownEl.textContent = "00:00:00";
      if (bigHoursEl) bigHoursEl.textContent = "00";
      if (bigMinutesEl) bigMinutesEl.textContent = "00";
      if (bigSecondsEl) bigSecondsEl.textContent = "00";
      if (countdownStatusEl) countdownStatusEl.textContent = "THE WITCHING HOUR IS HERE // THEY FLOAT";
      return;
    }

    const hours = String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, '0');
    const minutes = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, '0');
    const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');

    if (countdownEl) countdownEl.textContent = `${hours}:${minutes}:${seconds}`;
    if (bigHoursEl) bigHoursEl.textContent = hours;
    if (bigMinutesEl) bigMinutesEl.textContent = minutes;
    if (bigSecondsEl) bigSecondsEl.textContent = seconds;

    if (countdownStatusEl) {
      if (diff < 1000 * 60 * 60) {
        countdownStatusEl.textContent = "⚠️ FINAL HOUR // THE GRATES ARE OPEN";
      } else {
        countdownStatusEl.textContent = "WITCHING HOUR APPROACHES";
      }
    }
  }

  setInterval(updateMidnightCountdown, 1000);
  updateMidnightCountdown();


  // --------------------------------------------------------------------------
  // 2. PROCEDURAL WEB AUDIO API HORROR SYNTHESIZER
  // --------------------------------------------------------------------------
  let audioCtx = null;
  let isAudioPlaying = false;
  let masterGain = null;
  let droneOsc1 = null;
  let droneOsc2 = null;
  let noiseNode = null;

  function initAudio() {
    if (audioCtx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    audioCtx = new AudioContext();

    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);

    // Deep sub-bass horror drone (55Hz and detuned 55.4Hz)
    droneOsc1 = audioCtx.createOscillator();
    droneOsc1.type = 'sawtooth';
    droneOsc1.frequency.setValueAtTime(55, audioCtx.currentTime);

    droneOsc2 = audioCtx.createOscillator();
    droneOsc2.type = 'sine';
    droneOsc2.frequency.setValueAtTime(54.4, audioCtx.currentTime);

    // Filter to keep it dark and oppressive
    const lowpass = audioCtx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(140, audioCtx.currentTime);

    droneOsc1.connect(lowpass);
    droneOsc2.connect(lowpass);
    lowpass.connect(masterGain);

    droneOsc1.start();
    droneOsc2.start();

    // Procedural wind/sewer hiss generator
    const bufferSize = audioCtx.sampleRate * 2;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    noiseNode = audioCtx.createBufferSource();
    noiseNode.buffer = noiseBuffer;
    noiseNode.loop = true;

    const noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(320, audioCtx.currentTime);
    noiseFilter.Q.setValueAtTime(3, audioCtx.currentTime);

    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.06, audioCtx.currentTime);

    noiseNode.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGain);
    noiseNode.start();
  }

  function toggleAudio() {
    const audioBtn = document.getElementById('audioToggleBtn');
    if (!audioCtx) {
      initAudio();
      isAudioPlaying = true;
    } else if (audioCtx.state === 'suspended') {
      audioCtx.resume();
      isAudioPlaying = true;
    } else if (isAudioPlaying) {
      masterGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.2);
      isAudioPlaying = false;
    } else {
      masterGain.gain.setTargetAtTime(0.2, audioCtx.currentTime, 0.2);
      isAudioPlaying = true;
    }

    if (audioBtn) {
      if (isAudioPlaying) {
        audioBtn.classList.add('audio-active');
        audioBtn.innerHTML = `<span class="audio-icon">🔊</span> <span class="audio-label">AMBIENCE: ON</span>`;
      } else {
        audioBtn.classList.remove('audio-active');
        audioBtn.innerHTML = `<span class="audio-icon">🔇</span> <span class="audio-label">AMBIENCE: OFF</span>`;
      }
    }
  }

  const audioToggleBtn = document.getElementById('audioToggleBtn');
  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', toggleAudio);
  }

  // SFX: Balloon Pop
  function playBalloonPopSound() {
    if (!audioCtx || audioCtx.state !== 'running') return;
    try {
      const popOsc = audioCtx.createOscillator();
      const popGain = audioCtx.createGain();
      popOsc.type = 'sine';
      popOsc.frequency.setValueAtTime(240, audioCtx.currentTime);
      popOsc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.12);

      popGain.gain.setValueAtTime(0.5, audioCtx.currentTime);
      popGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);

      popOsc.connect(popGain);
      popGain.connect(audioCtx.destination);

      popOsc.start();
      popOsc.stop(audioCtx.currentTime + 0.14);
    } catch (e) {
      // Ignored if audio permission blocked
    }
  }

  // SFX: Creepy Chime for Easter Eggs & Modal
  function playCreepyChime() {
    if (!audioCtx || audioCtx.state !== 'running') return;
    try {
      const chimeOsc = audioCtx.createOscillator();
      const chimeGain = audioCtx.createGain();
      chimeOsc.type = 'triangle';
      chimeOsc.frequency.setValueAtTime(880, audioCtx.currentTime);
      chimeOsc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.8);

      chimeGain.gain.setValueAtTime(0.25, audioCtx.currentTime);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);

      chimeOsc.connect(chimeGain);
      chimeGain.connect(audioCtx.destination);

      chimeOsc.start();
      chimeOsc.stop(audioCtx.currentTime + 0.85);
    } catch (e) {}
  }


  // --------------------------------------------------------------------------
  // 3. BACKGROUND 15-FRAME SCROLL SCRUBBING ENGINE
  // --------------------------------------------------------------------------
  const frameCanvas = document.getElementById('frame-canvas');
  const frameCtx = frameCanvas ? frameCanvas.getContext('2d', { alpha: false }) : null;
  const progressBar = document.getElementById('scroll-progress-bar');
  const TOTAL_FRAMES = 15;
  const frames = [];
  let loadedFrames = 0;
  let targetProgress = 0;
  let currentProgress = 0;
  const LERP_FACTOR = 0.085;

  if (frameCanvas && frameCtx) {
    // Preload 15 frames from 01 to the end from assets folder
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameNum = String(i + 1).padStart(3, '0');
      img.src = `assets/ezgif-frame-${frameNum}.jpg`;

      img.onload = () => {
        loadedFrames++;
        if (i === 0 || loadedFrames === 1) renderFrame();
      };
      img.onerror = () => {
        console.warn(`Could not load assets/ezgif-frame-${frameNum}.jpg`);
      };
      frames.push(img);
    }

    function resizeFrameCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      frameCanvas.width = Math.floor(window.innerWidth * dpr);
      frameCanvas.height = Math.floor(window.innerHeight * dpr);
      frameCtx.imageSmoothingEnabled = true;
      frameCtx.imageSmoothingQuality = 'high';
      renderFrame();
    }

    window.addEventListener('resize', resizeFrameCanvas);
    resizeFrameCanvas();

    function getLoadedFrame(idx) {
      if (frames[idx] && frames[idx].complete && frames[idx].naturalWidth > 0) return frames[idx];
      for (let i = idx - 1; i >= 0; i--) {
        if (frames[i] && frames[i].complete && frames[i].naturalWidth > 0) return frames[i];
      }
      for (let i = idx + 1; i < TOTAL_FRAMES; i++) {
        if (frames[i] && frames[i].complete && frames[i].naturalWidth > 0) return frames[i];
      }
      return null;
    }

    function drawCoverFrame(img, alpha = 1) {
      if (!img) return;
      frameCtx.save();
      frameCtx.globalAlpha = alpha;

      const cw = frameCanvas.width;
      const ch = frameCanvas.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const canvasRatio = cw / ch;
      const imgRatio = iw / ih;

      let dw, dh, dx, dy;
      if (canvasRatio > imgRatio) {
        dw = cw;
        dh = cw / imgRatio;
        dx = 0;
        dy = (ch - dh) / 2;
      } else {
        dh = ch;
        dw = ch * imgRatio;
        dx = (cw - dw) / 2;
        dy = 0;
      }

      frameCtx.drawImage(img, dx, dy, dw, dh);
      frameCtx.restore();
    }

    function renderFrame() {
      const clamped = Math.max(0, Math.min(1, currentProgress));
      const exactIndex = clamped * (TOTAL_FRAMES - 1);
      const idx1 = Math.floor(exactIndex);
      const idx2 = Math.min(TOTAL_FRAMES - 1, idx1 + 1);
      const blend = exactIndex - idx1;

      const baseImg = getLoadedFrame(idx1);
      if (baseImg) drawCoverFrame(baseImg, 1.0);

      if (blend > 0.001 && idx1 !== idx2) {
        const nextImg = getLoadedFrame(idx2);
        if (nextImg && nextImg !== baseImg) {
          drawCoverFrame(nextImg, blend);
        }
      }

      if (progressBar) {
        progressBar.style.width = (clamped * 100).toFixed(2) + '%';
      }
    }

    function updateTargetScrollProgress() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      const scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
      const maxScroll = scrollHeight - window.innerHeight;
      targetProgress = maxScroll > 0 ? Math.max(0, Math.min(1, scrollTop / maxScroll)) : 0;
    }

    window.addEventListener('scroll', updateTargetScrollProgress, { passive: true });

    function scrollAnimLoop() {
      updateTargetScrollProgress();
      const diff = targetProgress - currentProgress;
      if (Math.abs(diff) > 0.0001) {
        currentProgress += diff * LERP_FACTOR;
        renderFrame();
      } else if (currentProgress !== targetProgress) {
        currentProgress = targetProgress;
        renderFrame();
      }
      requestAnimationFrame(scrollAnimLoop);
    }
    requestAnimationFrame(scrollAnimLoop);
  }


  // --------------------------------------------------------------------------
  // 4. ATMOSPHERIC PARTICLES, DUST & FOG (FX CANVAS)
  // --------------------------------------------------------------------------
  const fxCanvas = document.getElementById('fx-canvas');
  const fxCtx = fxCanvas ? fxCanvas.getContext('2d') : null;
  let particles = [];
  const PARTICLE_COUNT = 38;

  function resizeFxCanvas() {
    if (!fxCanvas) return;
    fxCanvas.width = window.innerWidth;
    fxCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeFxCanvas);
  resizeFxCanvas();

  class AtmosphericParticle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * window.innerWidth;
      this.y = initial ? Math.random() * window.innerHeight : window.innerHeight + 10;
      this.size = Math.random() * 2.2 + 0.6;
      this.speedY = -(Math.random() * 0.45 + 0.15);
      this.speedX = Math.sin(Math.random() * Math.PI) * 0.25;
      this.isRedEmber = Math.random() < 0.28; // 28% are glowing red Derry embers
      this.alpha = Math.random() * 0.6 + 0.2;
      this.fadeSpeed = Math.random() * 0.005 + 0.002;
      this.fadeIn = true;
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.y * 0.01) * 0.2;

      if (this.fadeIn) {
        this.alpha += this.fadeSpeed;
        if (this.alpha >= 0.7) this.fadeIn = false;
      } else {
        this.alpha -= this.fadeSpeed;
        if (this.alpha <= 0.1) this.fadeIn = true;
      }

      if (this.y < -10 || this.x < -10 || this.x > window.innerWidth + 10) {
        this.reset();
      }
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, this.alpha));
      if (this.isRedEmber) {
        ctx.fillStyle = '#ff2233';
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#ff2233';
      } else {
        ctx.fillStyle = '#c5c2cc';
        ctx.shadowBlur = 0;
      }
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  if (fxCtx) {
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new AtmosphericParticle());
    }

    let fogOffset = 0;
    function renderFx() {
      if (document.hidden) {
        requestAnimationFrame(renderFx);
        return;
      }

      fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);

      // Low-lying drifting volumetric fog near bottom
      fogOffset += 0.0015;
      const grad = fxCtx.createLinearGradient(0, fxCanvas.height - 240, 0, fxCanvas.height);
      grad.addColorStop(0, 'rgba(18, 12, 16, 0)');
      grad.addColorStop(0.5, 'rgba(18, 10, 14, 0.25)');
      grad.addColorStop(1, 'rgba(9, 7, 7, 0.65)');
      fxCtx.fillStyle = grad;
      fxCtx.fillRect(0, fxCanvas.height - 240, fxCanvas.width, 240);

      // Particles
      particles.forEach(p => {
        p.update();
        p.draw(fxCtx);
      });

      requestAnimationFrame(renderFx);
    }
    requestAnimationFrame(renderFx);
  }

  // Atmospheric lightning / flickering light
  const screenGlitchFlash = document.getElementById('screen-glitch-flash');
  function triggerAtmosphericFlicker() {
    if (!screenGlitchFlash) return;
    screenGlitchFlash.classList.add('flash-active');
    setTimeout(() => {
      screenGlitchFlash.classList.remove('flash-active');
      setTimeout(() => {
        screenGlitchFlash.classList.add('flash-active');
        setTimeout(() => screenGlitchFlash.classList.remove('flash-active'), 50);
      }, 70);
    }, 80);

    const nextInterval = Math.random() * 20000 + 15000;
    setTimeout(triggerAtmosphericFlicker, nextInterval);
  }
  setTimeout(triggerAtmosphericFlicker, 14000);


  // --------------------------------------------------------------------------
  // 5. CINEMATIC FLASHLIGHT SPOTLIGHT CURSOR
  // --------------------------------------------------------------------------
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let curMouseX = mouseX;
  let curMouseY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function updateFlashlight() {
    curMouseX += (mouseX - curMouseX) * 0.15;
    curMouseY += (mouseY - curMouseY) * 0.15;
    document.documentElement.style.setProperty('--mouse-x', `${curMouseX.toFixed(1)}px`);
    document.documentElement.style.setProperty('--mouse-y', `${curMouseY.toFixed(1)}px`);
    requestAnimationFrame(updateFlashlight);
  }
  requestAnimationFrame(updateFlashlight);


  // --------------------------------------------------------------------------
  // 6. REALISTIC 3D FLOATING RED BALLOONS ENGINE
  // --------------------------------------------------------------------------
  const balloonsContainer = document.getElementById('balloons-container');
  const BALLOON_COUNT = 6;
  const balloons = [];

  const pennywiseWhispers = [
    { title: "A VOICE FROM THE DRAIN...", text: "\"We all float down here, Georgie... and when you're down here with me, YOU'LL FLOAT TOO!\"" },
    { title: "THE SEWER WHISPER...", text: "\"Take it, Georgie... it smells like cotton candy and popcorn, doesn't it?\"" },
    { title: "ECHOES OF 1988...", text: "\"Did you think a 27-year slumber meant I was gone? I've been feeding beneath Derry.\"" },
    { title: "A FAMILIAR LAUGH...", text: "\"Beep beep, Richie! Everyone floats... and you are next.\"" },
    { title: "CHAMBERS BENEATH NEIBOLT...", text: "\"You can feel the string in your fingers, can't you? Let go... or join us down here.\"" }
  ];

  class FloatingBalloon {
    constructor(index) {
      this.index = index;
      this.element = null;
      this.stringPath = null;
      this.width = 46 + Math.random() * 28; // scale 46px - 74px
      this.height = this.width * 1.25;
      this.scale = this.width / 60;
      this.speed = 0.4 + Math.random() * 0.45;
      this.swaySpeed = 0.018 + Math.random() * 0.015;
      this.swayAngle = Math.random() * Math.PI * 2;
      this.swayRange = 25 + Math.random() * 35;
      this.x = Math.random() * (window.innerWidth - 100) + 40;
      this.y = window.innerHeight + Math.random() * 400 + 80;
      this.parallaxFactor = (this.scale - 0.7) * 0.04;
      this.isPopped = false;

      this.createDOM();
    }

    createDOM() {
      const el = document.createElement('div');
      el.className = 'balloon-element';
      el.style.width = `${this.width}px`;
      el.style.height = `${this.height + 85}px`; // body + string

      // Balloon Body
      const body = document.createElement('div');
      body.className = 'balloon-body';
      body.style.width = `${this.width}px`;
      body.style.height = `${this.height}px`;

      // Knot
      const knot = document.createElement('div');
      knot.className = 'balloon-knot';

      // SVG String with physics wave
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'balloon-string-svg');
      svg.setAttribute('width', `${this.width}`);
      svg.setAttribute('height', '95');
      svg.setAttribute('viewBox', '0 0 50 95');

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M25,0 Q28,25 25,50 T25,95');
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', '#a02028');
      path.setAttribute('stroke-width', '1.3');
      path.setAttribute('stroke-opacity', '0.7');

      svg.appendChild(path);
      this.stringPath = path;

      el.appendChild(body);
      el.appendChild(knot);
      el.appendChild(svg);

      // Click Balloon -> Pop & Pennywise whisper
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        this.pop();
      });

      if (balloonsContainer) {
        balloonsContainer.appendChild(el);
      }
      this.element = el;
    }

    pop() {
      if (this.isPopped) return;
      this.isPopped = true;
      this.element.classList.add('balloon-popping');
      playBalloonPopSound();

      // Show Pennywise whisper dialogue
      const randomWhisper = pennywiseWhispers[Math.floor(Math.random() * pennywiseWhispers.length)];
      showWhisperModal(randomWhisper.title, randomWhisper.text);

      // Respawn after 4.5 seconds
      setTimeout(() => {
        this.reset();
      }, 4500);
    }

    reset() {
      this.isPopped = false;
      this.element.classList.remove('balloon-popping');
      this.y = window.innerHeight + 100 + Math.random() * 200;
      this.x = Math.random() * (window.innerWidth - 120) + 40;
    }

    update() {
      if (this.isPopped) return;

      this.y -= this.speed;
      this.swayAngle += this.swaySpeed;

      // Sine wave swaying string physics
      const swayX = Math.sin(this.swayAngle) * this.swayRange;
      const mouseParallaxX = (mouseX - window.innerWidth / 2) * this.parallaxFactor;

      const currentX = this.x + swayX + mouseParallaxX;
      this.element.style.transform = `translate3d(${currentX}px, ${this.y}px, 0) rotate(${Math.sin(this.swayAngle) * 5}deg)`;

      // Dynamic curve on the string
      if (this.stringPath) {
        const c1 = 25 + Math.sin(this.swayAngle * 1.5) * 8;
        const c2 = 25 - Math.sin(this.swayAngle * 1.5) * 6;
        this.stringPath.setAttribute('d', `M25,0 Q${c1},25 25,50 T${c2},95`);
      }

      // Loop back when floating above top
      if (this.y < -(this.height + 140)) {
        this.reset();
      }
    }
  }

  if (balloonsContainer) {
    for (let i = 0; i < BALLOON_COUNT; i++) {
      balloons.push(new FloatingBalloon(i));
    }

    function animateBalloons() {
      if (!document.hidden) {
        balloons.forEach(b => b.update());
      }
      requestAnimationFrame(animateBalloons);
    }
    requestAnimationFrame(animateBalloons);
  }

  // Whisper Modal Trigger
  const whisperModal = document.getElementById('whisperModal');
  const whisperTitle = document.getElementById('whisperTitle');
  const whisperMessage = document.getElementById('whisperMessage');
  const closeWhisperBtn = document.getElementById('closeWhisperBtn');

  function showWhisperModal(title, msg) {
    if (!whisperModal) return;
    if (whisperTitle) whisperTitle.textContent = title;
    if (whisperMessage) whisperMessage.textContent = msg;
    whisperModal.style.display = 'flex';
    playCreepyChime();
  }

  if (closeWhisperBtn) {
    closeWhisperBtn.addEventListener('click', () => {
      whisperModal.style.display = 'none';
    });
  }

  if (whisperModal) {
    whisperModal.addEventListener('click', (e) => {
      if (e.target === whisperModal) whisperModal.style.display = 'none';
    });
  }


  // --------------------------------------------------------------------------
  // 7. EASTER EGG: S.S. GEORGIE PAPER BOAT
  // --------------------------------------------------------------------------
  const easterEggBoat = document.getElementById('easterEggBoat');
  if (easterEggBoat) {
    easterEggBoat.addEventListener('click', () => {
      showWhisperModal(
        "FOUND NEAR THE WITCHAM STREET STORM DRAIN...",
        "\"The S.S. Georgie... made with paraffin wax and an old Derry newspaper. You see him down there, Georgie? Big eyes... smiling teeth... holding your boat.\""
      );
    });
  }


  // --------------------------------------------------------------------------
  // 8. FEAR STORIES REGISTRY PLATFORM WITH SEARCH & CATEGORIES
  // --------------------------------------------------------------------------
  const defaultStories = [
    {
      id: 101,
      title: "The Sewer Frequency of Derry: The Kapidhwaj Incident",
      category: "Derry Lore",
      author: "@kapidhwaj.innovations",
      snippet: "During our storm drain signal spectrum audit, a 27.9 MHz harmonic was intercepted. It wasn't radio noise... it was children singing in unison beneath the cistern...",
      content: "During our storm drain signal spectrum audit in Derry, a 27.9 MHz harmonic was intercepted by Kapidhwaj Innovations telemetry rigs. It wasn't standard electromagnetic noise. It was structured binary pulses that decoded into an audio feed of rhythmic carnival chimes and whispering voices. When our automated probe reached cistern depth 40 feet below Witcham Street, camera sensors captured a solitary crimson balloon tethered to an iron ladder. Acoustic analysis registered a gravelly voice: 'Did Kapidhwaj bring new playmates down here?' Our equipment was forcibly severed seconds later. Follow our findings on Instagram at @kapidhwaj.innovations."
    },
    {
      id: 1,
      title: "The Mirror That Didn't Blink",
      category: "Paranormal",
      author: "Anonymous #4921",
      snippet: "I woke up at 3:00 AM and noticed my reflection in the vanity mirror was standing half a second slower than I was...",
      content: "I woke up at 3:00 AM and noticed my reflection in the vanity mirror was standing half a second slower than I was. When I raised my right hand to brush my hair back, the reflection kept its arms folded by its side for an agonizingly long beat before mimicking the motion with a wide, unnatural grin. I haven't looked into a mirror since, but every time I walk past glass windows in the dark, I can feel eyes tracking my spine."
    },
    {
      id: 2,
      title: "Static on Channel 13",
      category: "Sci-Fi Horror",
      author: "Watcher_Zero",
      snippet: "Our television picked up an emergency broadcast from our exact street address—dated three days into the future...",
      content: "Our television picked up an emergency broadcast from our exact street address—dated three days into the future. The news anchor was calmly reporting a total household disappearance, describing my wife and me down to what we were wearing. The scariest part wasn't the date; it was hearing my own voice in the background audio recording telling the operators not to look inside the basement."
    },
    {
      id: 3,
      title: "The Whistling Tunnel",
      category: "Urban Legend",
      author: "Anonymous #1102",
      snippet: "They say if someone whistles back inside the old railway tunnel, you'll feel cold breath on your neck until sunrise...",
      content: "They say if someone whistles back inside the old railway tunnel, you'll feel cold breath on your neck until sunrise. Being skeptics, my friends and I tested it on Halloween night. A faint, low whistle answered back from deep within the brickwork. It wasn't an echo. It was right beside us, whispering the names of everyone in our car, one by one."
    },
    {
      id: 4,
      title: "The Second Floor That Shouldn't Exist",
      category: "Psychological",
      author: "Anonymous #8830",
      snippet: "I lived in my apartment for two years before finding a narrow door behind the pantry that led to a staircase going up...",
      content: "I lived in my apartment for two years before finding a narrow door behind the pantry that led to a staircase going up. The room upstairs was identical to mine, except every single calendar on the wall was turned to October 31, 2019—and all the clocks had their hands violently bent backward. When I tried to leave, the door at the bottom of the stairs opened into an empty brick wall."
    },
    {
      id: 5,
      title: "Footsteps in the Attic Crawlspace",
      category: "Paranormal",
      author: "Anonymous #3319",
      snippet: "The scratching started small. Then it sounded like heavy boots dragging across wooden ceiling joists...",
      content: "The scratching started small. Then it sounded like heavy boots dragging across wooden ceiling joists directly above my bed. My landlord insisted there was no attic crawlspace in this building. Last night, I pushed against the drywall ceiling, and something pushed back with cold, wet fingernails."
    },
    {
      id: 6,
      title: "The Smart Speaker's Secret Command",
      category: "Sci-Fi Horror",
      author: "Anonymous #0044",
      snippet: "At midnight, the smart speaker in the kitchen activated itself and played a recording of me talking in my sleep...",
      content: "At midnight, the smart speaker in the kitchen activated itself and played a recording of me talking in my sleep—except I never said those words. It was playing a conversation between me and someone else standing right beside my bed asking where I hid the spare keys."
    }
  ];

  let stories = defaultStories;
  let savedVault = JSON.parse(localStorage.getItem('midnight_vault')) || [];
  let currentActiveFilter = 'all';
  let currentSearchQuery = '';

  const storyGrid = document.getElementById('storyGrid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const storySearchInput = document.getElementById('storySearch');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const storyForm = document.getElementById('storyForm');
  const vaultGrid = document.getElementById('vaultGrid');
  const vaultCountEl = document.getElementById('vault-count');

  // Modal Elements
  const storyModal = document.getElementById('storyModal');
  const closeModalBtn = storyModal ? storyModal.querySelector('.close-modal') : null;
  const modalCategory = document.getElementById('modalCategory');
  const modalTitle = document.getElementById('modalTitle');
  const modalAuthor = document.getElementById('modalAuthor');
  const modalBody = document.getElementById('modalBody');
  const modalSaveBtn = document.getElementById('modalSaveBtn');
  let currentActiveStory = null;

  // Safe DOM Rendering for Stories (XSS-Safe)
  function renderStories() {
    if (!storyGrid) return;
    storyGrid.innerHTML = '';

    const filtered = stories.filter(story => {
      const matchesFilter = currentActiveFilter === 'all' ||
        story.category.toLowerCase() === currentActiveFilter.toLowerCase();

      const q = currentSearchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        story.title.toLowerCase().includes(q) ||
        story.author.toLowerCase().includes(q) ||
        story.category.toLowerCase().includes(q) ||
        story.snippet.toLowerCase().includes(q);

      return matchesFilter && matchesSearch;
    });

    if (filtered.length === 0) {
      const emptyEl = document.createElement('p');
      emptyEl.className = 'empty-vault-msg';
      emptyEl.textContent = 'No terrors found lingering in this category or search query.';
      storyGrid.appendChild(emptyEl);
      return;
    }

    filtered.forEach(story => {
      const card = document.createElement('div');
      card.className = 'story-card';

      const topContent = document.createElement('div');

      const tag = document.createElement('span');
      tag.className = 'card-tag';
      tag.textContent = story.category;

      const title = document.createElement('h3');
      title.textContent = story.title;

      const snippet = document.createElement('p');
      snippet.textContent = story.snippet;

      topContent.appendChild(tag);
      topContent.appendChild(title);
      topContent.appendChild(snippet);

      const footer = document.createElement('div');
      footer.className = 'card-footer-info';

      const authorSpan = document.createElement('span');
      authorSpan.textContent = story.author;

      const readBtn = document.createElement('button');
      readBtn.className = 'btn-read-more';
      readBtn.innerHTML = 'Read Account &rarr;';
      readBtn.addEventListener('click', () => {
        openStoryModal(story.title, story.category, story.author, story.content, story.id);
      });

      footer.appendChild(authorSpan);
      footer.appendChild(readBtn);

      card.appendChild(topContent);
      card.appendChild(footer);

      storyGrid.appendChild(card);
    });
  }

  // Live Story Search
  if (storySearchInput) {
    storySearchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value;
      if (clearSearchBtn) {
        clearSearchBtn.style.display = currentSearchQuery ? 'block' : 'none';
      }
      renderStories();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      if (storySearchInput) {
        storySearchInput.value = '';
        currentSearchQuery = '';
        clearSearchBtn.style.display = 'none';
        renderStories();
      }
    });
  }

  // Category Filter Pills
  if (filterBtns) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentActiveFilter = btn.getAttribute('data-filter');
        renderStories();
      });
    });
  }

  // Story Reader Modal Controls
  window.openStoryModal = function(title, category, author, content, id = null) {
    if (!storyModal) return;

    if (modalTitle) modalTitle.textContent = title;
    if (modalCategory) modalCategory.textContent = category;
    if (modalAuthor) modalAuthor.textContent = `Recorded by: ${author}`;
    if (modalBody) modalBody.textContent = content;

    currentActiveStory = {
      id: id || Date.now(),
      title,
      category,
      author,
      snippet: content.substring(0, 95) + '...',
      content
    };

    updateSaveButtonState();
    storyModal.style.display = 'flex';
    playCreepyChime();
  };

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      storyModal.style.display = 'none';
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === storyModal) storyModal.style.display = 'none';
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (storyModal) storyModal.style.display = 'none';
      const kapModal = document.getElementById('kapidhwajModal');
      if (kapModal) kapModal.style.display = 'none';
    }
  });

  // Vault Management
  function updateSaveButtonState() {
    if (!modalSaveBtn || !currentActiveStory) return;
    const exists = savedVault.some(s => s.title === currentActiveStory.title);
    if (exists) {
      modalSaveBtn.textContent = "✔️ Saved in Your Vault";
      modalSaveBtn.style.background = "#28a745";
    } else {
      modalSaveBtn.textContent = "💾 Save to My Vault";
      modalSaveBtn.style.background = "";
    }
  }

  if (modalSaveBtn) {
    modalSaveBtn.addEventListener('click', () => {
      if (!currentActiveStory) return;
      const existsIndex = savedVault.findIndex(s => s.title === currentActiveStory.title);
      if (existsIndex > -1) {
        savedVault.splice(existsIndex, 1);
      } else {
        savedVault.push(currentActiveStory);
      }
      localStorage.setItem('midnight_vault', JSON.stringify(savedVault));
      updateSaveButtonState();
      renderVault();
    });
  }

  function renderVault() {
    if (!vaultGrid) return;
    vaultGrid.innerHTML = '';
    if (vaultCountEl) vaultCountEl.textContent = savedVault.length;

    if (savedVault.length === 0) {
      const msg = document.createElement('p');
      msg.className = 'empty-vault-msg';
      msg.textContent = 'Your vault is currently empty. Save stories from the registry to build your collection.';
      vaultGrid.appendChild(msg);
      return;
    }

    savedVault.forEach((story, index) => {
      const card = document.createElement('div');
      card.className = 'story-card';

      const top = document.createElement('div');
      const tag = document.createElement('span');
      tag.className = 'card-tag';
      tag.textContent = `SAVED // ${story.category}`;

      const title = document.createElement('h3');
      title.textContent = story.title;

      const snippet = document.createElement('p');
      snippet.textContent = story.snippet;

      top.appendChild(tag);
      top.appendChild(title);
      top.appendChild(snippet);

      const footer = document.createElement('div');
      footer.className = 'card-footer-info';

      const readAgainBtn = document.createElement('button');
      readAgainBtn.className = 'btn-read-more';
      readAgainBtn.textContent = 'Read Again';
      readAgainBtn.addEventListener('click', () => {
        openStoryModal(story.title, story.category, story.author, story.content, story.id);
      });

      const removeBtn = document.createElement('button');
      removeBtn.className = 'btn-read-more';
      removeBtn.style.color = '#ff5566';
      removeBtn.textContent = 'Remove';
      removeBtn.addEventListener('click', () => {
        savedVault.splice(index, 1);
        localStorage.setItem('midnight_vault', JSON.stringify(savedVault));
        renderVault();
        if (currentActiveStory) updateSaveButtonState();
      });

      footer.appendChild(readAgainBtn);
      footer.appendChild(removeBtn);

      card.appendChild(top);
      card.appendChild(footer);
      vaultGrid.appendChild(card);
    });
  }

  // Anonymous Story Submission (Safe, Sanitized)
  if (storyForm) {
    storyForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const titleInput = document.getElementById('storyTitle');
      const catInput = document.getElementById('storyCategory');
      const aliasInput = document.getElementById('authorAlias');
      const contentInput = document.getElementById('storyContent');

      const title = titleInput ? titleInput.value.trim() : '';
      const category = catInput ? catInput.value : 'Paranormal';
      let alias = aliasInput ? aliasInput.value.trim() : '';
      const content = contentInput ? contentInput.value.trim() : '';

      if (!title || !content) return;

      if (!alias) {
        const rand = Math.floor(1000 + Math.random() * 9000);
        alias = `Anonymous #${rand}`;
      }

      const newStory = {
        id: Date.now(),
        title,
        category,
        author: alias,
        snippet: content.substring(0, 95) + '...',
        content
      };

      stories.unshift(newStory);
      renderStories();
      storyForm.reset();

      showWhisperModal(
        "TRANSMISSION SEALED INTO THE ARCHIVE",
        `Your nightmare "${title}" has been transmitted to the Midnight Archive. It now lingers for all who dare enter.`
      );

      const storiesSection = document.getElementById('stories');
      if (storiesSection) {
        storiesSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }


  // --------------------------------------------------------------------------
  // 9. KAPIDHWAJ INNOVATIONS MAGAZINE SPREAD MODAL
  // --------------------------------------------------------------------------
  const kapidhwajModal = document.getElementById('kapidhwajModal');
  const closeKapidhwajModalBtn = document.getElementById('closeKapidhwajModal');

  window.openKapidhwajMagazine = function() {
    if (!kapidhwajModal) return;
    kapidhwajModal.style.display = 'flex';
    playCreepyChime();
  };

  if (closeKapidhwajModalBtn) {
    closeKapidhwajModalBtn.addEventListener('click', () => {
      kapidhwajModal.style.display = 'none';
    });
  }

  if (kapidhwajModal) {
    kapidhwajModal.addEventListener('click', (e) => {
      if (e.target === kapidhwajModal) kapidhwajModal.style.display = 'none';
    });
  }

  // Initial Platform Render
  renderStories();
  renderVault();

})();
