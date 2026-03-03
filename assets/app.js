"use strict";

/***********************
 * CONFIG (EDIT INI)
 ***********************/
const CONFIG = {
  wifeName: "Delia Devita",
  message: `Happy birthday, my love.

Thank you for being the most comfortable place I can call home.
I hope today you feel truly loved, appreciated, and spoiled.
I pray that you stay healthy, happy, and that everything you wish for comes true, little by little.

I love you, always.`,

  photos: [
    "assets/photos/1.jpg",
    "assets/photos/2.jpg",
    "assets/photos/3.jpg",
    "assets/photos/4.jpg",
    "assets/photos/5.jpg",
    "assets/photos/6.jpg",
    "assets/photos/7.jpg",
  ],

  video: "assets/videos/video.mp4",
  music: "assets/music.mp3",

  siteTitle: "For Delia Devita",

  // Kalau mau override manual subtitle, isi string.
  // Kalau kosong, subtitle akan otomatis mengikuti TARGET jam.
  siteSubtitle: "",

  heroTitleLocked: "Tunggu sebentar ya…",
  heroTitleUnlocked: "Happy Birthday!",
  heroDescLocked:
    "Website ini akan terbuka otomatis saat waktu target. Begitu kebuka, ada foto-foto, video, dan pesan rahasia.",
  heroDescUnlocked:
    "Ini versi kecil dari rasa sayang yang besar. Scroll pelan-pelan, nikmati ya.",
};

/***********************
 * TIME LOCK (TANGGAL FIX)
 * Ubah TARGET di bawah ini sesuai tanggal/jam yang Anda mau.
 ***********************/
const TARGET = {
  year: 2027,
  month: 1, // 1-12
  day: 13, // 1-31
  hour: 0, // 0-23
  minute: 0, // 0-59
};

/***********************
 * Utils
 ***********************/
function pad2(n) {
  return String(n).padStart(2, "0");
}

function getTargetFixed() {
  return new Date(
    TARGET.year,
    TARGET.month - 1,
    TARGET.day,
    TARGET.hour,
    TARGET.minute,
    0,
    0,
  );
}

function formatTimeHHMM(d) {
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

/***********************
 * DOM
 ***********************/
const els = {
  body: document.body,
  siteTitle: document.getElementById("siteTitle"),
  siteSubtitle: document.getElementById("siteSubtitle"),
  heroTitle: document.getElementById("heroTitle"),
  heroDesc: document.getElementById("heroDesc"),
  dd: document.getElementById("dd"),
  hh: document.getElementById("hh"),
  mm: document.getElementById("mm"),
  ss: document.getElementById("ss"),
  targetInfo: document.getElementById("targetInfo"),
  lockText: document.getElementById("lockText"),
  openText: document.getElementById("openText"),
  teaserMessage: document.getElementById("teaserMessage"),
  mainMessage: document.getElementById("mainMessage"),
  gallery: document.getElementById("gallery"),
  modal: document.getElementById("modal"),
  modalImg: document.getElementById("modalImg"),
  modalLabel: document.getElementById("modalLabel"),
  closeModal: document.getElementById("closeModal"),
  previewBtn: document.getElementById("previewBtn"),
  confettiBtn: document.getElementById("confettiBtn"),
  muteBtn: document.getElementById("muteBtn"),
  muteBtn2: document.getElementById("muteBtn2"),
  video: document.getElementById("video"),
  bgm: document.getElementById("bgm"),
};

/***********************
 * State
 ***********************/
const target = getTargetFixed();
let musicOn = false;

/***********************
 * UI Text / Media setup
 ***********************/
function applyConfigToUI() {
  els.siteTitle.textContent = CONFIG.siteTitle;
  els.mainMessage.textContent = CONFIG.message;

  // subtitle: manual override kalau diisi, kalau tidak auto dari jam target
  if (CONFIG.siteSubtitle && CONFIG.siteSubtitle.trim().length > 0) {
    els.siteSubtitle.textContent = CONFIG.siteSubtitle.trim();
  } else {
    els.siteSubtitle.textContent = `There’s something special waiting for you — it unlocks right at ${formatTimeHHMM(
      target,
    )}`;
  }

  // target info: tanggal bulan tahun + jam
  els.targetInfo.textContent = `Target: ${target.toLocaleString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })}`;

  // video
  if (CONFIG.video) {
    const src = document.createElement("source");
    src.src = CONFIG.video;
    src.type = "video/mp4";
    els.video.appendChild(src);
    els.video.muted = true;
    els.video.volume = 0;
  }

  // music
  if (CONFIG.music) {
    els.bgm.src = CONFIG.music;
  }
}

/***********************
 * Locked / Unlocked UI
 ***********************/
function setLockedUI() {
  els.body.classList.add("locked");
  els.body.classList.remove("unlocked");
  els.heroTitle.textContent = CONFIG.heroTitleLocked;
  els.heroDesc.textContent = CONFIG.heroDescLocked;
}

function setUnlockedUI() {
  els.body.classList.remove("locked");
  els.body.classList.add("unlocked");
  els.heroTitle.textContent = CONFIG.heroTitleUnlocked;
  els.heroDesc.textContent = CONFIG.heroDescUnlocked;
  runConfetti(2200);
}

/***********************
 * Countdown
 ***********************/
function updateCountdown() {
  const now = new Date();
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) {
    els.dd.textContent = "00";
    els.hh.textContent = "00";
    els.mm.textContent = "00";
    els.ss.textContent = "00";
    setUnlockedUI();
    return true;
  }

  const sec = Math.floor(diff / 1000);
  const days = Math.floor(sec / (3600 * 24));
  const hours = Math.floor((sec % (3600 * 24)) / 3600);
  const mins = Math.floor((sec % 3600) / 60);
  const secs = sec % 60;

  els.dd.textContent = pad2(days);
  els.hh.textContent = pad2(hours);
  els.mm.textContent = pad2(mins);
  els.ss.textContent = pad2(secs);

  setLockedUI();
  return false;
}

