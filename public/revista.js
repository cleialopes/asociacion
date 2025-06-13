window.etiquetas = window.etiquetas || {
  programa: {
    es: "Programa",
    eu: "Programa",
    en: "Program"
  },
  cartel: {
    es: "Cartel",
    eu: "Kartela",
    en: "Poster"
  },
  memoria: {
    es: "Memoria",
    eu: "Txostena",
    en: "Report"
  }
};

function cargarRevistas() {
  const idioma = localStorage.getItem("idioma") || "es";
  fetch('/api/revistas')
  .then(res => res.json())
  .then(data => {
    const contenedor = document.getElementById("lista-revistas");
    contenedor.innerHTML = "";

    data.forEach(revista => {
      const div = document.createElement("div");
      div.className = "revista modo-claro-oscuro";
      const archivoPDF = revista.archivo[idioma] || revista.archivo["es"];

     div.innerHTML = `
      <a href="${archivoPDF}" target="_blank">
        <img src="${revista.portada}" alt="${revista.titulo[idioma]}" class="portada-revista">
      </a>
      <h2>${revista.titulo[idioma] || revista.titulo["es"]}</h2>
    `;
      contenedor.appendChild(div);
    });
  });
}

function cargarDocumentos() {
  const idioma = localStorage.getItem("idioma") || "es";
  fetch('/api/documentos')
    .then(res => res.json())
    .then(data => {
      const columnas = {
        programa: document.querySelector('.columna:nth-child(1) ul'),
        cartel: document.querySelector('.columna:nth-child(2) ul'),
        memoria: document.querySelector('.columna:nth-child(3) ul')
      };

      columnas.programa.innerHTML = "";
      columnas.cartel.innerHTML = "";
      columnas.memoria.innerHTML = "";

      data.forEach(doc => {
        const archivo = doc.archivos[idioma] || doc.archivos["es"];
        if (archivo) {
          const li = document.createElement("li");
          li.innerHTML = `
            <span>${etiquetas[doc.tipo][idioma]} ${doc.anio}</span>
            <ul class="idiomas">
              <li><a href="${archivo}" target="_blank">${(doc.archivos[idioma] ? idioma : "es").toUpperCase()}</a></li>
            </ul>
          `;
          columnas[doc.tipo].appendChild(li);
        }
      });
    });
}

document.addEventListener('DOMContentLoaded', () => {

  if (typeof cargarRevistas === 'function') {
    cargarRevistas();
  }
  if (typeof cargarDocumentos === 'function') {
    cargarDocumentos();
  }
});
