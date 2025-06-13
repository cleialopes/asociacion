function cargarEventos(idioma) {
  $.getJSON("/api/eventos", function (data) {
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

fetch("/api/banner-nosotros")
  .then(res => res.json())
  .then(data => {
    if (data.url) {
      const banner = document.getElementById("banner-nosotros");
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

