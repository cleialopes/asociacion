document.addEventListener("DOMContentLoaded", () => {
  let noticiasCargadas = 0;
  const noticiasPorLote = 8;
  let todasLasNoticias = [];
  window.idiomaActual = localStorage.getItem("idioma") || "es";

  function mostrarNoticias(idioma = idiomaActual) {
    idiomaActual = idioma; 
    const contenedor = document.getElementById("contenedor-noticias");
    const siguienteLote = todasLasNoticias.slice(noticiasCargadas, noticiasCargadas + noticiasPorLote);

    siguienteLote.forEach(noticia => {
      const titulo = (noticia.titulo && (noticia.titulo[idioma] || noticia.titulo["es"])) || "Sin título";
      const contenidoHTML = renderContenidoNoticia(noticia.contenido?.[idioma] || []);
      const imagen = noticia.imagenes?.[0] || "img/Una-proyección-1.webp";
      const videoLocal = noticia.video_local;
      let videoURL = noticia.video_url;

      if (videoURL?.includes("youtube.com/watch?v=")) {
        const id = videoURL.split("v=")[1].split("&")[0];
        videoURL = `https://www.youtube.com/embed/${id}?modestbranding=1&rel=0`;
      }
      if (videoURL?.includes("youtu.be/")) {
        const id = videoURL.split("/").pop();
        videoURL = `https://www.youtube.com/embed/${id}?modestbranding=1&rel=0`;
      }
      if (videoURL?.includes("youtube.com/embed/") && !videoURL.includes("modestbranding")) {
        videoURL += "?modestbranding=1&rel=0";
      }

      const card = document.createElement("div");
      card.className = "noticia modo-claro-oscuro";
      card.innerHTML = `
      ${imagen && imagen.trim() !== "" ? `
        <a href="ver-noticia.html?id=${noticia.id}">
          <img src="${imagen}" alt="${titulo}" class="noticia-imagen">
        </a>` 
      : videoLocal
        ? `<video class="noticia-video" controls>
            <source src="${videoLocal}" type="video/mp4">
            Tu navegador no soporta el video.
          </video>`
        : videoURL
        ? `<iframe class="noticia-video" src="${videoURL}" frameborder="0" allowfullscreen></iframe>`
        : ""}
      <h3>${titulo}</h3>
    `;
      contenedor.appendChild(card);
    });

    noticiasCargadas += siguienteLote.length;

    const btn = document.getElementById("btn-cargar-mas");
    if (btn && noticiasCargadas >= todasLasNoticias.length) {
      btn.style.display = "none";
    }
  }

  function reiniciarNoticias(nuevoIdioma) {
    idiomaActual = nuevoIdioma;
    const contenedor = document.getElementById("contenedor-noticias");
    contenedor.innerHTML = "";
    noticiasCargadas = 0;

    const btn = document.getElementById("btn-cargar-mas");
    if (btn) {
      btn.style.display = "block";
    }

    mostrarNoticias();
  }

  fetch('/noticias.json')
    .then(res => res.json())
    .then(noticias => {
  todasLasNoticias = noticias;
  const idioma = localStorage.getItem("idioma") || "es";
  mostrarNoticias(idioma); 

  const btn = document.getElementById("btn-cargar-mas");
  if (btn) {
    btn.style.display = "block";
    btn.addEventListener("click", () => mostrarNoticias(idiomaActual));
  }
  window.reiniciarNoticiasDesdeI18n = function (lang) {
  window.idiomaActual = lang;
  noticiasCargadas = 0;
  const contenedor = document.getElementById("contenedor-noticias");
  contenedor.innerHTML = "";

  const btn = document.getElementById("btn-cargar-mas");
  if (btn) btn.style.display = "block";

  mostrarNoticias(lang);
};
});

  function procesarNegrita(texto) {
    return texto.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  }

  function renderContenidoNoticia(bloques = []) {
  return bloques.map(bloque => {
    if (bloque.tipo === "h3") {
      return `<h3>${bloque.texto}</h3>`;
    }
    if (bloque.tipo === "p") {
      return `<p style="white-space: pre-line;">${procesarNegrita(bloque.texto)}</p>`;
    }
    return "";
  }).join("");
}

  document.querySelectorAll("[data-set-lang]").forEach(btn => {
    btn.addEventListener("click", e => {
      const nuevoIdioma = btn.getAttribute("data-set-lang");
      localStorage.setItem("idioma", nuevoIdioma);
      reiniciarNoticias(nuevoIdioma);
    });
  });
});
