// TRIVIA — datos + navegación (intro -> [pregunta con audio -> imagen con audio de la respuesta] x 5)
(function () {
  "use strict";

  // Editá acá: archivos de audio e imagen, texto de la pregunta y respuesta correcta ("real" o "clonada").
  // audio = el que se escucha en la pregunta; imagen + audioRespuesta = lo que se ve y suena al elegir Real o Clonada.
  // "respuesta" = si el audio de la PREGUNTA (audio) es "real" o "clonada": decide qué botón es el correcto.
  // En la pantalla siguiente suena el audio contrario (audioRespuesta): si la pregunta era clonada, ahí suena el real
  // y la etiqueta dice "Real"; si la pregunta era real, ahí suena el clonado y la etiqueta dice "Clonada".
  const PREGUNTA = "¿Puedes identificar si esta voz es clonada o real?";
  const PARTES = [
    { audio: "audio/trivia/audio_1.mp3", imagen: "img/trivia/respuesta_1.png", audioRespuesta: "audio/trivia/respuesta_1.mp3", respuesta: "clonada" },
    { audio: "audio/trivia/audio_2.mp3", imagen: "img/trivia/respuesta_2.png", audioRespuesta: "audio/trivia/respuesta_2.mp3", respuesta: "clonada" },
    { audio: "audio/trivia/audio_3.mp3", imagen: "img/trivia/respuesta_3.png", audioRespuesta: "audio/trivia/respuesta_3.mp3", respuesta: "real" },
    { audio: "audio/trivia/audio_4.mp3", imagen: "img/trivia/respuesta_4.png", audioRespuesta: "audio/trivia/respuesta_4.mp3", respuesta: "clonada" },
    { audio: "audio/trivia/audio_5.mp3", imagen: "img/trivia/respuesta_5.png", audioRespuesta: "audio/trivia/respuesta_5.mp3", respuesta: "real" }
  ];
  const URL_INICIO_SITIO = "index.html";

  // Pantalla final: un mensaje por cantidad de aciertos (posición 0 = ninguno ... posición 5 = todos).
  // {n} y {total} se reemplazan solos. Editá los textos a gusto.
  const MENSAJES = [
    { titulo: "Adivinaste {n}/{total}",  texto: "La IA te engañó por completo. ¡Desconfía de lo que escuchas!" },
    { titulo: "Adivinaste {n}/{total}",  texto: "La IA te engañó casi siempre. ¡Cuidado con las voces que escuchas!" },
    { titulo: "Adivinaste {n}/{total}",  texto: "La IA logró engañarte varias veces. Presta atención a los detalles de la voz." },
    { titulo: "¡Adivinaste {n}/{total}!", texto: "Vas por buen camino, pero a veces la IA todavía puede engañarte." },
    { titulo: "¡Adivinaste {n}/{total}!", texto: "Casi perfecto: a la IA le costará engañarte." },
    { titulo: "¡Adivinaste {n}/{total}!", texto: "La IA no podrá engañarte!" }
  ];

  const $ = (id) => document.getElementById(id);
  const app = $("app-trivia"), vIntro = $("vista-intro"), vJuego = $("vista-juego"), vResultado = $("vista-resultado");
  const audio = $("trivia-audio"), audioRespuesta = $("trivia-audio-respuesta"), imagen = $("trivia-imagen");
  const tarjetaAudio = $("tarjeta-audio"), tarjetaImagen = $("tarjeta-imagen");
  const btnPlay = $("trivia-play"), ondas = $("trivia-ondas"), cabezal = $("trivia-cabezal");
  const btnSiguiente = $("trivia-siguiente");
  const personajeRespuesta = $("trivia-personaje-respuesta");//ACÁ HAY CAMBIOS !!!
  const opciones = document.querySelectorAll(".trivia-opcion[data-opcion]");   // real y clonada (no el botón Inicio, que reusa el mismo estilo)
  let indice = 0, aciertos = 0;

  // ---- placeholders de imágenes ----
  document.querySelectorAll(".marco-imagen img").forEach((img) => {
    const marco = img.closest(".marco-imagen");
    img.addEventListener("error", () => marco.classList.add("sin-imagen"));
    img.addEventListener("load", () => marco.classList.remove("sin-imagen"));
    if (img.complete && img.naturalWidth === 0) marco.classList.add("sin-imagen");
  });

  // ---- barritas de la onda (alturas fijas, aspecto de audio) ----
  const N_BARRAS = 60;
  for (let i = 0; i < N_BARRAS; i++) {
    const b = document.createElement("span");
    b.className = "barra";
    const h = 22 + Math.abs(Math.sin(i * 1.9)) * 22 + (i % 9 === 4 ? 30 : 0) + (i % 5 === 0 ? 8 : 0);
    b.style.height = Math.min(h, 90) + "%";
    ondas.insertBefore(b, cabezal);
  }

  // ---- reproductor de audio ----
  function iconoPlay(reproduciendo) {
    btnPlay.querySelector(".icono-play").hidden = reproduciendo;
    btnPlay.querySelector(".icono-pausa").hidden = !reproduciendo;
    btnPlay.setAttribute("aria-label", reproduciendo ? "Pausar audio" : "Reproducir audio");
  }
  function moverCabezal() {
    const p = audio.duration ? audio.currentTime / audio.duration : 0;
    cabezal.style.left = (p * 100) + "%";
  }
  btnPlay.addEventListener("click", () => {
    if (audio.paused) audio.play().catch(() => {}); else audio.pause();
  });
  audio.addEventListener("play", () => iconoPlay(true));
  audio.addEventListener("pause", () => iconoPlay(false));
  audio.addEventListener("ended", () => { iconoPlay(false); audio.currentTime = 0; moverCabezal(); });
  audio.addEventListener("timeupdate", moverCabezal);
  ondas.addEventListener("click", (e) => {
    if (!audio.duration) return;
    const r = ondas.getBoundingClientRect();
    audio.currentTime = Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1) * audio.duration;
    moverCabezal();
  });

  // ---- navegación ----
  function detenerMedios() { audio.pause(); audioRespuesta.pause(); }

  //ACÁ HAY CAMBIOS !!!
  function mostrarIntro() {
    app.classList.remove("mostrando-respuesta");
    personajeRespuesta.hidden = true;

    detenerMedios();
    indice = 0; aciertos = 0;
    app.dataset.vista = "intro";
    vIntro.hidden = false; vJuego.hidden = true; vResultado.hidden = true;
  }
//ACÁ HAY CAMBIOS !!!
  function mostrarPregunta() {
    app.classList.remove("mostrando-respuesta");
    personajeRespuesta.hidden = true;

    const parte = PARTES[indice];
    detenerMedios();
    $("trivia-pregunta").textContent = parte.pregunta || PREGUNTA;
    audio.src = parte.audio; audio.currentTime = 0;
    iconoPlay(false); cabezal.style.left = "0%";
    opciones.forEach((o) => { o.disabled = false; o.classList.remove("correcta", "incorrecta"); });
    tarjetaAudio.hidden = false; tarjetaImagen.hidden = true; btnSiguiente.hidden = true;
    app.dataset.vista = "juego";
    vIntro.hidden = true; vJuego.hidden = false; vResultado.hidden = true;
  }

  function mostrarResultado() {
    detenerMedios();
    const m = MENSAJES[Math.min(aciertos, MENSAJES.length - 1)];
    const poner = (t) => t.replace("{n}", aciertos).replace("{total}", PARTES.length);
    $("resultado-titulo").textContent = poner(m.titulo);
    $("resultado-texto").textContent = poner(m.texto);
    app.dataset.vista = "resultado";
    vIntro.hidden = true; vJuego.hidden = true; vResultado.hidden = false;
  }

  //ACÁ HAY CAMBIOS !!!
  function responder(elegida, boton) {
    const parte = PARTES[indice];
    audio.pause();
    opciones.forEach((o) => { o.disabled = true; });
    const acerto = elegida === parte.respuesta;

//ACÁ EMPIEZA EL CAMBIO !!!
    // Mostrar personaje según si la respuesta fue correcta o incorrecta 
const estado = acerto ? "correcto" : "incorrecto";

personajeRespuesta.src =
  `img/trivia/personaje-${indice + 1}-${estado}.png`;

personajeRespuesta.hidden = false;
//HASTA ACÁ HAY CAMBIOS !!!

app.classList.add("mostrando-respuesta");
    if (acerto) aciertos++;
    boton.classList.add(acerto ? "correcta" : "incorrecta");

    tarjetaImagen.dataset.placeholder = "imagen: " + parte.imagen;
    // la etiqueta describe el audio que suena en ESTA pantalla, que es el opuesto al de la pregunta
    $("trivia-etiqueta").textContent = parte.respuesta === "real" ? "Clonada" : "Real";
    imagen.src = parte.imagen;
    tarjetaAudio.hidden = true; tarjetaImagen.hidden = false; btnSiguiente.hidden = false;
    audioRespuesta.src = parte.audioRespuesta;
    audioRespuesta.currentTime = 0;
    audioRespuesta.play().catch(() => {});   // suena solo al llegar a esta pantalla (viene de un clic)
  }

  $("trivia-intro").addEventListener("click", mostrarPregunta);
  opciones.forEach((o) => o.addEventListener("click", () => responder(o.dataset.opcion, o)));
  btnSiguiente.addEventListener("click", () => {
    indice++;
    if (indice < PARTES.length) mostrarPregunta(); else mostrarResultado();  // tras la 5ª, pantalla final
  });
  $("trivia-inicio").addEventListener("click", () => { window.location.href = URL_INICIO_SITIO; });
  // píldora: pregunta/imagen/resultado -> intro -> inicio del sitio
  $("trivia-pill").addEventListener("click", () => {
    if (app.dataset.vista !== "intro") mostrarIntro(); else window.location.href = URL_INICIO_SITIO;
  });

  mostrarIntro();
})();
