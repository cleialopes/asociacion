$(document).ready(function () {
  $.getJSON("encuentros.json", function (data) {
    let html = '';
    const idioma = localStorage.getItem("idioma") || "es";

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
});
