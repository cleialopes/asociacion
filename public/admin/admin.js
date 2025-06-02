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

  const anio = form.anio.value;
  const seccion = form.seccion.value;

  const idiomas = ["es", "en", "eu"];
  const campos = ["titulo", "pais", "descripcion"];
  const pelicula = {};

  // Construye los campos multilingües como objetos reales
  campos.forEach((campo) => {
    const obj = {};
    idiomas.forEach((lang) => {
      const input = form[`${campo}_${lang}`];
      if (input && input.value.trim()) {
        obj[lang] = input.value.trim();
      }
    });
    pelicula[campo] = obj;
  });

  pelicula.director = form.director_es?.value.trim() || "";
  
  // Agrega el campo video
  pelicula.video = form.video?.value.trim() || "";

  // Subir imagen si se proporciona
  const imagen = form.imagen.files[0];
  if (imagen) {
    const imgForm = new FormData();
    imgForm.append("imagen", imagen);
    const uploadRes = await fetch("/api/upload", {
      method: "POST",
      body: imgForm
    });
    const data = await uploadRes.json();
    pelicula.imagen = data.url || "";
  } else {
    pelicula.imagen = "";
  }

  const anioCompleto = form.anio_completo?.value.trim();
  pelicula.año = anioCompleto || `${anio} | ?`;

  // Enviar JSON estructurado al backend
  const res = await fetch(`/api/sebastiane/${anio}/${seccion}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pelicula)
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
  return valor || "";
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
      <strong>${obtenerTexto(p.titulo)}</strong> - ${p.director} (${obtenerTexto(p.pais)})<br/>
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

// san sebastiane Latino
document.getElementById("form-sebastiane-latino").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;

  const anio = form.anio.value;
  const seccion = form.seccion.value;

  const idiomas = ["es", "en", "eu"];
  const campos = ["titulo", "pais", "descripcion"];
  const pelicula = {};

  campos.forEach((campo) => {
    const obj = {};
    idiomas.forEach((lang) => {
      const input = form[`${campo}_${lang}`];
      if (input && input.value.trim()) {
        obj[lang] = input.value.trim();
      }
    });
    pelicula[campo] = obj;
  });

  pelicula.director = { es: form.director_es?.value.trim() || "" };
  pelicula.video = form.video?.value.trim() || "";

  const imagen = form.imagen.files[0];
  if (imagen) {
    const imgForm = new FormData();
    imgForm.append("imagen", imagen);
    const uploadRes = await fetch("/api/upload", { method: "POST", body: imgForm });
    const data = await uploadRes.json();
    pelicula.imagen = data.url || "";
  } else {
    pelicula.imagen = "";
  }

  pelicula.año = form.anio_completo?.value.trim() || `${anio} | ?`;

  const res = await fetch(`/api/sebastiane_latino/${anio}/${seccion}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pelicula)
  });

  if (res.ok) {
    alert("Película añadida correctamente.");
    form.reset();
    cargarPeliculasSebastianeLatino();
  } else {
    alert("Error al guardar la película.");
  }
});

async function cargarPeliculasSebastianeLatino() {
  const anio = document.getElementById("anio-sebastiane-latino").value;
  const seccion = document.getElementById("seccion-sebastiane-latino").value;

  const res = await fetch(`/api/sebastiane_latino/${anio}/${seccion}`);
  const peliculas = await res.json();
  const lista = document.getElementById("lista-sebastiane-latino");
  lista.innerHTML = "";

  if (!peliculas || peliculas.length === 0) {
    lista.innerHTML = "<p>No hay películas en esta sección.</p>";
    return;
  }

  peliculas.forEach((p, index) => {
    const div = document.createElement("div");
    div.className = "pelicula-admin";
    div.innerHTML = `
      <strong>${obtenerTexto(p.titulo)}</strong> - ${p.director?.es || ""} (${obtenerTexto(p.pais)})<br/>
      <button onclick="eliminarPeliculaSebastianeLatino('${anio}', '${seccion}', ${index})">Eliminar</button>
      <hr/>
    `;
    lista.appendChild(div);
  });
}

