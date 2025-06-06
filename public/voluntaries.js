fetch("/api/banner-voluntaries")
  .then(res => res.json())
  .then(data => {
    if (data.mostrar && data.url) {
      const banner = document.getElementById("banner-voluntaries");
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
