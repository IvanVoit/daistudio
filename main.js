/* =========================================================
   DAI STUDIO — JavaScript principal
   ========================================================= */

/* ---------- Datos de los juegos ---------- */
const GAMES = {
  "neon-drift": {
    title: "Neon Drift",
    genre: "carreras",
    meta: "Carreras arcade · PC · PS5 · Xbox Series",
    price: "19,99 €",
    img: "images/juegos/neon-drift.svg",
    desc: "Derrapa por una Barcelona futurista donde cada curva suena a synthwave. Más de 40 circuitos, modo historia con 5 pilotos rivales y multijugador online hasta 8 jugadores.",
    tags: ["Un jugador", "Multijugador online", "Mando recomendado", "PEGI 7"],
    status: "Más vendido"
  },
  "verdant": {
    title: "Verdant: El Último Bosque",
    genre: "aventura",
    meta: "Aventura narrativa · PC · Switch",
    price: "24,99 €",
    img: "images/juegos/verdant.svg",
    desc: "Eres la guardiana del último bosque del planeta. Explora, cuida el ecosistema y descubre por qué las ciudades se apagaron. Una historia sobre la sostenibilidad contada con un estilo low-poly único.",
    tags: ["Un jugador", "Historia", "Mundo abierto", "PEGI 12"],
    status: "Disponible"
  },
  "pixel-rebels": {
    title: "Pixel Rebels",
    genre: "accion",
    meta: "Acción roguelite · PC · PS5",
    price: "14,99 €",
    img: "images/juegos/pixel-rebels.svg",
    desc: "Un grupo de píxeles rebeldes escapa de un videojuego antiguo. Cada partida es distinta: armas aleatorias, jefes finales y cooperativo local para dos jugadores.",
    tags: ["Roguelite", "Cooperativo local", "Pixel art", "PEGI 12"],
    status: "Disponible"
  },
  "circuit-hearts": {
    title: "Circuit Hearts",
    genre: "puzzle",
    meta: "Puzzle · PC · Switch · Móvil",
    price: "9,99 €",
    img: "images/juegos/circuit-hearts.svg",
    desc: "Conecta circuitos para devolver la vida a dos robots que se echan de menos. 120 niveles, editor de niveles y un final que no esperas.",
    tags: ["Nuevo", "Puzzle", "Editor de niveles", "PEGI 3"],
    status: "Nuevo"
  },
  "ecos-22": {
    title: "Ecos del 22@",
    genre: "aventura",
    meta: "Aventura narrativa · PC · PS5 · Xbox Series",
    price: "21,99 €",
    img: "images/juegos/ecos-22.svg",
    desc: "Una antigua fábrica de Poblenou guarda un secreto. Investiga, habla con sus vecinos y decide qué historia contar. Tus decisiones cambian el barrio.",
    tags: ["Nuevo", "Misterio", "Decisiones", "PEGI 16"],
    status: "Nuevo"
  },
  "shadow-protocol": {
    title: "Shadow Protocol",
    genre: "estrategia",
    meta: "Estrategia y sigilo · Lanzamiento 14/02/2027",
    price: "24,99 €",
    img: "images/juegos/shadow-protocol.svg",
    desc: "Dirige un equipo de infiltración en una red de ciudades vigiladas por una IA. Planifica cada movimiento por turnos y no dejes rastro.",
    tags: ["Próximamente", "Por turnos", "Sigilo", "PEGI 16"],
    status: "Próximamente"
  }
};

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ---------- Toast (mensajes) ---------- */
const toast = $("#toast");
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2800);
}

/* ---------- Cabecera y menú móvil ---------- */
const header = $("#header");
const burger = $("#burger");
const nav = $("#nav");

window.addEventListener("scroll", () => {
  header.classList.toggle("is-scrolled", window.scrollY > 30);
}, { passive: true });

burger.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  burger.classList.toggle("is-open", open);
  burger.setAttribute("aria-expanded", open);
});

$$("#nav a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("is-open");
  burger.classList.remove("is-open");
  burger.setAttribute("aria-expanded", "false");
}));

/* Resaltar el enlace de la sección visible */
const navLinks = $$('#nav a[href^="#"]');
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(a => a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id));
  });
}, { rootMargin: "-45% 0px -50% 0px" });
$$("main section[id]").forEach(s => sectionObserver.observe(s));

/* ---------- Animación al hacer scroll ---------- */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
$$(".reveal").forEach(el => revealObserver.observe(el));

