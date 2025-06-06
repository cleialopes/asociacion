$(document).ready(function () {
  $.getJSON("encuentros.json", function (data) {
    let html = '';
    const idioma = localStorage.getItem("idioma") || "es";

    cargarEncuentros(idioma);
    renderizarListaFestivales(idioma);

    data.forEach(encuentros => {
      const titulo = encuentros.titulo?.[idioma] || encuentros.titulo?.es || "Sin título";
      const primeraImagen = encuentros.imagenes?.[0];

      if (!primeraImagen || primeraImagen.trim() === "") return;

      html += `
        <article class="encuentros-card">
          <a href="ver-encuentro.html?id=${encuentros.id}">
            <img src="${primeraImagen}" alt="${titulo}" />
            <h3>${titulo}</h3>
          </a>
        </article>
      `;
    });
    $('#contenedor-encuentros').html(html);
  });
  fetch("/api/banner-encuentros")
  .then(res => res.json())
  .then(data => {
    if (data.url) {
      const banner = document.getElementById("banner-encuentros");
      if (!banner) return;
      banner.classList.remove("oculto");

      if (data.tipo === "imagen") {
        banner.innerHTML = `<img src="${data.url}" alt="Banner Encuentros" />`;
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

});

function cargarEncuentros(idioma) {
  $.getJSON("encuentros.json", function (data) {
    let html = '';

    data.forEach(encuentros => {
      const titulo = encuentros.titulo?.[idioma] || encuentros.titulo?.es || "Sin título";
      const primeraImagen = encuentros.imagenes?.[0];

      if (!primeraImagen || primeraImagen.trim() === "") return;

      html += `
        <article class="encuentros-card">
          <a href="ver-encuentro.html?id=${encuentros.id}">
            <img src="${primeraImagen}" alt="${titulo}" />
            <h3>${titulo}</h3>
          </a>
        </article>
      `;
    });

    $('#contenedor-encuentros').html(html);
  });
}

function renderizarListaFestivales(idioma) {
  $.getJSON("festivales.json", function (data) {
    $(".eventos-lista").remove();

    let listaHtml = "<ul class='eventos-lista'>";

    data.forEach(festival => {
      const nombre = festival.nombre?.[idioma] || festival.nombre.es;
      const ubicacion = festival.ubicacion?.[idioma] || festival.ubicacion.es;
      const url = festival.url?.trim() || "#";

      listaHtml += `
        <li>
          <a href="${url}" target="_blank">${nombre}</a> (${ubicacion})
        </li>
      `;
    });

    listaHtml += "</ul>";
    $(".encuentros_texto").append(listaHtml);
  });
}

document.addEventListener("cambioIdioma", function (e) {
  const nuevoIdioma = e.detail.idioma;
  cargarEncuentros(nuevoIdioma);
  renderizarListaFestivales(nuevoIdioma);
});