function cargarEventos(idioma) {
  $.getJSON("eventos.json", function (data) {
    let html = "<ul class='eventos-lista'>";

    data.forEach(evento => {
      const mes = evento.mes?.[idioma] || evento.mes?.es || "";
      const nombre = evento.nombre || "";
      const lugar = evento.lugar?.[idioma] || evento.lugar?.es || "";
      const url = evento.url || "#";
      const nota = evento.nota?.[idioma] || "";

      html += `<li>${mes} | <a href="${url}" target="_blank">${nombre} (${lugar})</a>`;
      if (nota) {
        html += ` | ${nota}`;
      }
      html += `</li>`;
    });

    html += "</ul>";
    $("#eventos-lista").html(html);
  });
}

$(document).ready(function () {
  const idioma = localStorage.getItem("idioma") || "es";
  cargarEventos(idioma);
});

// Escucha cambios de idioma
document.addEventListener("cambioIdioma", function (e) {
  const nuevoIdioma = e.detail.idioma;
  cargarEventos(nuevoIdioma);
});
