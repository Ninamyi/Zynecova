document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formReporte");
  const listaReportes = document.getElementById("listaReportes");
  const btnCerrarSesion = document.getElementById("cerrarSesion");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    try {
      const res = await fetch("http://localhost:3000/api/reportes", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ Reporte enviado correctamente");
        form.reset();
        mostrarReporteEnLista(data.reporte);
      } else {
        alert("❌ Error: " + (data.message || "No se pudo enviar el reporte"));
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Error de conexión con el servidor.");
    }
  });

  function mostrarReporteEnLista(reporte) {
    const div = document.createElement("div");
    div.classList.add("reporte-item");

    div.innerHTML = `
      <h3>${reporte.ciudad} - ${reporte.tipoIncidente}</h3>
      <p><strong>Descripción:</strong> ${reporte.descripcion}</p>
      <p><strong>Fecha:</strong> ${new Date().toLocaleDateString()}</p>
      ${
        reporte.evidencia
          ? `<p><strong>Evidencia:</strong><br>
               ${
                 reporte.evidencia.endsWith(".mp4")
                   ? `<video controls width="250"><source src="${reporte.evidencia}" type="video/mp4"></video>`
                   : `<img src="${reporte.evidencia}" width="250" />`
               }
             </p>`
          : ""
      }
      <hr>
    `;

    listaReportes.prepend(div);
  }

  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "login.html";
    });
  }
});
