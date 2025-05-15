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
      const contenido = noticia.contenido?.[idioma] || noticia.descripcion?.[idioma] || "";
      const imagenes = noticia.imagenes || [];
      const fotografo = noticia.fotografo || "";

      const galeriaHTML = `
        <div class="carrusel">
          <button class="carrusel-flecha izquierda">‹</button>
          <div class="carrusel-contenedor">
            ${imagenes.map((src, index) => `
              <img src="${src}" alt="${titulo}" class="carrusel-imagen ${index === 0 ? 'activa' : ''}">
            `).join('')}
          </div>
          <button class="carrusel-flecha derecha">›</button>
        </div>
      `;

      contenedor.innerHTML = `
        <h1>${titulo}</h1>
        <p class="descripcion">${descripcion}</p>
        <div class="galeria-imagenes">${galeriaHTML}</div>
        ${fotografo ? `<p class="fotografo">Foto: ${fotografo}</p>` : ""}
        <p class="fecha">${noticia.fecha}</p>
        <div class="contenido-noticia">${contenido}</div>
        <a href="noticias.html" class="btn-leer">← ${traducir("volver")}</a>
      `;

      // 🔁 Carrusel funcional
      let indice = 0;
      const imagenesCarrusel = document.querySelectorAll(".carrusel-imagen");
      const mostrarImagen = (i) => {
        imagenesCarrusel.forEach((img, index) =>
          img.classList.toggle("activa", index === i)
        );
      };

      document.querySelector(".carrusel-flecha.izquierda").addEventListener("click", () => {
        indice = (indice - 1 + imagenesCarrusel.length) % imagenesCarrusel.length;
        mostrarImagen(indice);
      });

      document.querySelector(".carrusel-flecha.derecha").addEventListener("click", () => {
        indice = (indice + 1) % imagenesCarrusel.length;
        mostrarImagen(indice);
      });

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
