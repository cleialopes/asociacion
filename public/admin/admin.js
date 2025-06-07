// ===== Gestión Banner Index =====
document.getElementById("form-banner-index").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const tipo = form.tipo.value;
  const archivo = form.archivo.files[0];
  let url = "";

  if (archivo) {
    const esVideo = tipo === "video";
    const extensionesValidas = esVideo ? ["mp4"] : ["jpg", "jpeg", "png", "webp"];
    const extension = archivo.name.split(".").pop().toLowerCase();

    if (!extensionesValidas.includes(extension)) {
      alert(`Formato inválido. Solo se permiten: ${extensionesValidas.join(", ")}`);
      return;
    }

    const formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("tipo", tipo);

    const res = await fetch('/api/banner-index', {
      method: 'POST',
      body: formData
    });

    if (res.ok) {
      alert("Banner de la home actualizado correctamente");
      form.reset();
      cargarBannerIndex();
    } else {
      alert("Error al actualizar el banner de la home");
    }

    return;
  }
  const actual = await fetch("/api/banner-index").then(r => r.json());
  url = actual.url || "";

  const bannerData = { tipo, url };

  const res = await fetch('/api/banner-index', {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bannerData)
  });

  if (res.ok) {
    alert("Banner de la home actualizado correctamente");
    form.reset();
    cargarBannerIndex();
  } else {
    alert("Error al actualizar el banner de la home");
  }
});

document.getElementById("btn-eliminar-banner-index").addEventListener("click", async () => {
  if (confirm("¿Seguro que deseas eliminar el banner de la home?")) {
    const res = await fetch("/api/banner-index", { method: "DELETE" });
    if (res.ok) {
      alert("Banner eliminado correctamente");
      cargarBannerIndex();
    } else {
      alert("Error al eliminar el banner");
    }
  }
});

async function cargarBannerIndex() {
  const res = await fetch('/api/banner-index');
  const data = await res.json();

  const preview = document.getElementById('preview-banner-index');
  preview.innerHTML = '';

  if (data.url) {
    if (data.tipo === "imagen") {
      preview.innerHTML = `<img src="${data.url}" style="max-width: 100%; border-radius: 6px; border: 1px solid #ccc;" />`;
    } else if (data.tipo === "video") {
      preview.innerHTML = `
        <video autoplay muted loop controls style="max-width: 100%; border-radius: 6px; border: 1px solid #ccc;">
          <source src="${data.url}" type="video/mp4">
          Tu navegador no admite el video.
        </video>`;
    }
  } else {
    preview.innerHTML = '<p>No hay banner cargado.</p>';
  }

  const form = document.getElementById("form-banner-index");
  form.tipo.value = data.tipo || "imagen";
}
cargarBannerIndex();

// ===== Gestión Banner Nosotros =====
document.getElementById("form-banner-nosotros")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const tipo = form.tipo.value;
  const archivo = form.archivo.files[0];
  const url = form.url.value;

  if (archivo) {
    const esVideo = tipo === "video";
    const extensionesValidas = esVideo ? ["mp4"] : ["jpg", "jpeg", "png", "webp"];
    const extension = archivo.name.split(".").pop().toLowerCase();

    if (!extensionesValidas.includes(extension)) {
      alert(`Formato inválido. Solo se permiten: ${extensionesValidas.join(", ")}`);
      return;
    }
  }

  const formData = new FormData();
  formData.append("tipo", tipo);
  formData.append("url", url);
  if (archivo) formData.append("archivo", archivo);

  const res = await fetch("/api/banner-nosotros", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (data.ok) {
    alert("Banner guardado correctamente");
    cargarBannerNosotros();
  } else {
    alert("Error al guardar el banner");
  }
});

async function cargarBannerNosotros() {
  const res = await fetch("/api/banner-nosotros");
  const data = await res.json();

  const form = document.getElementById("form-banner-nosotros");
  if (form) {
    if (form.tipo) form.tipo.value = data.tipo || "imagen";
    if (form.url) form.url.value = data.url || "";
  }

  const contenedor = document.getElementById("preview-banner-nosotros");
  contenedor.innerHTML = "";

  if (data.url) {
    if (data.tipo === "imagen") {
      contenedor.innerHTML = `<img src="${data.url}" style="max-width: 100%; border-radius: 6px; border: 1px solid #ccc;" />`;
    } else if (data.tipo === "video") {
      contenedor.innerHTML = `
        <video autoplay muted loop controls style="max-width: 100%; border-radius: 6px; border: 1px solid #ccc;">
          <source src="${data.url}" type="video/mp4">
          Tu navegador no admite el video.
        </video>`;
    }
  } else {
    contenedor.innerHTML = '<p>No hay banner cargado.</p>';
  }
}

