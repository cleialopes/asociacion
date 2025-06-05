// =====Gestion Banner=====
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

  // Convertimos de "YYYY-MM-DD" a "DD/MM/YYYY"
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

  // Quitar nota si está vacía
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
    cargarEventosAdmin(); // solo cuando se va a mostrar
    lista.style.display = "block";
    this.textContent = "Ocultar lista de eventos";
  }
});