/* ---------- Contadores del hero ---------- */
function animateCount(el) {
  const target = Number(el.dataset.count);
  const suffix = el.dataset.suffix || "";
  const duration = 1600;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased).toLocaleString("es-ES") + (p === 1 ? suffix : "");
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const countObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      countObserver.unobserve(entry.target);
    }
  });
});
$$("[data-count]").forEach(el => countObserver.observe(el));

/* ---------- Catálogo con filtros ---------- */
const catalog = $("#catalog");
const GENRE_NAMES = { accion: "Acción", aventura: "Aventura", carreras: "Carreras", estrategia: "Estrategia", puzzle: "Puzzle" };

function renderCatalog(filter = "todos") {
  const entries = Object.entries(GAMES).filter(([, g]) => filter === "todos" || g.genre === filter);
  catalog.innerHTML = entries.map(([id, g], i) => `
    <article class="card" style="animation-delay:${i * 70}ms">
      <div class="card__media">
        ${g.status !== "Disponible" ? `<span class="badge ${g.status === "Próximamente" ? "badge--soon" : g.status === "Más vendido" ? "badge--hot" : ""}">${g.status}</span>` : ""}
        <img src="${g.img}" alt="Portada de ${g.title}" loading="lazy">
      </div>
      <div class="card__body">
        <p class="card__meta">${GENRE_NAMES[g.genre]}</p>
        <h3>${g.title}</h3>
        <div class="card__foot">
          <span class="price__now">${g.price}</span>
          <button class="btn btn--small" data-open="${id}">Ver juego</button>
        </div>
      </div>
    </article>`).join("");
}

$$(".filter").forEach(btn => btn.addEventListener("click", () => {
  $$(".filter").forEach(b => b.classList.remove("is-active"));
  btn.classList.add("is-active");
  renderCatalog(btn.dataset.filter);
}));
renderCatalog();

/* ---------- Lista de deseos ---------- */
const wishlist = new Set();
const wishBtn = $("#wishlistBtn");
const wishCount = $("#wishlistCount");

function toggleWish(id) {
  const game = GAMES[id];
  if (!game) return;
  if (wishlist.has(id)) {
    wishlist.delete(id);
    showToast(`${game.title} eliminado de tu lista de deseos`);
  } else {
    wishlist.add(id);
    showToast(`♥ ${game.title} añadido a tu lista de deseos`);
  }
  wishCount.textContent = wishlist.size;
  wishBtn.classList.remove("bump");
  void wishBtn.offsetWidth; // reinicia la animación
  wishBtn.classList.add("bump");
}

wishBtn.addEventListener("click", () => {
  if (!wishlist.size) return showToast("Tu lista de deseos está vacía");
  showToast("Deseados: " + [...wishlist].map(id => GAMES[id].title).join(", "));
});

/* ---------- Modal de detalles ---------- */
const modal = $("#modal");
let lastFocus = null;
let currentGame = null;

function openModal(id) {
  const g = GAMES[id];
  if (!g) return;
  currentGame = id;
  $("#modalImg").src = g.img;
  $("#modalImg").alt = "Portada de " + g.title;
  $("#modalMeta").textContent = g.meta;
  $("#modalTitle").textContent = g.title;
  $("#modalDesc").textContent = g.desc;
  $("#modalTags").innerHTML = g.tags.map(t => `<li>${t}</li>`).join("");
  $("#modalPrice").textContent = g.price;
  $("#modalBuy").textContent = g.status === "Próximamente" ? "Reservar" : "Comprar";
  lastFocus = document.activeElement;
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  $(".modal__close").focus();
}

function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = "";
  if (lastFocus) lastFocus.focus();
}

$("#modalBuy").addEventListener("click", () => {
  const g = GAMES[currentGame];
  closeModal();
  showToast(g.status === "Próximamente" ? `Reserva de ${g.title} guardada` : `${g.title} añadido al carrito 🛒`);
});

/* Delegación de eventos: botones "Ver juego", "Deseados" y cerrar */
document.addEventListener("click", e => {
  const open = e.target.closest("[data-open]");
  const wish = e.target.closest("[data-wish]");
  if (open) openModal(open.dataset.open);
  if (wish) toggleWish(wish.dataset.wish);
  if (e.target.closest("[data-close]")) closeModal();
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && !modal.hidden) closeModal();
});

