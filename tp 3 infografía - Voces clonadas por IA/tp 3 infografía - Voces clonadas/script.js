/* ==========================================================================
   VOCES AFANADAS - IA — script.js
   Contiene los datos de contenido (extraídos de texto_tp3-voz_con_ia.txt)
   y la lógica de las tres interacciones pedidas:
     1) Introducción: globos de diálogo que avanzan con un click.
     2) Núcleo 1: anillo de íconos -> modal con texto + imagen + audio.
     3) Núcleo 2: animación de "objeción" + caja de diálogo navegable.
   ========================================================================== */

/* ---------------------------------------------------------------------
   DATOS
--------------------------------------------------------------------- */

const DATA_INTRO = [
    "Hola,soy Micro-chan. Te voy a acompañar en ésta trayectoria.",
    "La clonación de voz es una tecnología de inteligencia artificial que crea una réplica digital exacta de la voz de una persona a partir de una muestra de audio",
    "Se ha utilizado ampliamente en el doblaje de vídeos, la localización, el marketing, la educación y los flujos de trabajo de los creadores.",
    "Esta tecnología se ha visto envuelta en polémicas y problemas legales desde el comienzo de su desarrollo e implementación en los diferentes medios, generando dudas sobre si su uso es moralmente correcto.",
    "Hay mucha información por explorar así que mandale :D"
];

const DATA_TIMELINE = [
    { año: "1990 y 2000", texto: "Los programas utilizaban la concatenación, es decir, unían fragmentos de palabras grabadas previamente por un locutor. El resultado sonaba robótico y requería horas de grabación" },
    { año: "2016 · WaveNet", texto: "DeepMind presentó WaveNet, un modelo generativo de audio basado en aprendizaje profundo que cambió la forma de sintetizar ondas sonoras" },
    { año: "2017 · Tacotron", texto: "Google lanzó Tacotron, un sistema que transformaba texto directamente en espectrogramas de audio, logrando una entonación mucho más natural." },
    { año: "2018–2019", texto: "Surgieron redes neuronales especializadas en extraer características únicas de un hablante a partir de minutos de voz para aplicarlas a nuevos textos" },
    { año: "2020–2022", texto: "Los sistemas comenzaron a integrar codificadores y sintetizadores en una sola red neuronal (como el modelo VITS) y las herramientas de clonación empezaron a comercializarse para la industria del entretenimiento y la accesibilidad" },
    { año: "Actualidad (2026)", texto: "VALL-E / ElevenLabs cuenta con sistemas de tipo zero-shot que necesitan apenas 3 segundos de audio para lograr una coincidencia de voz superior al 85 %, lo que desdibuja la línea entre una voz real y una artificial." }
];

/* AVISO: "media" apunta a img/graficos/<archivo>, tal como en el HTML
   original, pero esos archivos no fueron provistos en esta entrega.
   Se muestra un marcador de posición hasta que se sumen los reales. */
const DATA_ICONOS = [
    {
        icono: "img/icons/icon_1.png",
        texto: "La Ley ELVIS de Tennessee aprobada en 2024 para salvaguardar la industria de la música de Nashville, fue la primera ley en el mundo en elevar la voz humana al estatus de un derecho de propiedad explícito, heredable y asegurable.",
        media: "img/graficos/img_1.jpg",
        audio: "audio/audio_1.mp3"
    },
    {
        icono: "img/icons/icon_2.png",
        texto: "La industria mundial del doblaje vive uno de sus mejores momentos impulsada por la expansión de las plataformas de streaming. Sin embargo, el crecimiento del sector convive con un nuevo desafío: el avance de la inteligencia artificial y la utilización de voces clonadas para reemplazar a actores y locutores.",
        media: "img/graficos/img_2.jpg",
        audio: "audio/audio_2.mp3"
    },
    {
        icono: "img/icons/icon_3.png",
        texto: "A nivel global, diversos países y bloques regionales han comenzado a implementar leyes y medidas estrictas para combatir la clonación de voz sin consentimiento.",
        media: "img/graficos/img_3.png",
        audio: "audio/audio_3.mp3"
    },
    {
        icono: "img/icons/icon_4.png",
        texto: "Actores de todo el mundo han participado en manifestaciones contra la clonación de voz exigiendo la protección jurídica de su voz como elemento de identidad personal.",
        media: "img/graficos/img_4.jpeg",
        audio: "audio/audio_4.mp3"
    },
    {
        icono: "img/icons/icon_5.png",
        texto: "En los últimos tiempos, se han comenzado a ver más casos de usuarios o empresas de inteligencia artificial que toman la voz de actores sin consentimiento, resultando en problemas legales.",
        media: "img/graficos/img_5.png",
        audio: "audio/audio_5.mp3"
    },
    {
        icono: "img/icons/icon_6.png",
        texto: "La Unión Europea instauró la Ley de Inteligencia Artificial que regula el uso de la tecnología en todos los ámbitos según su nivel de riesgo, incluyendo la clonación de voz y los derechos de autor envueltos en ella. Obliga penalmente a los desarrolladores de software a incrustar marcas de agua digitales en los clones de voz.",
        media: "img/graficos/img_6.png",
        audio: "audio/audio_6.mp3"
    },
    {
        icono: "img/icons/icon_7.png",
        texto: "Se calcula que el 30% de los doblajes ya se hacen con procesos de clonación de voces.",
        media: "img/graficos/img_7.jpg",
        audio: "audio/audio_7.mp3"
    }
];

