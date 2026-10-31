// JUICIO — 3 temas, cada uno con pantallas introductorias/manuales,
// animación automática, y pantallas finales que avanzan con la flecha del diálogo.
(function () {
  "use strict";

  // Editá acá los textos, las pantallas manuales y la cantidad de frames automáticos.
  // Las pantallas 00 y 01 son introducciones; las dos últimas configuradas son finales.
  const TEMAS = [
    {
      titulo: "1. Derechos de autor y propiedad intelectual",
      ruta: "img/juicio/frames/juicio-tema1/tema1_",
      numFrames: 16,
      inicio: [
        "img/juicio/frames/juicio-tema1/tema1_00.png",
        "img/juicio/frames/juicio-tema1/tema1_01.png"
      ],
      finales: [
        "img/juicio/frames/juicio-tema1/tema1_17.png",
        "img/juicio/frames/juicio-tema1/tema1_18.png"
      ]
    },
    {
      titulo: "2. Difamación y uso legítimo",
      ruta: "img/juicio/frames/juicio-tema2/tema2_",
      numFrames: 18,
      inicio: [
        "img/juicio/frames/juicio-tema2/tema2_00.png",
        "img/juicio/frames/juicio-tema2/tema2_01.png"
      ],
      finales: [
        "img/juicio/frames/juicio-tema2/tema2_19.png",
        "img/juicio/frames/juicio-tema2/tema2_20.png"
      ]
    },
    {
      titulo: "3. Consentimiento y privacidad",
      ruta: "img/juicio/frames/juicio-tema3/tema3_",
      numFrames: 11,
      inicio: [
        "img/juicio/frames/juicio-tema3/tema3_00.png",
        "img/juicio/frames/juicio-tema3/tema3_01.png"
      ],
      bifurcacion: {
        opciones: [
          {
            imagen: "img/juicio/frames/juicio-tema3/tema3-opcion-si.png",
            ruta: "img/juicio/frames/juicio-tema3/si/tema3_si_",
            numFrames: 9,
            finales: [
              "img/juicio/frames/juicio-tema3/si/tema3_si_10.png",
              "img/juicio/frames/juicio-tema3/si/tema3_si_11.png",
              "img/juicio/frames/juicio-tema3/si/tema3_si_12.png"
            ]
          },
          {
            imagen: "img/juicio/frames/juicio-tema3/tema3-opcion-no.png",
            ruta: "img/juicio/frames/juicio-tema3/no/tema3_no_",
            numFrames: 14,
            finales: [
              "img/juicio/frames/juicio-tema3/no/tema3_no_15.png",
              "img/juicio/frames/juicio-tema3/no/tema3_no_16.png",
              "img/juicio/frames/juicio-tema3/no/tema3_no_17.png"
            ]
          }
        ]
      }
    }
  ];

  const MS_POR_FRAME = 1800;   // velocidad de la animación (más bajo = más rápido)
  const URL_INICIO_SITIO = "index.html";

  const $ = (id) => document.getElementById(id);
  const app = $("app-juicio");
  const vOpciones = $("vista-opciones"), vAnimacion = $("vista-animacion");
  const frameWrap = $("juicio-frame"), frameImg = $("juicio-frame-img");
  const btnFin = $("juicio-fin");
  const btnFlechaManual = $("juicio-flecha-manual");
  const botonesOpcion = [$("juicio-opcion-0"), $("juicio-opcion-1")];
  const pill = $("juicio-pill"), pillTexto = $("juicio-pill-texto");
  let temaActual = 0, frameActual = 0, temporizador = null;
  let rutaActual = "", numFramesActual = 0;
  // NUEVA VARIABLE: guarda la pantalla manual que sigue, para que la flecha
  // avance entre las imágenes introductorias y las dos imágenes finales.
  let alAvanzarPantallaManual = null;

  // ---- placeholders de imágenes (recuadro punteado si el archivo todavía no existe) ----
  function activarPlaceholder(img) {
    const marco = img.closest(".marco-imagen");
    img.addEventListener("error", () => marco.classList.add("sin-imagen"));
    img.addEventListener("load", () => marco.classList.remove("sin-imagen"));
    if (img.complete && img.naturalWidth === 0) marco.classList.add("sin-imagen");
  }
  document.querySelectorAll(".marco-imagen img").forEach(activarPlaceholder);

  // ---- pantalla 1: completar el texto de las 3 burbujas ----
  TEMAS.forEach((t, i) => { $("tema-" + i).textContent = t.titulo; });

  function mostrarOpciones() {
    clearInterval(temporizador);
    alAvanzarPantallaManual = null;
    btnFlechaManual.hidden = true;
    app.dataset.vista = "opciones";
    pillTexto.textContent = "¡Juicio!";
    vOpciones.hidden = false; vAnimacion.hidden = true;
  }

  // Muestra una pantalla fija. La flecha del diálogo es la única que permite avanzar.
  function mostrarPantallaManual(ruta, alAvanzar) {
    clearInterval(temporizador);
    frameWrap.dataset.placeholder = ruta;
    frameImg.src = ruta;
    activarPlaceholder(frameImg);
    btnFin.hidden = true;
    btnFlechaManual.hidden = false;
    alAvanzarPantallaManual = alAvanzar;
  }

  // ---- pantalla 2: reproducir los frames automáticos del tema elegido ----
  function mostrarFrame() {
    const ruta = rutaActual + (frameActual + 1) + ".png";
    frameWrap.dataset.placeholder = "frame " + (frameActual + 1) + "/" + numFramesActual + " (" + ruta + ")";
    frameImg.src = ruta;
    activarPlaceholder(frameImg);
  }

  // Reproduce una secuencia automática y al terminar muestra finales o bifurcación.
  function reproducirSecuencia(ruta, numFrames, alTerminar) {
    rutaActual = ruta; numFramesActual = numFrames; frameActual = 0;
    btnFlechaManual.hidden = true;
    btnFin.hidden = true;
    mostrarFrame();
    clearInterval(temporizador);
    temporizador = setInterval(() => {
      frameActual++;
      if (frameActual >= numFrames) {
        clearInterval(temporizador);
        alTerminar();
        return;
      }
      mostrarFrame();
    }, MS_POR_FRAME);
  }

  // Muestra todas las pantallas finales.
// La flecha permite avanzar entre ellas.
// El botón Fin del Juicio aparece únicamente en la última.

function mostrarFinales(finales) {

  if (!finales || !finales.length) {
    btnFin.hidden = false;
    return;
  }

  function mostrarFinal(indice) {

    mostrarPantallaManual(finales[indice], () => {

      mostrarFinal(indice + 1);

    });

    // Si es la última imagen, ocultamos la flecha
    // y mostramos el botón Fin del Juicio.
    if (indice === finales.length - 1) {

      btnFlechaManual.hidden = true;
      btnFin.hidden = false;
      alAvanzarPantallaManual = null;

    }

  }

  mostrarFinal(0);
}

  function mostrarBifurcacion(bifurcacion) {
    bifurcacion.opciones.forEach((op, i) => {
      const boton = botonesOpcion[i];
      boton.querySelector("img").src = op.imagen;
      activarPlaceholder(boton.querySelector("img"));
      boton.hidden = false;
      boton.onclick = () => {
        botonesOpcion.forEach((b) => { b.hidden = true; });
        reproducirSecuencia(op.ruta, op.numFrames, () => {
          mostrarFinales(op.finales);
        });
      };
    });
  }

  // Primero se muestran manualmente las pantallas 00 y 01; luego comienza la animación.
  function mostrarAnimacion(indice) {
    temaActual = indice;
    const t = TEMAS[temaActual];
    pillTexto.textContent = "Juicio";
    btnFin.hidden = true;
    btnFlechaManual.hidden = true;
    botonesOpcion.forEach((b) => { b.hidden = true; });
    app.dataset.vista = "animacion";
    vOpciones.hidden = true; vAnimacion.hidden = false;

    function iniciarAnimacion() {
      reproducirSecuencia(t.ruta, t.numFrames, () => {
        if (t.bifurcacion) mostrarBifurcacion(t.bifurcacion);
        else mostrarFinales(t.finales);
      });
    }

    // Las pantallas introductorias se detienen hasta que se pulse la flecha violeta.
    mostrarPantallaManual(t.inicio[0], () => {
      mostrarPantallaManual(t.inicio[1], iniciarAnimacion);
    });
  }

  btnFlechaManual.addEventListener("click", () => {
    if (typeof alAvanzarPantallaManual === "function") {
      const avanzar = alAvanzarPantallaManual;
      alAvanzarPantallaManual = null;
      avanzar();
    }
  });

  document.querySelectorAll(".juicio-tema").forEach((boton) => {
    boton.addEventListener("click", () => mostrarAnimacion(Number(boton.dataset.tema)));
  });
  btnFin.addEventListener("click", mostrarOpciones);
  // píldora: animación -> opciones -> inicio del sitio
  pill.addEventListener("click", () => {
    if (app.dataset.vista !== "opciones") mostrarOpciones(); else window.location.href = URL_INICIO_SITIO;
  });

  mostrarOpciones();
})();