document.getElementById("btn-eliminar-banner-nosotros")?.addEventListener("click", async () => {
  if (!confirm("¿Seguro que deseas eliminar el banner?")) return;

  const res = await fetch("/api/banner-nosotros", {
    method: "DELETE",
  });

  const data = await res.json();
  if (data.ok) {
    alert("Banner eliminado correctamente");
    cargarBannerNosotros();
  } else {
    alert("Error al eliminar el banner");
  }
});
cargarBannerNosotros();

// ===== Gestión Banner Voluntaries =====
document.getElementById("form-banner-voluntaries")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const tipo = form.tipo.value;
  const archivo = form.archivo.files[0];
  const url = form.url.value;

  if (archivo) {
    const esVideo = tipo === "video";
    const extensionesValidas = esVideo ? ["mp4"] : ["jpg", "jpeg", "png", "webp"];
    const extension = archivo.name.split(".").pop().toLowerCase();

    if (!extensionesValidas.includes(extension)) {
      alert(`Formato inválido. Solo se permiten: ${extensionesValidas.join(", ")}`);
      return;
    }
  }

  const formData = new FormData();
  formData.append("tipo", tipo);
  formData.append("url", url);
  if (archivo) formData.append("archivo", archivo);

  const res = await fetch("/api/banner-voluntaries", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (data.ok) {
    alert("Banner guardado correctamente");
    cargarBannerVoluntaries();
  } else {
    alert("Error al guardar el banner");
  }
});

async function cargarBannerVoluntaries() {
  const res = await fetch("/api/banner-voluntaries");
  const data = await res.json();

  const contenedor = document.getElementById("preview-banner-voluntaries");
  contenedor.innerHTML = "";

  if (data.url) {
    if (data.tipo === "imagen") {
      contenedor.innerHTML = `<img src="${data.url}" style="max-width: 100%; height: auto; border: 1px solid #ccc; border-radius: 6px;" />`;
    } else if (data.tipo === "video") {
      contenedor.innerHTML = `
        <video controls autoplay muted loop style="max-width: 100%; border: 1px solid #ccc; border-radius: 6px;">
          <source src="${data.url}" type="video/mp4">
          Tu navegador no admite el video.
        </video>
      `;
    }
  } else {
    contenedor.innerHTML = "<p>No hay banner cargado.</p>";
  }

  const form = document.getElementById("form-banner-voluntaries");
  if (form?.tipo) form.tipo.value = data.tipo || "imagen";
  if (form?.url) form.url.value = data.url || "";
}

document.getElementById("btn-eliminar-banner-voluntaries")?.addEventListener("click", async () => {
  if (!confirm("¿Seguro que deseas eliminar el banner?")) return;

  const res = await fetch("/api/banner-voluntaries", {
    method: "DELETE",
  });

  const data = await res.json();
  if (data.ok) {
    alert("Banner eliminado correctamente");
    cargarBannerVoluntaries();
  } else {
    alert("Error al eliminar el banner");
  }
});
cargarBannerVoluntaries();

// =====Gestion Banner Sebastiane=====
document.getElementById("form-banner").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const archivo = form.archivo.files[0];
  const tipo = form.tipo.value;

  if (archivo) {
    const esVideo = tipo === "video";
    const extensionesValidas = esVideo ? ["mp4"] : ["jpg", "jpeg", "png", "webp"];
    const extension = archivo.name.split(".").pop().toLowerCase();

    if (!extensionesValidas.includes(extension)) {
      alert(`Formato inválido. Solo se permiten: ${extensionesValidas.join(", ")}`);
      return;
    }
  }

  const formData = new FormData(form); 

  const res = await fetch('/api/banner', {
    method: 'POST',
    body: formData
  });

  if (res.ok) {
    alert("Banner actualizado correctamente");
    form.reset();
    cargarBannerActual();
  } else {
    alert("Error al actualizar el banner");
  }
});