/* Contenido completo de diálogo de Micro-San, tomado del .txt (11 recuadros
   agrupados en 3 temas), que es la versión más completa que la del HTML. */
const DATA_DIALOGO = [
    { titulo: "1. Derechos de autor y propiedad intelectual", texto: "La voz de una persona no siempre goza de la misma protección que una canción, un guión, una imagen o una interpretación grabada." },
    {  texto: "Sin embargo, clonar o utilizar la voz de alguien sin permiso puede suponer un riesgo legal en virtud de los derechos de publicidad, las leyes de privacidad, las normas de protección del consumidor, las condiciones contractuales, las normas de competencia desleal, las políticas de las plataformas y la ley de derechos de autor, si la grabación original o el contenido final incluye material protegido por derechos de autor." },
    { texto: "Las voces de personajes famosos y de gran notoriedad requieren un cuidado especial. Aunque una voz generada no se haya copiado de una grabación sonora protegida, el uso de una voz que se parezca a la de una persona reconocible puede plantear problemas relacionados con el derecho de imagen, el respaldo falso, el engaño al consumidor y las políticas de la plataforma." },
    { titulo: "2. Difamación y uso legítimo", texto: "Las voces clonadas pueden utilizarse indebidamente y, en muchos casos, acaban perjudicando la reputación de una persona." },
    { texto: "Por lo tanto, tanto si está considerando la clonación de voces para su proyecto de locución de IA como si lo hace con fines de entretenimiento, asegúrese de comprender y evitar el riesgo de difamación." },
    { texto: "El uso legítimo depende de las circunstancias concretas y no debe considerarse un permiso general para la clonación de voces." },
    { texto: "El uso comercial, los anuncios, el contenido de pago o el contenido que implique un respaldo suelen suponer un mayor riesgo, especialmente cuando la voz es reconocible." },
    { texto: "Incluso si un proyecto es un comentario, una parodia, tiene fines educativos o está relacionado con las noticias, debes evaluar el consentimiento, la divulgación, los derechos del audio original, las políticas de la plataforma y las leyes locales sobre derechos de publicidad." },
    { titulo: "3. Consentimiento y privacidad", texto: "Antes de clonar la voz de alguien, asegúrate de pedir permiso explícito. Esto se aplica a todo lo que incluya la generación de la voz de otra persona." },
    { texto: "El uso no autorizado de la voz puede acarrear consecuencias legales. Cuando te plantees clonar la voz, asegúrate de ser transparente sobre tu intención de utilizar esta voz modificada." },
    { texto: "Asegúrese de informar a las partes pertinentes sobre las herramientas que utilizará para la clonación de voz y dónde se utilizarán estas voces clonadas." }
];

/* ---------------------------------------------------------------------
   1) INTRODUCCIÓN — globos de diálogo
--------------------------------------------------------------------- */
(function initIntro(){
    const globo = document.getElementById("globo-intro");
    const boton = document.getElementById("siguiente-intro");
    let indice = 0;

    function pintar(){
        globo.textContent = DATA_INTRO[indice];
        boton.disabled = indice >= DATA_INTRO.length - 1 && false; // el botón queda siempre disponible para releer
    }

    function avanzar(){
        globo.classList.add("saliendo");
        window.setTimeout(() => {
            indice = (indice + 1) % DATA_INTRO.length;
            pintar();
            globo.classList.remove("saliendo");
        }, 180);
    }

    globo.addEventListener("click", avanzar);
    boton.addEventListener("click", avanzar);
    pintar();
})();

