const API_URL = "http://localhost:3000/api/pronosticos";

const usuarioActual = localStorage.getItem("usuarioActivo") || "Empleado";
document.getElementById("nombre-usuario").textContent = usuarioActual;

async function mostrarPronosticos() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    const tbody = document.getElementById("tabla-body");
    tbody.innerHTML = "";

    if (!data.length) {
      tbody.innerHTML = `<tr><td colspan="9">No hay pronósticos registrados.</td></tr>`;
      return;
    }

    data.forEach((ciudad) => {
      const color = obtenerColorRiesgo(ciudad.estadoRiesgo);

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${ciudad.ciudad}</td>
        <td>${ciudad.fecha}</td>
        <td>${ciudad.temperatura}°C</td>
        <td>${ciudad.precipitacion} mm</td>
        <td>${ciudad.nivelAgua}%</td>
        <td>${ciudad.calidadAgua}</td>
        <td>${ciudad.calidadAire}</td>
        <td style="color:${color}; font-weight:600;">${ciudad.estadoRiesgo}</td>
        <td>${ciudad.incidente || "-"}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Error al cargar pronósticos:", err);
  }
}

function obtenerColorRiesgo(estado) {
  switch (estado.toLowerCase()) {
    case "verde": return "green";
    case "amarillo": return "gold";
    case "naranja": return "orange";
    case "rojo": return "red";
    default: return "gray";
  }
}

function calcularRiesgo(nivelAgua, precipitacion, calidadAire) {
  if (nivelAgua > 80 || precipitacion > 50 || calidadAire === "Mala") return "Rojo";
  if (nivelAgua > 60 || calidadAire === "Regular") return "Naranja";
  if (nivelAgua > 40) return "Amarillo";
  return "Verde";
}

document.getElementById("registro-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;

  const estado = calcularRiesgo(
    parseInt(form.nivelAgua.value),
    parseFloat(form.precipitacion.value),
    form.calidadAire.value
  );

  const nuevoPronostico = {
    ciudad: form.ciudad.value.trim(),
    fecha: form.fecha.value,
    temperatura: form.temperatura.value,
    precipitacion: form.precipitacion.value,
    nivelAgua: form.nivelAgua.value,
    calidadAgua: form.calidadAgua.value,
    calidadAire: form.calidadAire.value,
    incidente: form.incidente.value.trim(),
    estadoRiesgo: estado,
    usuario: usuarioActual
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoPronostico)
    });

    const data = await res.json();
    if (data.success) {
      alert("✅ Pronóstico registrado correctamente");
      form.reset();
      mostrarPronosticos();
    } else {
      alert("❌ Error al registrar pronóstico");
    }
  } catch (err) {
    console.error("Error al enviar pronóstico:", err);
  }
});

document.getElementById("cerrar-sesion").addEventListener("click", () => {
  localStorage.clear();
  alert("Sesión cerrada");
  window.location.href = "login.html";
});

document.addEventListener("DOMContentLoaded", mostrarPronosticos);