document.getElementById("btn-eliminar-banner").addEventListener("click", async () => {
  if (confirm("¿Seguro que deseas eliminar el banner?")) {
    const res = await fetch("/api/banner", { method: "DELETE" });
    if (res.ok) {
      alert("Banner eliminado correctamente");
      cargarBannerActual();
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

  const form = document.getElementById("form-banner");
  if (form.tipo) form.tipo.value = data.tipo || "imagen";
}
cargarBannerActual();

// =====Gestion banner sebastiane latino=====
document.getElementById("form-banner-sebastiane-latino").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const archivo = formData.get("archivo");
  const tipo = formData.get("tipo");
  const esVideo = tipo === "video";
  const extensionesValidas = esVideo ? ["mp4"] : ["jpg", "jpeg", "png", "webp"];
  const extension = archivo?.name?.split(".").pop().toLowerCase();

  if (archivo && !extensionesValidas.includes(extension)) {
    alert(`Formato inválido. Solo se permiten: ${extensionesValidas.join(", ")}`);
    return;
  }

  const res = await fetch("/api/banner-sebastiane-latino", {
    method: "POST",
    body: formData
  });

  if (res.ok) {
    alert("Banner actualizado correctamente");
    e.target.reset();
    cargarBannerSebastianeLatino();
  } else {
    alert("Error al actualizar el banner");
  }
});

document.getElementById("btn-eliminar-banner-sebastiane-latino").addEventListener("click", async () => {
  if (confirm("¿Seguro que deseas eliminar el banner?")) {
    const res = await fetch("/api/banner-sebastiane-latino", { method: "DELETE" });
    if (res.ok) {
      alert("Banner eliminado correctamente");
      cargarBannerSebastianeLatino();
    } else {
      alert("Error al eliminar el banner");
    }
  }
});

async function cargarBannerSebastianeLatino() {
  const res = await fetch("/api/banner-sebastiane-latino");
  const data = await res.json();
  const preview = document.getElementById("preview-banner-sebastiane-latino");
  preview.innerHTML = "";

  if (data.url) {
    if (data.tipo === "imagen") {
      preview.innerHTML = `<img src="${data.url}" style="max-width: 100%; height: auto; border: 1px solid #ccc; border-radius: 6px;" />`;
    } else if (data.tipo === "video") {
      preview.innerHTML = `
        <video controls autoplay muted loop style="max-width: 100%; border: 1px solid #ccc; border-radius: 6px;">
          <source src="${data.url}" type="video/mp4">
          Tu navegador no admite el video.
        </video>`;
    }
  } else {
    preview.innerHTML = "<p>No hay banner activo.</p>";
  }

  const form = document.getElementById("form-banner-sebastiane-latino");
  if (form.tipo) form.tipo.value = data.tipo || "imagen";
}
cargarBannerSebastianeLatino();

// === Gestión de Imágenes Home ===
document.getElementById("form-imagen")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const imagen = form.imagen.files[0];

  if (!imagen) {
    alert("Debes seleccionar una imagen.");
    return;
  }

  const extensionesValidas = ["jpg", "jpeg", "png", "webp"];
  const extension = imagen.name.split(".").pop().toLowerCase();
  if (!extensionesValidas.includes(extension)) {
    alert("Formato inválido. Solo se permiten: jpg, jpeg, png, webp.");
    return;
  }

  const formData = new FormData();
  formData.append("imagen", imagen);
  formData.append("alt", form.alt.value);
  formData.append("titulo_es", form.titulo_es.value);
  formData.append("titulo_en", form.titulo_en.value);
  formData.append("titulo_eu", form.titulo_eu.value);
  formData.append("link", form.link.value);

  const res = await fetch("/api/imagenes", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (data.ok) {
    alert("Imagen guardada correctamente.");
    form.reset();
    cargarImagenesAdmin();
  } else {
    alert("Error al guardar la imagen.");
  }
});

