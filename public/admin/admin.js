// Banner: enviar
document.getElementById("form-banner").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  formData.set("mostrar", e.target.mostrar.checked);

  const res = await fetch('/api/banner', {
    method: 'POST',
    body: formData
  });

  if (res.ok) {
    alert("Banner actualizado correctamente");
    e.target.reset();
  } else {
    alert("Error al actualizar el banner");
  }
});

// ✅ Banner: eliminar
document.getElementById("btn-eliminar-banner").addEventListener("click", async () => {
  if (confirm("¿Seguro que deseas eliminar el banner?")) {
    const res = await fetch("/api/banner", { method: "DELETE" });
    if (res.ok) {
      alert("Banner eliminado correctamente");
    } else {
      alert("Error al eliminar el banner");
    }
  }
});

async function cargarBannerActual() {
  const res = await fetch('/api/banner');
  const data = await res.json();

  const preview = document.getElementById('preview-banner');
  preview.innerHTML = '';

  if (data.url) {
    if (data.tipo === "imagen") {
      preview.innerHTML = `<img src="${data.url}" style="max-width: 100%; height: auto; border: 1px solid #ccc; border-radius: 6px;" />`;
    } else if (data.tipo === "video") {
      preview.innerHTML = `
        <video controls autoplay muted loop style="max-width: 100%; border: 1px solid #ccc; border-radius: 6px;">
          <source src="${data.url}" type="video/mp4">
          Tu navegador no admite el video.
        </video>
      `;
    }
  } else {
    preview.innerHTML = '<p>No hay banner activo.</p>';
  }
}
cargarBannerActual();

document.getElementById("form-sebastiane").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData();

  const anio = form.anio.value;
  const seccion = form.seccion.value;

  const idiomas = ["es", "en", "eu"];
  const campos = ["titulo", "director", "pais", "descripcion"];

  campos.forEach((campo) => {
    const obj = {};
    idiomas.forEach((lang) => {
      const input = form[`${campo}_${lang}`];
      if (input && input.value.trim()) {
        obj[lang] = input.value.trim();
      }
    });
    formData.append(campo, JSON.stringify(obj));
  });

  const imagen = form.imagen.files[0];
  if (imagen) {
    formData.append("imagen", imagen);
  }

  const res = await fetch(`/api/sebastiane/${anio}/${seccion}`, {
    method: "POST",
    body: formData
  });

  if (res.ok) {
    alert("Película añadida correctamente.");
    form.reset();
    cargarPeliculasSebastiane();
  } else {
    alert("Error al guardar la película.");
  }
});

function obtenerTexto(valor) {
  if (typeof valor === "object") {
    return valor["es"] || Object.values(valor)[0] || "";
  }
  return valor;
}

async function cargarPeliculasSebastiane() {
  const anio = document.getElementById("anio-sebastiane").value;
  const seccion = document.getElementById("seccion-sebastiane").value;

  const res = await fetch(`/api/sebastiane/${anio}/${seccion}`);
  const peliculas = await res.json();
  const lista = document.getElementById("lista-sebastiane");
  lista.innerHTML = "";

  if (!peliculas || peliculas.length === 0) {
    lista.innerHTML = "<p>No hay películas en esta sección.</p>";
    return;
  }

  peliculas.forEach((p, index) => {
    const div = document.createElement("div");
    div.className = "pelicula-admin";
    div.innerHTML = `
      <strong>${obtenerTexto(p.titulo)}</strong> - ${obtenerTexto(p.director)} (${obtenerTexto(p.pais)})<br/>
      <button onclick="eliminarPeliculaSebastiane('${anio}', '${seccion}', ${index})">Eliminar</button>
      <hr/>
    `;
    lista.appendChild(div);
  });
}

async function eliminarPeliculaSebastiane(anio, seccion, index) {
  if (confirm("¿Eliminar esta película?")) {
    const res = await fetch(`/api/sebastiane/${anio}/${seccion}/${index}`, {
      method: "DELETE"
    });
    if (res.ok) {
      alert("Película eliminada.");
      cargarPeliculasSebastiane();
    } else {
      alert("Error al eliminar.");
    }
  }
}

// Cargar automáticamente cuando se cambia año o sección
document.getElementById("anio-sebastiane").addEventListener("change", cargarPeliculasSebastiane);
document.getElementById("seccion-sebastiane").addEventListener("change", cargarPeliculasSebastiane);

