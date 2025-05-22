let noticiasCargadas = 0;
const noticiasPorLote = 8;
let todasLasNoticias = [];

const idioma = localStorage.getItem("idioma") || "es";

fetch('noticias.json')
  .then(res => res.json())
  .then(noticias => {
    todasLasNoticias = noticias;
    mostrarNoticias();
  })
  .catch(error => console.error("Error al cargar las noticias:", error));

function mostrarNoticias() {
  const contenedor = document.getElementById("contenedor-noticias");
  const siguienteLote = todasLasNoticias.slice(noticiasCargadas, noticiasCargadas + noticiasPorLote);

  siguienteLote.forEach(noticia => {
    const titulo = noticia.titulo[idioma] || noticia.titulo["es"];
    const descripcion = noticia.descripcion[idioma] || noticia.descripcion["es"];
    const imagen = noticia.imagenes?.[0] || "img/Una-proyección-1.webp";
    const fotografo = noticia.fotografo || "";
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
const anioLink = noticia.anio_url
  ? `<a href="${noticia.anio_url}" class="enlace-anio">Ver noticias de ${new Date(noticia.fecha).getFullYear()}</a>`
  : "";
    const card = document.createElement("div");
    card.className = "noticia modo-claro-oscuro";
    card.innerHTML = `
  ${
    imagen && imagen.trim() !== ""
      ? `<img src="${imagen}" alt="${titulo}" class="noticia-imagen">`
      : videoLocal
      
      ? `<video class="noticia-video" controls>
           <source src="${videoLocal}" type="video/mp4">
           Tu navegador no soporta el video.
         </video>`
      : videoURL
      ? `<iframe class="noticia-video" src="${videoURL}" frameborder="0" allowfullscreen></iframe>`
      : ""
  }
  <h3><a href="ver-noticia.html?id=${noticia.id}">${titulo}</a></h3>
  ${anioLink}
`;
    contenedor.appendChild(card);
  });

  noticiasCargadas += noticiasPorLote;

  if (noticiasCargadas >= todasLasNoticias.length) {
    document.getElementById("btn-cargar-mas").style.display = "none";
  }
}

document.getElementById("btn-cargar-mas").addEventListener("click", mostrarNoticias);

function traducir(clave) {
  const traducciones = {
    leer_mas: {
      es: "Seguir leyendo",
      eu: "Irakurri gehiago",
      en: "Read more"
    }
  };
  return traducciones[clave]?.[idioma] || clave;
}