async function cargarImagenesAdmin() {
  const contenedor = document.getElementById("lista-imagenes");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  const res = await fetch("/imagenes.json?" + Date.now());
  const imagenes = await res.json();

  imagenes.forEach((img, index) => {
    const div = document.createElement("div");
    div.className = "imagen-item";
    div.innerHTML = `
      <img src="${img.src}" alt="${img.alt}" style="max-height: 100px; margin: 10px 0; border-radius: 6px;" />
      <p><strong>ES:</strong> ${img.titulo?.es || ""}</p>
      <p><strong>EN:</strong> ${img.titulo?.en || ""}</p>
      <p><strong>EU:</strong> ${img.titulo?.eu || ""}</p>
      <p><strong>Alt:</strong> ${img.alt || ""}</p>
      <p><strong>Link:</strong> <a href="${img.link}" target="_blank">${img.link}</a></p>
      <button data-index="${index}">Eliminar</button>
      <hr />
    `;
    contenedor.appendChild(div);

    div.querySelector("button").addEventListener("click", async () => {
      if (!confirm("¿Eliminar esta imagen?")) return;

      const res = await fetch(`/api/imagenes/${index}`, { method: "DELETE" });
      const data = await res.json();
      if (data.ok) {
        alert("Imagen eliminada.");
        cargarImagenesAdmin();
      } else {
        alert("Error al eliminar la imagen.");
      }
    });
  });
}
document.addEventListener("DOMContentLoaded", () => {
  cargarImagenesAdmin();

  const toggleBtn = document.getElementById("toggle-imagenes-home");
  const lista = document.getElementById("lista-imagenes");

  if (toggleBtn && lista) {
    // Establecer texto inicial del botón
    toggleBtn.textContent = lista.style.display !== "none" ? "Ocultar imágenes" : "Mostrar imágenes";

    // Agregar evento de clic
    toggleBtn.addEventListener("click", function () {
      const visible = lista.style.display !== "none";
      lista.style.display = visible ? "none" : "block";
      this.textContent = visible ? "Mostrar imágenes" : "Ocultar imágenes";
    });
  }
});


// =====Gestion Sebastiane=====
document.getElementById("form-sebastiane").addEventListener("submit", async (e) => {
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

  pelicula.director = form.director_es?.value.trim() || "";
  pelicula.video = form.video?.value.trim() || "";

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
document.getElementById("anio-sebastiane").addEventListener("change", cargarPeliculasSebastiane);
document.getElementById("seccion-sebastiane").addEventListener("change", cargarPeliculasSebastiane);

// =====Gestion sebastiane Latino====
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

// =====Gestion Noticias=====
document.getElementById("form-noticia").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;

  const noticia = {
    id: Date.now(), 
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

  if (!filtroFecha) {
    lista.innerHTML = "<p>Selecciona una fecha para ver noticias.</p>";
    return;
  }

  const noticiasFiltradas = noticias.filter(n => n.fecha === filtroFecha);

  if (noticiasFiltradas.length === 0) {
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

async function eliminarNoticia(index) {
  if (confirm("¿Eliminar esta noticia?")) {
    const res = await fetch(`/api/noticias/${index}`, {
      method: "DELETE"
    });
    if (res.ok) {
      alert("Noticia eliminada.");
      cargarNoticiasAdmin();
    } else {
      alert("Error al eliminar.");
    }
  }
}
window.eliminarNoticia = eliminarNoticia;

// =====Gestion Encuentros=====
document.getElementById("form-encuentro").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;

  const nuevoEncuentro = {
    id: Date.now(),
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
    fecha: form.fecha.value || "",
    fotografo: form.fotografo.value.trim(),
    imagenes: []
  };

  const files = form.imagenes.files;
  for (let file of files) {
    const imgForm = new FormData();
    imgForm.append("imagen", file);
    const res = await fetch("/api/upload", {
      method: "POST",
      body: imgForm
    });
    const data = await res.json();
    if (data?.url) {
      nuevoEncuentro.imagenes.push(data.url);
    }
  }

  const res = await fetch("/api/encuentros", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevoEncuentro)
  });

  if (res.ok) {
    alert("Encuentro guardado.");
    form.reset();
    cargarEncuentrosAdmin();
  } else {
    alert("Error al guardar el encuentro.");
  }
});

