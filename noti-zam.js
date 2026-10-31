// =============================================================
// NOTI-ZAM — datos + navegación entre pantallas (intro / hub / detalle)
// =============================================================
(function () {
  "use strict";

  // Audio de la pantalla de inicio de Noti-Zam ("En las noticias de hoy..."): suena al llegar a ella.
  // Copiá tu archivo a esta ruta (o cambiá la ruta acá).
  const AUDIO_INTRO = "audio/noticias/intro.mp3";

  // Cada noticia tiene su "audio": la ruta del archivo que se reproduce al abrirla.
  // Solo hay que copiar el mp3 a audio/noticias/ con el nombre indicado (o cambiar la ruta acá).

  // Posiciones (%) de cada burbuja en el hub, aproximadas a partir
  // de las referencias. left/top = esquina superior izquierda de la burbuja.
  const NOTICIAS = [
    {
      id: "doblaje-ia",
      etiqueta: "Doblaje con IA",
      left: "46.5%", top: "8%",
      icono: "img/noticias/icons/doblaje-ia.png",
      panel: "img/noticias/paneles/doblaje-ia.png",
      audio: "audio/noticias/doblaje-ia.mp3",
      caption: "El 30% de los doblajes ya se hacen con procesos de clonación de voces."
    },
    {
      id: "ley-ia",
      etiqueta: "Ley de IA",
      left: "70.5%", top: "2%",
      icono: "img/noticias/icons/ley-ia.png",
      panel: "img/noticias/paneles/ley-ia.png",
      audio: "audio/noticias/ley-ia.mp3",
      caption: "La Unión Europea instauró la Ley de Inteligencia Artificial."
    },
    {
      id: "leyes-mundiales",
      etiqueta: "Leyes mundiales",
      left: "87%", top: "8%",
      icono: "img/noticias/icons/leyes-mundiales.png",
      panel: "img/noticias/paneles/leyes-mundiales.png",
      audio: "audio/noticias/leyes-mundiales.mp3",
      caption: "A nivel global, distintos países ya implementan leyes estrictas contra la clonación de voz sin consentimiento."
    },
    {
      id: "batalla-ia",
      etiqueta: "Batalla contra la IA",
      left: "62.5%", top: "31%",
      icono: "img/noticias/icons/batalla-ia.png",
      panel: "img/noticias/paneles/batalla-ia.png",
      audio: "audio/noticias/batalla-ia.mp3",
      caption: "La industria mundial del doblaje se enfrenta a la IA."
    },
    {
      id: "ley-elvis",
      etiqueta: "Ley Elvis",
      left: "82%", top: "40%",
      icono: "img/noticias/icons/ley-elvis.png",
      panel: "img/noticias/paneles/ley-elvis.png",
      audio: "audio/noticias/ley-elvis.mp3",
      caption: "La Ley ELVIS, la primera ley que elevó la voz humana como un derecho de propiedad explícito."
    },
    {
      id: "voces-actores",
      etiqueta: "Voces de actores",
      left: "49%", top: "47%",
      icono: "img/noticias/icons/voces-actores.png",
      panel: "img/noticias/paneles/voces-actores.png",
      audio: "audio/noticias/voces-actores.mp3",
      caption: "Más casos de usuarios que toman la voz de actores sin su consentimiento."
    },
    {
      id: "manifestaciones",
      etiqueta: "Manifestaciones",
      left: "67.5%", top: "60.5%",
      icono: "img/noticias/icons/manifestaciones.png",
      panel: "img/noticias/paneles/manifestaciones.png",
      audio: "audio/noticias/manifestaciones.mp3",
      caption: "Actores de todo el mundo se manifestaron exigiendo protección jurídica para su voz."
    }
  ];

  const app = document.getElementById("app-notizam");
  const vistas = {
    intro: document.getElementById("vista-intro"),
    hub: document.getElementById("vista-hub"),
    detalle: document.getElementById("vista-detalle")
  };
  const pill = document.getElementById("notizam-pill");
  const cajaIntro = document.getElementById("caja-intro");
  const contenedorBurbujas = document.getElementById("burbujas-noticias");

  const panelImg = document.getElementById("panel-noticia-img");
  const panelWrap = document.getElementById("panel-noticia");
  const captionBox = document.getElementById("notizam-caption");
  const captionVacio = document.getElementById("notizam-pie-vacio");
  const captionTexto = document.getElementById("caption-texto");
  const captionIconoImg = document.getElementById("caption-icono-img");
  const captionIconoWrap = document.getElementById("caption-icono");

  const audio = document.getElementById("notizam-audio");
  const btnAudio = document.getElementById("caption-audio");

  // jerarquía simple: la píldora "Noti-Zam" funciona como botón "volver"
  // un nivel a la vez. Desde la intro, vuelve a la pantalla de inicio del sitio.
  const PADRE = { hub: "intro", detalle: "hub" };
  const URL_INICIO_SITIO = "index.html";

  /** Hace que un <img> muestre el placeholder punteado si no carga. */
  function prepararImagenPlaceholder(img) {
    const marco = img.closest(".marco-imagen");
    if (!marco) return;
    img.addEventListener("error", () => marco.classList.add("sin-imagen"));
    img.addEventListener("load", () => marco.classList.remove("sin-imagen"));
    // si ya está roto al cargar la página
    if (img.complete && img.naturalWidth === 0 && img.src) {
      marco.classList.add("sin-imagen");
    }
  }

  // ---- audio de la noticia ----
  function actualizarBotonAudio() {
    const reproduciendo = !audio.paused;
    btnAudio.querySelector(".audio-icono-pausa").hidden = !reproduciendo;
    btnAudio.querySelector(".audio-icono-play").hidden = reproduciendo;
    btnAudio.setAttribute("aria-label", reproduciendo ? "Pausar audio" : "Reproducir audio");
  }
  function detenerAudio() {
    audio.pause();
    audio.removeAttribute("src");   // corta la descarga y evita errores de un archivo anterior
    audio.load();
    actualizarBotonAudio();
  }
  audio.addEventListener("play", actualizarBotonAudio);
  audio.addEventListener("pause", actualizarBotonAudio);
  audio.addEventListener("ended", () => { audio.currentTime = 0; actualizarBotonAudio(); });
  audio.addEventListener("error", () => { if (audio.getAttribute("src")) btnAudio.classList.add("sin-audio"); });
  audio.addEventListener("loadeddata", () => btnAudio.classList.remove("sin-audio"));
  btnAudio.addEventListener("click", () => {
    if (btnAudio.classList.contains("sin-audio")) return;
    if (audio.paused) audio.play().catch(() => {}); else audio.pause();
  });

  // ---- audio de la pantalla de inicio (sin botón: suena solo) ----
  const audioIntro = document.getElementById("notizam-audio-intro");
  audioIntro.src = AUDIO_INTRO;

  function detenerAudioIntro() {
    audioIntro.pause();
    audioIntro.currentTime = 0;
  }
  function iniciarAudioIntro() {
    audioIntro.currentTime = 0;
    audioIntro.play().catch((err) => {
      // Algunos navegadores bloquean el sonido si la persona todavía no tocó nada en la página.
      // En ese caso arranca con el primer clic, toque o tecla (siempre que siga en la intro).
      if (err && err.name !== "NotAllowedError") return;   // p. ej. el archivo aún no existe
      const arrancar = () => {
        document.removeEventListener("click", arrancar);
        document.removeEventListener("keydown", arrancar);
        if (app.dataset.vistaActual === "intro") audioIntro.play().catch(() => {});
      };
      document.addEventListener("click", arrancar);
      document.addEventListener("keydown", arrancar);
    });
  }

  function mostrarVista(nombre) {
    Object.entries(vistas).forEach(([clave, el]) => {
      el.hidden = clave !== nombre;
    });
    app.dataset.vistaActual = nombre;

    // el copete (caption) solo existe en la vista de detalle
    const esDetalle = nombre === "detalle";
    if (!esDetalle) detenerAudio();   // al salir de la noticia, el audio se corta
    if (nombre === "intro") iniciarAudioIntro(); else detenerAudioIntro();
    captionBox.hidden = !esDetalle;
    captionVacio.hidden = esDetalle;
  }

  function abrirNoticia(noticia) {
    panelImg.src = noticia.panel;
    panelImg.alt = noticia.etiqueta;
    panelWrap.dataset.placeholder = "ilustración: " + noticia.panel;

    captionIconoImg.src = noticia.icono;
    captionIconoImg.alt = noticia.etiqueta;
    captionIconoWrap.dataset.placeholder = "";
    captionTexto.textContent = noticia.caption;

    mostrarVista("detalle");

    // el audio arranca solo al abrir la noticia (viene de un clic, así que el navegador lo permite)
    btnAudio.classList.remove("sin-audio");
    audio.src = noticia.audio;
    audio.currentTime = 0;
    audio.play().catch(() => {});
    actualizarBotonAudio();
  }

  function crearBurbujas() {
    NOTICIAS.forEach((noticia) => {
      const boton = document.createElement("button");
      boton.type = "button";
      boton.className = "burbuja-noticia";
      boton.style.left = noticia.left;
      boton.style.top = noticia.top;
      boton.setAttribute("aria-label", "Abrir noticia: " + noticia.etiqueta);

      const circulo = document.createElement("span");
      circulo.className = "burbuja-circulo marco-imagen";
      circulo.dataset.placeholder = noticia.id;

      const img = document.createElement("img");
      img.src = noticia.icono;
      img.alt = "";
      prepararImagenPlaceholder(img);
      circulo.appendChild(img);

      const etiqueta = document.createElement("span");
      etiqueta.className = "burbuja-etiqueta";
      etiqueta.textContent = noticia.etiqueta;

      boton.appendChild(circulo);
      boton.appendChild(etiqueta);
      boton.addEventListener("click", () => abrirNoticia(noticia));

      contenedorBurbujas.appendChild(boton);
    });
  }

  // ---- eventos de navegación ----
  cajaIntro.addEventListener("click", () => mostrarVista("hub"));

  // la píldora "Noti-Zam" es el único botón de retroceso:
  // detalle -> hub -> intro -> pantalla de inicio del sitio
  pill.addEventListener("click", () => {
    const actual = app.dataset.vistaActual;
    const padre = PADRE[actual];
    if (padre) {
      mostrarVista(padre);
    } else {
      window.location.href = URL_INICIO_SITIO;
    }
  });

  // preparar placeholders de imágenes fijas (logo / personaje / panel)
  document.querySelectorAll(".marco-imagen img[src]").forEach(prepararImagenPlaceholder);

  // ---- inicio ----
  crearBurbujas();
  mostrarVista("intro");
})();
