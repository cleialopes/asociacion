const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get("id"));
const idioma = localStorage.getItem("idioma") || "es";

fetch("noticias.json")
  .then(res => res.json())
  .then(noticias => {
    const noticia = noticias.find(n => n.id === id);
    const contenedor = document.getElementById("contenido-noticia");

    if (noticia) {
      const titulo = noticia.titulo[idioma] || noticia.titulo["es"];
      const descripcion = noticia.descripcion?.[idioma] || noticia.descripcion?.["es"] || "";
      const contenidoBloques = noticia.contenido?.[idioma] || noticia.contenido?.["es"] || [];
      const contenidoHTML = renderizarContenido(contenidoBloques);

      const imagenes = noticia.imagenes || [];
      const fotografo = noticia.fotografo || "";
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

      const galeriaHTML =
        noticia.video_local
          ? `<div class="video-contenedor">
              <video controls>
                <source src="${noticia.video_local}" type="video/mp4">
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
        <p class="fecha">${noticia.fecha}</p>
        <div class="contenido-noticia">${contenidoHTML}</div>
        <a href="noticias.html" class="btn-leer">← ${traducir("volver")}</a>
      `;

      // Carrusel funcional
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

    } else {
      contenedor.innerHTML = "<p>Noticia no encontrada.</p>";
    }
  })
  .catch(err => {
    document.getElementById("contenido-noticia").innerHTML = "<p>Error cargando noticia.</p>";
    console.error(err);
  });

function traducir(clave) {
  const traducciones = {
    volver: {
      es: "Volver a noticias",
      eu: "Albisteetara itzuli",
      en: "Back to news"
    }
  };
  return traducciones[clave]?.[idioma] || clave;
}

function renderizarContenido(bloques) {
  return bloques.map(bloque => {
    const tag = bloque.tipo;
    const texto = bloque.texto;
    return `<${tag}>${texto}</${tag}>`;
  }).join("");
}
