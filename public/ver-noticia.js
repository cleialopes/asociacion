const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get("id"));

fetch("noticias.json")
  .then(res => res.json())
  .then(noticias => {
    const noticia = noticias.find(n => n.id === id);
    const contenedor = document.getElementById("contenido-noticia");

    if (noticia) {
      contenedor.innerHTML = `
        <h1>${noticia.titulo}</h1>
        <img src="${noticia.imagen}" alt="${noticia.titulo}" class="noticia-imagen">
        <p class="fecha">${noticia.fecha}</p>
        <p>${noticia.contenido}</p>
        <a href="noticias.html" class="btn-leer">← Volver a noticias</a>
      `;
    } else {
      contenedor.innerHTML = "<p>Noticia no encontrada.</p>";
    }
  })
  .catch(err => {
    document.getElementById("contenido-noticia").innerHTML = "<p>Error cargando noticia.</p>";
    console.error(err);
  });