async function cargarEncuentrosAdmin() {
  const res = await fetch("/encuentros.json");
  const encuentros = await res.json();
  const contenedor = document.getElementById("lista-encuentros");
  contenedor.innerHTML = "";

  const filtroFechaRaw = document.getElementById("filtro-fecha-encuentro")?.value;

  if (!filtroFechaRaw) {
    contenedor.innerHTML = "<p>Selecciona una fecha para ver encuentros.</p>";
    return;
  }

  const [anio, mes, dia] = filtroFechaRaw.split("-");
  const filtroFecha = `${dia}/${mes}/${anio}`;

  const filtrados = encuentros.filter(e => e.fecha === filtroFecha);

  if (filtrados.length === 0) {
    contenedor.innerHTML = "<p>No hay encuentros para esta fecha.</p>";
    return;
  }

  filtrados.forEach((e, index) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${e.titulo?.es || "Sin título"}</strong><br/>
      <small>${e.fecha || "Sin fecha"}</small><br/>
      <button onclick="eliminarEncuentro(${index})">Eliminar</button>
      <hr/>
    `;
    contenedor.appendChild(div);
  });
}

async function eliminarEncuentro(index) {
  if (confirm("¿Eliminar este encuentro?")) {
    const res = await fetch(`/api/encuentros/${index}`, {
      method: "DELETE"
    });
    if (res.ok) {
      alert("Encuentro eliminado.");
      cargarEncuentrosAdmin();
    } else {
      alert("Error al eliminar.");
    }
  }
}
cargarEncuentrosAdmin();

// =====Gestion Lista encuentros=====
document.getElementById("form-festival").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;

  const festival = {
    id: Date.now(),
    nombre: {
      es: form.nombre_es.value.trim(),
      en: form.nombre_en.value.trim(),
      eu: form.nombre_eu.value.trim()
    },
    ubicacion: {
      es: form.ubicacion_es.value.trim(),
      en: form.ubicacion_en.value.trim(),
      eu: form.ubicacion_eu.value.trim()
    },
    url: form.url.value.trim()
  };

  const res = await fetch("/api/festivales", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(festival)
  });

  if (res.ok) {
    alert("Festival guardado.");
    form.reset();
    cargarFestivalesAdmin();
  } else {
    alert("Error al guardar el festival.");
  }
});

async function cargarFestivalesAdmin() {
  const res = await fetch("/festivales.json");
  const festivales = await res.json();
  const contenedor = document.getElementById("lista-festivales");
  contenedor.innerHTML = "";

  if (!festivales || festivales.length === 0) {
    contenedor.innerHTML = "<p>No hay festivales añadidos.</p>";
    return;
  }

  festivales.forEach((f, index) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${f.nombre?.es || "Sin nombre"}</strong><br/>
      <small>${f.url || "Sin URL"}</small><br/>
      <button onclick="eliminarFestival(${index})">Eliminar</button>
      <hr/>
    `;
    contenedor.appendChild(div);
  });
}

document.getElementById("toggle-festivales").addEventListener("click", function () {
  const lista = document.getElementById("lista-festivales");
  const visible = lista.style.display !== "none";
  lista.style.display = visible ? "none" : "block";
  this.textContent = visible ? "Mostrar lista de festivales" : "Ocultar lista de festivales";
});

async function eliminarFestival(index) {
  if (confirm("¿Eliminar este festival?")) {
    const res = await fetch(`/api/festivales/${index}`, {
      method: "DELETE"
    });
    if (res.ok) {
      alert("Festival eliminado.");
      cargarFestivalesAdmin();
    } else {
      alert("Error al eliminar.");
    }
  }
}
window.eliminarFestival = eliminarFestival;
cargarFestivalesAdmin();

// =====Gestion eventos pagina nosotros
document.getElementById("form-evento").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;

  const nuevoEvento = {
    id: Date.now().toString(),
    nombre: form.nombre.value.trim(),
    mes: {
      es: form.mes_es.value.trim(),
      en: form.mes_en.value.trim(),
      eu: form.mes_eu.value.trim()
    },
    lugar: {
      es: form.lugar_es.value.trim(),
      en: form.lugar_en.value.trim(),
      eu: form.lugar_eu.value.trim()
    },
    url: form.url.value.trim(),
    nota: {
      es: form.nota_es.value.trim(),
      en: form.nota_en.value.trim(),
      eu: form.nota_eu.value.trim()
    }
  };

  if (!nuevoEvento.nota.es && !nuevoEvento.nota.en && !nuevoEvento.nota.eu) {
    delete nuevoEvento.nota;
  }

  const res = await fetch("/api/eventos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevoEvento)
  });

  if (res.ok) {
    alert("Evento guardado.");
    form.reset();
    cargarEventosAdmin();
  } else {
    alert("Error al guardar el evento.");
  }
});