/***********************
 * Gallery
 ***********************/
function buildGallery() {
  els.gallery.innerHTML = "";
  CONFIG.photos.forEach((p, idx) => {
    const div = document.createElement("div");
    div.className = "thumb";

    const img = document.createElement("img");
    img.loading = "lazy";
    img.alt = `Photo ${idx + 1}`;
    img.src = p;

    div.appendChild(img);
    div.addEventListener("click", () => openModal(p, `Foto ${idx + 1}`));
    els.gallery.appendChild(div);
  });
}

/***********************
 * Modal
 ***********************/
function openModal(src, label) {
  els.modalLabel.textContent = label;
  els.modalImg.src = src;
  els.modal.classList.add("open");
}

function closeModal() {
  els.modal.classList.remove("open");
  els.modalImg.src = "";
}

function initModalHandlers() {
  els.closeModal.addEventListener("click", closeModal);

  els.modal.addEventListener("click", (e) => {
    if (e.target === els.modal) closeModal();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

/***********************
 * Music
 ***********************/
async function toggleMusic() {
  if (!CONFIG.music) return;

  try {
    if (!musicOn) {
      await els.bgm.play(); // butuh user gesture (button click)
      musicOn = true;
    } else {
      els.bgm.pause();
      musicOn = false;
    }
  } catch {
    musicOn = false;
  }
  syncMusicButtons();
}

function syncMusicButtons() {
  const label = musicOn ? "Musik: On" : "Musik: Off";
  if (els.muteBtn) els.muteBtn.textContent = label;
  if (els.muteBtn2) els.muteBtn2.textContent = label;
}

function initMusicHandlers() {
  toggleMusic(); // for play first
  if (els.muteBtn) els.muteBtn.addEventListener("click", toggleMusic);
  if (els.muteBtn2) els.muteBtn2.addEventListener("click", toggleMusic);
}

/***********************
 * Preview mode
 ***********************/
function initPreviewHandler() {
  if (!els.previewBtn) return;

  els.previewBtn.addEventListener("click", () => {
    buildGallery();

    // buka tampilan sementara
    els.body.classList.add("unlocked");
    els.body.classList.remove("locked");
    els.heroTitle.textContent = "Preview tampilan (bukan buka kunci)";
    els.heroDesc.textContent =
      "Ini hanya preview untuk cek layout foto & video. Akan balik terkunci otomatis.";

    setTimeout(() => {
      updateCountdown();
    }, 5000);
  });
}

/***********************
 * Confetti
 ***********************/
const conf = {
  canvas: document.getElementById("confetti"),
  ctx: null,
  w: 0,
  h: 0,
  pieces: [],
  running: false,
  tEnd: 0,
};

function resizeConfetti() {
  conf.w = conf.canvas.width = window.innerWidth * devicePixelRatio;
  conf.h = conf.canvas.height = window.innerHeight * devicePixelRatio;
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function spawnPieces(count) {
  for (let i = 0; i < count; i++) {
    conf.pieces.push({
      x: rand(0, conf.w),
      y: rand(-conf.h * 0.2, 0),
      vx: rand(-1.2, 1.2) * devicePixelRatio,
      vy: rand(2.0, 5.8) * devicePixelRatio,
      s: rand(6, 14) * devicePixelRatio,
      r: rand(0, Math.PI * 2),
      vr: rand(-0.18, 0.18),
      a: rand(0.75, 1.0),
      c: [
        "rgba(255,94,168,0.9)",
        "rgba(124,77,255,0.9)",
        "rgba(52,211,153,0.9)",
        "rgba(255,255,255,0.85)",
      ][Math.floor(rand(0, 4))],
    });
  }
}

function runConfetti(ms = 1800) {
  if (!conf.ctx) conf.ctx = conf.canvas.getContext("2d");
  resizeConfetti();
  spawnPieces(120);
  conf.running = true;
  conf.tEnd = performance.now() + ms;
  requestAnimationFrame(tickConfetti);
}

function tickConfetti(t) {
  if (!conf.running) return;
  const ctx = conf.ctx;
  ctx.clearRect(0, 0, conf.w, conf.h);

  conf.pieces.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.r += p.vr;
    p.vy *= 1.005;
    p.vx *= 0.999;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.r);
    ctx.globalAlpha = p.a;
    ctx.fillStyle = p.c;
    ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6);
    ctx.restore();
  });

  conf.pieces = conf.pieces.filter(
    (p) => p.y < conf.h + p.s && p.x > -100 && p.x < conf.w + 100,
  );

  if (t < conf.tEnd || conf.pieces.length > 0) {
    requestAnimationFrame(tickConfetti);
  } else {
    conf.running = false;
    conf.pieces = [];
  }
}

function initConfettiHandlers() {
  window.addEventListener("resize", resizeConfetti);
  if (els.confettiBtn) els.confettiBtn.addEventListener("click", () => runConfetti(2400));
}

/***********************
 * Init
 ***********************/
function main() {
  applyConfigToUI();
  buildGallery();
  initModalHandlers();
  initMusicHandlers();
  initPreviewHandler();
  initConfettiHandlers();
  syncMusicButtons();

  // countdown loop
  updateCountdown();
  const timer = setInterval(() => {
    const opened = updateCountdown();
    if (opened) {
      clearInterval(timer);
      buildGallery();
    }
  }, 250);
}

main();
