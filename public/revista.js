fetch("revista.json")
  .then(res => res.json())
  .then(data => {
    const contenedor = document.getElementById("lista-revistas");
    data.forEach(revista => {
      const div = document.createElement("div");
      div.className = "revista modo-claro-oscuro";
      div.innerHTML = `
        <img src="${revista.portada}" alt="${revista.titulo}">
        <h2>${revista.titulo}</h2>
        <button class="btn-revista" data-pdf="${revista.archivo}">Ver PDF</button>
      `;
      contenedor.appendChild(div);
    });

    // Abrir visor FlowPaper (con iframe)
    document.querySelectorAll(".btn-revista").forEach(btn => {
  btn.addEventListener("click", () => {
    const archivo = btn.getAttribute("data-pdf");
    console.log("Botón presionado. Archivo:", archivo); // 👈 DEBUG

    if (!archivo) {
      alert("Error: el botón no tiene un archivo válido.");
      return;
    }

    const visor = document.getElementById("visor-flowpaper");
    const contenedorFlip = document.getElementById("flipbook-container");

    visor.classList.remove("oculto");

    contenedorFlip.innerHTML = `
      <iframe 
        src="FlowPaper/index.html?PDF=/${archivo}"
        style="width:100%; height:100%; border:none;">
      </iframe>
    `;
  });
});
  })
  .catch(error => console.error("Error cargando revistas:", error));

// Botón cerrar visor
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("cerrar-flowpaper").addEventListener("click", () => {
    document.getElementById("visor-flowpaper").classList.add("oculto");
    document.getElementById("flipbook-container").innerHTML = "";
  });
});