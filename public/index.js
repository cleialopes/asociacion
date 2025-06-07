function mostrarNoticias(idioma) {
  fetch("noticias.json")
  .then(res => res.json())
  .then(noticias => {
    const contenedor = document.getElementById("contenedor-noticias");
    if (!contenedor) return;

    contenedor.innerHTML = "";

     const ultimas = noticias
      .filter(n => n.titulo?.[idioma] || n.titulo?.es)
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
      .slice(0, 4);

    ultimas.forEach(noticia => {
      const titulo = noticia.titulo[idioma] || noticia.titulo["es"];
      const imagen = noticia.imagenes?.[0] || "img/placeholder.jpg";
      const fecha = noticia.fecha;
      const id = noticia.id;

      const tarjeta = document.createElement("div");
      tarjeta.className = "noticia";

      tarjeta.innerHTML = `
        <a href="ver-noticia.html?id=${id}">
          <img src="${imagen}" alt="${titulo}" class="noticia-imagen">
          <h3>${titulo}</h3>
          <span class="fecha">${fecha}</span>
        </a>
      `;

      contenedor.appendChild(tarjeta);
    });
  })
  .catch(error => {
    console.error("Error cargando noticias:", error);
  });
}
window.mostrarNoticias = mostrarNoticias;

fetch("/api/banner-index")
.then(res => res.json())
.then(data => {
  if (data.url) {
    const banner = document.getElementById("banner-index");
    if (!banner) return;
    banner.classList.remove("oculto");

    if (data.tipo === "imagen") {
      banner.innerHTML = `<img src="${data.url}" alt="Banner" />`;
    } else if (data.tipo === "video") {
      banner.innerHTML = `
        <video autoplay muted loop playsinline>
          <source src="${data.url}" type="video/mp4">
          Tu navegador no admite el video.
        </video>`;
      const video = banner.querySelector("video");
      video.addEventListener("pause", () => video.play());
    }
  }
});

function cargarImagenes() {
  fetch("imagenes.json")
    .then(res => res.json())
    .then(imagenes => {
      const contenedor = document.getElementById("enlaces-imagenes");
      if (!contenedor) return;

      contenedor.innerHTML = ""; // 🟩 Vaciar antes de volver a cargar

      const idioma = localStorage.getItem("idioma") || "es";

      imagenes.forEach(imagen => {
        const titulo = imagen.titulo?.[idioma] || imagen.titulo?.es || "";

        const enlace = document.createElement("a");
        enlace.href = imagen.link;
        enlace.className = "imagen-con-titulo";

        enlace.innerHTML = `
          <img src="${imagen.src}" alt="${imagen.alt}" class="clickeable" />
          <p class="titulo-imagen">${titulo}</p>
        `;

        contenedor.appendChild(enlace);
      });
    })
    .catch(error => {
      console.error("Error cargando imágenes:", error);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const idioma = localStorage.getItem("idioma") || "es";
  mostrarNoticias(idioma);
  cargarImagenes();
});


  