/* ---------- Cuenta atrás del próximo lanzamiento ---------- */
const countdown = $("#countdown");
if (countdown) {
  const target = new Date(countdown.dataset.date).getTime();
  const parts = {
    d: $('[data-cd="d"]', countdown), h: $('[data-cd="h"]', countdown),
    m: $('[data-cd="m"]', countdown), s: $('[data-cd="s"]', countdown)
  };
  const pad = n => String(n).padStart(2, "0");
  function updateCountdown() {
    let diff = Math.max(0, target - Date.now());
    const d = Math.floor(diff / 864e5); diff -= d * 864e5;
    const h = Math.floor(diff / 36e5); diff -= h * 36e5;
    const m = Math.floor(diff / 6e4); diff -= m * 6e4;
    const s = Math.floor(diff / 1e3);
    parts.d.textContent = pad(d); parts.h.textContent = pad(h);
    parts.m.textContent = pad(m); parts.s.textContent = pad(s);
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

/* ---------- Minijuego: Caza el triángulo ---------- */
(function miniGame() {
  const area = $("#gameArea");
  const overlay = $("#gameOverlay");
  const msg = $("#gameMsg");
  const startBtn = $("#gameStart");
  const scoreEl = $("#gameScore");
  const timeEl = $("#gameTime");
  const bestEl = $("#gameBest");

  const TRIANGLE = `<svg viewBox="0 0 100 100" aria-hidden="true"><polygon points="50,6 96,94 4,94" fill="#7ED957"/><polygon points="50,40 72,82 28,82" fill="#0b0b0b"/></svg>`;
  let score = 0, time = 20, best = 0, spawnTimer, clockTimer, playing = false;

  try { best = Number(localStorage.getItem("dai-best")) || 0; } catch (e) { /* sin almacenamiento */ }
  bestEl.textContent = best;

  function spawn() {
    if (!playing) return;
    const t = document.createElement("button");
    t.className = "target";
    t.setAttribute("aria-label", "Triángulo");
    t.innerHTML = TRIANGLE;
    const size = 46;
    t.style.left = Math.random() * (area.clientWidth - size) + "px";
    t.style.top = Math.random() * (area.clientHeight - size) + "px";
    t.addEventListener("click", ev => {
      ev.stopPropagation();
      score++;
      scoreEl.textContent = score;
      t.classList.add("hit");
      setTimeout(() => t.remove(), 250);
    });
    area.appendChild(t);
    // desaparece si no lo cazas
    setTimeout(() => t.isConnected && !t.classList.contains("hit") && t.remove(), Math.max(650, 1300 - score * 20));
    spawnTimer = setTimeout(spawn, Math.max(380, 750 - score * 12));
  }

  function end() {
    playing = false;
    clearTimeout(spawnTimer);
    clearInterval(clockTimer);
    $$(".target", area).forEach(t => t.remove());
    if (score > best) {
      best = score;
      bestEl.textContent = best;
      try { localStorage.setItem("dai-best", best); } catch (e) { /* sin almacenamiento */ }
      msg.textContent = `¡Nuevo récord: ${score}!`;
    } else {
      msg.textContent = `Has cazado ${score} triángulos`;
    }
    startBtn.textContent = "Jugar otra vez";
    overlay.hidden = false;
  }

  startBtn.addEventListener("click", () => {
    score = 0; time = 20; playing = true;
    scoreEl.textContent = 0; timeEl.textContent = time;
    overlay.hidden = true;
    spawn();
    clockTimer = setInterval(() => {
      time--;
      timeEl.textContent = time;
      if (time <= 0) end();
    }, 1000);
  });
})();

/* ---------- Formularios ---------- */
const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

$("#newsletterForm").addEventListener("submit", e => {
  e.preventDefault();
  const input = $("#nlEmail");
  if (!isEmail(input.value.trim())) {
    input.focus();
    return showToast("Escribe un correo válido");
  }
  input.value = "";
  showToast("¡Suscrito! Revisa tu bandeja de entrada 📬");
});

$("#contactForm").addEventListener("submit", e => {
  e.preventDefault();
  const form = e.target;
  let ok = true;
  $$("[required]", form).forEach(field => {
    const valid = field.type === "checkbox" ? field.checked
      : field.type === "email" ? isEmail(field.value.trim())
      : field.value.trim() !== "";
    field.classList.toggle("is-invalid", !valid);
    if (!valid) ok = false;
  });
  if (!ok) return showToast("Revisa los campos marcados");
  form.reset();
  showToast("Mensaje enviado. Te responderemos en 24–48 h ✔");
});

/* ---------- Año del pie ---------- */
$("#year").textContent = new Date().getFullYear();