async function eliminarPeliculaSebastianeLatino(anio, seccion, index) {
  if (confirm("¿Eliminar esta película?")) {
    const res = await fetch(`/api/sebastiane_latino/${anio}/${seccion}/${index}`, {
      method: "DELETE"
    });
    if (res.ok) {
      alert("Película eliminada.");
      cargarPeliculasSebastianeLatino();
    } else {
      alert("Error al eliminar.");
    }
  }
}

document.getElementById("anio-sebastiane-latino").addEventListener("change", cargarPeliculasSebastianeLatino);
document.getElementById("seccion-sebastiane-latino").addEventListener("change", cargarPeliculasSebastianeLatino);

// Noticias
document.getElementById("form-noticia").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;

  const noticia = {
    id: Date.now(), // numérico
    titulo: {
      es: form.titulo_es.value.trim(),
      en: form.titulo_en.value.trim(),
      eu: form.titulo_eu.value.trim()
    },
    descripcion: {
      es: form.descripcion_es.value.trim(),
      en: form.descripcion_en.value.trim(),
      eu: form.descripcion_eu.value.trim()
    },
    contenido: [],
    fecha: form.fecha.value || "",
    imagenes: [],
    fotografo: form.fotografo.value.trim(),
    anio_url: form.anio_url.value.trim()
  };

  const idiomas = ["es", "en", "eu"];
  noticia.contenido = {};

  idiomas.forEach(idioma => {
    const bloques = [];
    const h3 = form[`contenido_h3_${idioma}`]?.value.trim();
    const p = form[`contenido_p_${idioma}`]?.value.trim();
    if (h3) bloques.push({ tipo: "h3", texto: h3 });
    if (p) bloques.push({ tipo: "p", texto: p });
    if (bloques.length > 0) noticia.contenido[idioma] = bloques;
  });


  const files = form.imagenes.files;
  for (let file of files) {
    const imgForm = new FormData();
    imgForm.append("imagen", file);
    const uploadRes = await fetch("/api/upload", {
      method: "POST",
      body: imgForm
    });
    const data = await uploadRes.json();
    if (data?.url) {
      noticia.imagenes.push(data.url);
    }
  }

  const res = await fetch("/api/noticias", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(noticia)
  });

  if (res.ok) {
    alert("Noticia guardada.");
    form.reset();
    cargarNoticiasAdmin();
  } else {
    alert("Error al guardar la noticia.");
  }
});

async function cargarNoticiasAdmin() {
  const res = await fetch("/api/noticias");
  const noticias = await res.json();
  const lista = document.getElementById("lista-noticias");
  lista.innerHTML = "";

  const filtroFecha = document.getElementById("filtro-fecha-noticia")?.value;

  const noticiasFiltradas = filtroFecha
    ? noticias.filter(n => n.fecha === filtroFecha)
    : noticias;

  if (!noticiasFiltradas || noticiasFiltradas.length === 0) {
    lista.innerHTML = "<p>No hay noticias para esta fecha.</p>";
    return;
  }

  noticiasFiltradas.forEach((n, index) => {
    const div = document.createElement("div");
    div.className = "pelicula-admin";
    div.innerHTML = `
      <strong>${n.titulo?.es || "Sin título"}</strong> <br/>
      <small>Fecha: ${n.fecha || "N/A"}</small><br/>
      <button onclick="eliminarNoticia(${index})">Eliminar</button>
      <hr/>
    `;
    lista.appendChild(div);
  });
}
cargarNoticiasAdmin();
document.getElementById("filtro-fecha-noticia")?.addEventListener("change", cargarNoticiasAdmin);
window.eliminarNoticia = eliminarNoticia;