/* ---------------------------------------------------------------------
   LÍNEA DEL TIEMPO — generación del bloque horizontal
--------------------------------------------------------------------- */
(function initTimeline(){
    const contenedor = document.getElementById("linea-tiempo");
    DATA_TIMELINE.forEach((item, i) => {
        const div = document.createElement("div");
        div.className = "linea-tiempo-item " + (i % 2 === 0 ? "arriba" : "abajo");
        div.innerHTML = `
            <div class="linea-tiempo-caja">
                <strong>${item.año}:</strong> ${item.texto}
            </div>
        `;
        contenedor.appendChild(div);
    });
})();

/* ---------------------------------------------------------------------
   2) NÚCLEO 1 — anillo de íconos + modal
--------------------------------------------------------------------- */
(function initNucleo1(){
    const anillo = document.getElementById("anillo-iconos");
    const overlay = document.getElementById("modal-icono");
    const panelTexto = document.getElementById("modal-icono-titulo");
    const panelMedia = document.getElementById("modal-icono-media");
    const panelEsquina = document.getElementById("modal-icono-esquina");
    const cerrar = document.getElementById("modal-cerrar");
    const botonAudio = document.getElementById("btn-audio");
    const audioTexto = botonAudio.querySelector(".btn-audio-texto");

    /* Reproductor de audio único, reutilizado para todas las burbujas.
       Se arma con new Audio() en vez de un <audio> en el HTML porque
       lo vamos a controlar 100% desde acá (sin controles nativos). */
    const audioNucleo1 = new Audio();

    DATA_ICONOS.forEach((item, i) => {
        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = "icono-burbuja";
        boton.dataset.pos = i;
        boton.setAttribute("aria-label", `Ver información ${i + 1}`);
        boton.innerHTML = `<img src="${item.icono}" alt="Ícono ${i + 1}">`;
        boton.addEventListener("click", () => abrirModal(item));
        anillo.appendChild(boton);
    });

    function abrirModal(item){
        panelTexto.textContent = item.texto;
        panelEsquina.src = item.icono;
        panelEsquina.alt = "";
        panelMedia.innerHTML = `<img src="${item.media}" alt="">`

        overlay.hidden = false;

        /* Audio: arranca solo al abrir la burbuja. El click en la
           burbuja cuenta como interacción del usuario, así que el
           navegador permite el autoplay con sonido. */
        audioNucleo1.src = item.audio;
        audioNucleo1.currentTime = 0;
        audioNucleo1.play().catch(() => {
            /* Si el navegador igual bloquea el autoplay, el botón de
               audio de la esquina sirve para arrancarlo a mano. */
        });

        cerrar.focus();
    }

    function cerrarModal(){
        overlay.hidden = true;
        audioNucleo1.pause();
        audioNucleo1.currentTime = 0;
    }

    function actualizarBotonAudio(){
        const sonando = !audioNucleo1.paused;
        botonAudio.setAttribute("aria-pressed", String(sonando));
        audioTexto.textContent = sonando ? "Silenciar audio" : "Habilitar audio";
    }

    cerrar.addEventListener("click", cerrarModal);

    overlay.addEventListener("click", (evento) => {
        if (evento.target === overlay) cerrarModal();
    });

    document.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape" && !overlay.hidden) cerrarModal();
    });

    /* El botón de la esquina superior izquierda ahora silencia/reanuda
       el audio real de la burbuja abierta, en vez de solo cambiar texto. */
    botonAudio.addEventListener("click", () => {
        if (audioNucleo1.paused){
            audioNucleo1.play().catch(() => {});
        } else {
            audioNucleo1.pause();
        }
    });

    audioNucleo1.addEventListener("play", actualizarBotonAudio);
    audioNucleo1.addEventListener("pause", actualizarBotonAudio);
    audioNucleo1.addEventListener("ended", actualizarBotonAudio);
})();

/* ---------------------------------------------------------------------
   3) NÚCLEO 2 — caja de diálogo navegable
--------------------------------------------------------------------- */
(function initNucleo2(){
    const titulo = document.getElementById("dialogo-titulo");
    const texto = document.getElementById("dialogo-texto");
    const anterior = document.getElementById("dialogo-anterior");
    const siguiente = document.getElementById("dialogo-siguiente");
    let indice = 0;

    function pintar(){
        const item = DATA_DIALOGO[indice];
        titulo.textContent = item.titulo;
        texto.textContent = item.texto;
        anterior.disabled = indice === 0;
        siguiente.disabled = indice === DATA_DIALOGO.length - 1;
    }

    anterior.addEventListener("click", () => {
        if (indice > 0){ indice--; pintar(); }
    });
    siguiente.addEventListener("click", () => {
        if (indice < DATA_DIALOGO.length - 1){ indice++; pintar(); }
    });

    pintar();
})();
