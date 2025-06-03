const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const idioma = localStorage.getItem("idioma") || "es";

let noticiaGlobal = null;

fetch("/noticias.json")
  .then(res => res.json())
  .then(noticias => {
    const noticia = noticias.find(n => String(n.id) === id);
    if (noticia) {
      noticiaGlobal = noticia;
      renderizarNoticia(idioma);
    } else {
      document.getElementById("contenido-noticia").innerHTML = "<p>Noticia no encontrada.</p>";
    }
  })
  .catch(err => {
    document.getElementById("contenido-noticia").innerHTML = "<p>Error cargando noticia.</p>";
    console.error(err);
  });
  
  function renderizarContenido(bloques) {
  if (!Array.isArray(bloques)) {
    console.warn("Bloques de contenido no válidos:", bloques);
    return "<p>(Contenido no disponible)</p>";
  }

  function procesarNegrita(texto) {
    return texto.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  }

  return bloques
    .map(bloque => {
      switch (bloque.tipo) {
        case "parrafo":
        case "p":
          return `<p style="white-space: pre-line;">${procesarNegrita(bloque.texto)}</p>`;
        case "lista":
          return `<ul>${bloque.elementos.map(item => `<li>${item}</li>`).join("")}</ul>`;
        case "h3":
          return `<h3>${bloque.texto}</h3>`;
        default:
          return `<p>(Tipo desconocido: ${bloque.tipo})</p>`;
      }
    })
    .join("");
}
function renderizarNoticia(idioma) {
  const contenedor = document.getElementById("contenido-noticia");
  if (!noticiaGlobal) return;

  const titulo = noticiaGlobal.titulo[idioma] || noticiaGlobal.titulo["es"];
  const descripcion = noticiaGlobal.descripcion?.[idioma] || noticiaGlobal.descripcion?.["es"] || "";
  let contenidoBloques = [];

if (Array.isArray(noticiaGlobal.contenido)) {
  contenidoBloques = noticiaGlobal.contenido;
} else if (typeof noticiaGlobal.contenido === "object" && noticiaGlobal.contenido !== null) {
  contenidoBloques = noticiaGlobal.contenido[idioma] || noticiaGlobal.contenido["es"] || [];
}
  const contenidoHTML = renderizarContenido(contenidoBloques);

  const imagenes = noticiaGlobal.imagenes || [];
  const fotografo = noticiaGlobal.fotografo || "";
  let videoURL = noticiaGlobal.video_url;

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

  const anioLink = noticiaGlobal.anio_url
  ? (() => {
      const match = noticiaGlobal.anio_url.match(/anio=(\d{4})/);
      const anio = match ? match[1] : "";
      const textoTraducido = traducir("ver_candidatas_de");
      return `<a href="${noticiaGlobal.anio_url}" class="enlace-anio">${textoTraducido} ${anio}</a>`;
    })()
  : "";

  const galeriaHTML =
    noticiaGlobal.video_local
      ? `<div class="video-contenedor">
          <video controls>
            <source src="${noticiaGlobal.video_local}" type="video/mp4">
            Tu navegador no soporta el video.
          </video>
        </div>`
      : videoURL
      ? `<div class="video-contenedor">
          <iframe src="${videoURL}" frameborder="0" allowfullscreen></iframe>
        </div>`
      : `<div class="carrusel">
          <button class="carrusel-flecha izquierda">‹</button>
          <div class="carrusel-contenedor">
            ${imagenes.map((src, index) => `
              <img src="${src}" alt="${titulo}" class="carrusel-imagen ${index === 0 ? 'activa' : ''}">
            `).join('')}
          </div>
          <button class="carrusel-flecha derecha">›</button>
        </div>`;

  contenedor.innerHTML = `
    <h1>${titulo}</h1>
    <p class="descripcion">${descripcion}</p>
    <div class="galeria-imagenes">${galeriaHTML}</div>
    ${fotografo ? `<p class="fotografo">Foto: ${fotografo}</p>` : ""}
    <p class="fecha">${noticiaGlobal.fecha}</p>
    <div class="contenido-noticia">${contenidoHTML} ${anioLink}</div>
    <a href="noticias.html" class="btn-leer" data-i18n-html="volver">← Volver</a>
  `;
cambiarIdioma(idioma);
  
  const imagenesCarrusel = document.querySelectorAll(".carrusel-imagen");
  const flechaIzquierda = document.querySelector(".carrusel-flecha.izquierda");
  const flechaDerecha = document.querySelector(".carrusel-flecha.derecha");

  if (imagenesCarrusel.length > 0 && flechaIzquierda && flechaDerecha) {
    let indice = 0;
    const mostrarImagen = (i) => {
      imagenesCarrusel.forEach((img, index) =>
        img.classList.toggle("activa", index === i)
      );
    };
    flechaIzquierda.addEventListener("click", () => {
      indice = (indice - 1 + imagenesCarrusel.length) % imagenesCarrusel.length;
      mostrarImagen(indice);
    });
    flechaDerecha.addEventListener("click", () => {
      indice = (indice + 1) % imagenesCarrusel.length;
      mostrarImagen(indice);
    });
  }
}
function traducir(clave) {
  const idioma = localStorage.getItem("idioma") || "es";
  return window.traducciones?.[idioma]?.[clave] || clave;
}

const selector = document.getElementById("selector-idioma");
if (selector) {
  selector.addEventListener("change", () => {
    const nuevoIdioma = selector.value;
    renderizarNoticia(nuevoIdioma);
  });
}