async function cargarEventosAdmin() {
  const res = await fetch("/eventos.json");
  const eventos = await res.json();
  const contenedor = document.getElementById("lista-eventos");
  contenedor.innerHTML = "";

  if (!eventos || eventos.length === 0) {
    contenedor.innerHTML = "<p>No hay eventos añadidos.</p>";
    return;
  }

  eventos.forEach((ev, index) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${ev.nombre}</strong><br/>
      <small>${ev.url || "Sin URL"}</small><br/>
      <button onclick="eliminarEvento(${index})">Eliminar</button>
      <hr/>
    `;
    contenedor.appendChild(div);
  });
}
window.eliminarEvento = async function(index) {
  if (confirm("¿Eliminar este evento?")) {
    const res = await fetch(`/api/eventos/${index}`, {
      method: "DELETE"
    });
    if (res.ok) {
      alert("Evento eliminado.");
      cargarEventosAdmin();
    } else {
      alert("Error al eliminar.");
    }
  }
};
cargarEventosAdmin();

document.getElementById("toggle-eventos").addEventListener("click", function () {
  const lista = document.getElementById("lista-eventos");
  const visible = lista.style.display !== "none";

  if (visible) {
    lista.style.display = "none";
    this.textContent = "Mostrar lista de eventos";
  } else {
    cargarEventosAdmin();
    lista.style.display = "block";
    this.textContent = "Ocultar lista de eventos";
  }
});

document.getElementById("form-patrocinador").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const tipo = form.tipo.value;

  const file = form.img.files[0];
let imageUrl = "";

if (file) {
  const imgForm = new FormData();
  imgForm.append("imagen", file);
  const uploadRes = await fetch("/api/upload", {
    method: "POST",
    body: imgForm
  });
  const data = await uploadRes.json();
  imageUrl = data.url || "";
}

const nuevo = {
  href: form.href.value.trim(),
  img: imageUrl,
  alt: form.alt.value.trim()
};

const res = await fetch("/api/patrocinadores", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ tipo, nuevo })
});

  if (res.ok) {
    alert("Patrocinador guardado.");
    form.reset();
    cargarPatrocinadoresAdmin();
  } else {
    alert("Error al guardar patrocinador.");
  }
});

async function cargarPatrocinadoresAdmin() {
  const res = await fetch("/patrocinadores.json");
  const data = await res.json();
  const contenedor = document.getElementById("lista-patrocinadores");
  contenedor.innerHTML = "";

  ["organizadores", "patrocinios", "colaboradores"].forEach(tipo => {
    const grupo = data[tipo] || [];
    if (grupo.length === 0) return;
    const section = document.createElement("section");
    section.innerHTML = `<h4>${tipo}</h4>`;
    grupo.forEach((p, i) => {
      const div = document.createElement("div");
      div.innerHTML = `
        <a href="${p.href}" target="_blank"><img src="${p.img}" alt="${p.alt}" height="30"></a>
        <button onclick="eliminarPatrocinador('${tipo}', ${i})">Eliminar</button>
      `;
      section.appendChild(div);
    });
    contenedor.appendChild(section);
  });
}

window.eliminarPatrocinador = async function(tipo, index) {
  if (confirm("¿Eliminar patrocinador?")) {
    const res = await fetch(`/api/patrocinadores/${tipo}/${index}`, {
      method: "DELETE"
    });
    if (res.ok) {
      alert("Eliminado.");
      cargarPatrocinadoresAdmin();
    } else {
      alert("Error al eliminar.");
    }
  }
};

document.getElementById("toggle-patrocinadores").addEventListener("click", function () {
  const cont = document.getElementById("lista-patrocinadores");
  const visible = cont.style.display !== "none";
  cont.style.display = visible ? "none" : "block";
  this.textContent = visible ? "Mostrar lista" : "Ocultar lista";
});
cargarPatrocinadoresAdmin();

document.getElementById("form-bases-latino").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);

  const baseData = {
  latino: {
    id: new Date().getFullYear() - 2012,  
      titulo: {
        es: formData.get("titulo_es"),
        en: formData.get("titulo_en"),
        eu: formData.get("titulo_eu")
      },
      bases_pdf: {
        es: "",
        en: "",
        eu: ""
      }
    }
  };

  for (let lang of ["es", "en", "eu"]) {
    const file = form[`pdf_${lang}`].files[0];
    if (file) {
      const pdfForm = new FormData();
      pdfForm.append("imagen", file); 
      const res = await fetch("/api/upload", {
        method: "POST",
        body: pdfForm
      });
      const data = await res.json();
      if (data?.url) baseData.latino.bases_pdf[lang] = data.url;
    }
  }

  const res = await fetch("/api/bases_latino", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(baseData)
  });

  if (res.ok) {
    alert("Bases actualizadas correctamente.");
    form.reset();
  } else {
    alert("Error al guardar las bases.");
  }
});

async function cargarBasesLatino() {
  try {
    const res = await fetch("/bases_latino.json");
    const data = await res.json();
    const base = data.latino;

    const contenedor = document.getElementById("lista-bases");
    contenedor.innerHTML = `
      <p><strong>ID:</strong> ${base.id}</p>
      <p><strong>Título ES:</strong> ${base.titulo.es}</p>
      <p><strong>Título EN:</strong> ${base.titulo.en}</p>
      <p><strong>Título EU:</strong> ${base.titulo.eu}</p>
      <p><strong>PDF ES:</strong> ${base.bases_pdf.es ? `<a href="${base.bases_pdf.es}" target="_blank">Ver PDF</a>` : 'No disponible'}</p>
      <p><strong>PDF EN:</strong> ${base.bases_pdf.en ? `<a href="${base.bases_pdf.en}" target="_blank">Ver PDF</a>` : 'No disponible'}</p>
      <p><strong>PDF EU:</strong> ${base.bases_pdf.eu ? `<a href="${base.bases_pdf.eu}" target="_blank">Ver PDF</a>` : 'No disponible'}</p>
    `;
  } catch (err) {
    console.error("Error cargando bases_latino.json:", err);
    document.getElementById("lista-bases").innerHTML = "<p>No se pudieron cargar las bases.</p>";
  }
}
cargarBasesLatino();

document.getElementById("btn-eliminar-bases")?.addEventListener("click", async () => {
  if (confirm("¿Seguro que deseas eliminar las bases actuales? Esta acción no se puede deshacer.")) {
    const res = await fetch("/api/bases_latino", { method: "DELETE" });
    if (res.ok) {
      alert("Bases eliminadas correctamente.");
      cargarBasesLatino();
    } else {
      alert("Error al eliminar las bases.");
    }
  }
});

// === GESTIÓN DE REVISTAS ===
document.getElementById("form-revista").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;

  const nuevaRevista = {
    id: Date.now().toString(),
    titulo: {
      es: form.titulo_es.value.trim(),
      en: form.titulo_en.value.trim(),
      eu: form.titulo_eu.value.trim()
    },
    portada: "",
    archivo: {
      es: "",
      en: "",
      eu: ""
    }
  };

  // Subir portada
  const portadaFile = form.portada.files[0];
  if (portadaFile) {
    const portadaForm = new FormData();
    portadaForm.append("imagen", portadaFile);
    const res = await fetch("/api/upload", { method: "POST", body: portadaForm });
    const data = await res.json();
    if (data?.url?.includes("/img/")) {
      nuevaRevista.portada = data.url;
    }
  }

  // Subir PDFs por idioma
  for (let lang of ["es", "en", "eu"]) {
    const file = form[`archivo_${lang}`].files[0];
    if (file) {
      const pdfForm = new FormData();
      pdfForm.append("imagen", file);
      const res = await fetch("/api/upload", { method: "POST", body: pdfForm });
      const data = await res.json();
      if (data?.url?.includes("/pdfs/")) {
        nuevaRevista.archivo[lang] = data.url;
      }
    }
  }

  // Guardar revista
  const res = await fetch("/api/revistas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevaRevista)
  });

  if (res.ok) {
    alert("Revista guardada.");
    form.reset();
    cargarRevistasAdmin();
  } else {
    alert("Error al guardar la revista.");
  }
});

async function cargarRevistasAdmin() {
  const res = await fetch("/revista.json");
  const revistas = await res.json();
  const contenedor = document.getElementById("lista-revistas");
  contenedor.innerHTML = "";

  if (!revistas || revistas.length === 0) {
    contenedor.innerHTML = "<p>No hay revistas añadidas.</p>";
    return;
  }

  revistas.forEach((r, index) => {
    const div = document.createElement("div");
    div.className = "revista-item";
    div.innerHTML = `
      <img src="${r.portada}" alt="Portada" style="max-height: 100px;"><br/>
      <strong>${r.titulo.es}</strong><br/>
      ${r.archivo.es ? `<a href="${r.archivo.es}" target="_blank">PDF ES</a>` : ''}
      ${r.archivo.en ? ` | <a href="${r.archivo.en}" target="_blank">PDF EN</a>` : ''}
      ${r.archivo.eu ? ` | <a href="${r.archivo.eu}" target="_blank">PDF EU</a>` : ''}
      <br/>
      <button onclick="eliminarRevista(${index})">Eliminar</button>
      <hr/>
    `;
    contenedor.appendChild(div);
  });
}

async function eliminarRevista(index) {
  if (confirm("¿Eliminar esta revista?")) {
    const res = await fetch(`/api/revistas/${index}`, {
      method: "DELETE"
    });
    if (res.ok) {
      alert("Revista eliminada.");
      cargarRevistasAdmin();
    } else {
      alert("Error al eliminar la revista.");
    }
  }
}

document.getElementById("toggle-revistas").addEventListener("click", function () {
  const lista = document.getElementById("lista-revistas");
  const visible = lista.style.display !== "none";
  lista.style.display = visible ? "none" : "block";
  this.textContent = visible ? "Mostrar lista de revistas" : "Ocultar lista de revistas";
});

cargarRevistasAdmin();

// =====Gestion Documentos pg Revista=====
document.getElementById("form-documento").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;

  const nuevoDocumento = {
    id: Date.now().toString(),
    tipo: form.tipo.value,
    anio: parseInt(form.anio.value),
    archivos: { es: "", en: "", eu: "" }
  };

  for (let lang of ["es", "en", "eu"]) {
    const file = form[`archivo_${lang}`].files[0];
    if (file) {
      const pdfForm = new FormData();
      pdfForm.append("imagen", file);
      const res = await fetch("/api/upload", { method: "POST", body: pdfForm });
      const data = await res.json();
      if (data?.url) nuevoDocumento.archivos[lang] = data.url;
    }
  }

  const res = await fetch("/api/documentos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevoDocumento)
  });

  if (res.ok) {
    alert("Documento guardado.");
    form.reset();
    cargarDocumentosAdmin();
  } else {
    alert("Error al guardar el documento.");
  }
});

async function cargarDocumentosAdmin() {
  const res = await fetch("/api/documentos");
  const documentos = await res.json();
  const contenedor = document.getElementById("lista-documentos");
  contenedor.innerHTML = "";

  const anioFiltro = document.getElementById("filtro-anio-documento").value;
  if (!anioFiltro) {
    contenedor.innerHTML = "<p>Selecciona un año para ver documentos.</p>";
    return;
  }

  const filtrados = documentos.filter(doc => doc.anio.toString() === anioFiltro);

  if (filtrados.length === 0) {
    contenedor.innerHTML = "<p>No hay documentos para este año.</p>";
    return;
  }

  filtrados.forEach((doc, index) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${doc.tipo} - ${doc.anio}</strong><br/>
      ${doc.archivos.es ? `<a href="${doc.archivos.es}" target="_blank">ES</a>` : ''}
      ${doc.archivos.en ? ` | <a href="${doc.archivos.en}" target="_blank">EN</a>` : ''}
      ${doc.archivos.eu ? ` | <a href="${doc.archivos.eu}" target="_blank">EU</a>` : ''}
      <br/>
      <button onclick="eliminarDocumento(${index})">Eliminar</button>
      <hr/>
    `;
    contenedor.appendChild(div);
  });
}

async function eliminarDocumento(index) {
  if (confirm("¿Eliminar este documento?")) {
    const res = await fetch(`/api/documentos/${index}`, { method: "DELETE" });
    if (res.ok) {
      alert("Documento eliminado.");
      cargarDocumentosAdmin();
    } else {
      alert("Error al eliminar el documento.");
    }
  }
}

window.eliminarDocumento = eliminarDocumento;
cargarDocumentosAdmin();