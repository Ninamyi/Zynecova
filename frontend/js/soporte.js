async function mostrarReportes() {
  try {
    const res = await fetch("http://localhost:3000/api/reportes");
    const data = await res.json();

    const tabla = document.getElementById("tablaReportes").querySelector("tbody");
    tabla.innerHTML = "";

    data.forEach((rep) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${rep.id}</td>
        <td>${rep.tipo}</td>
        <td>${rep.descripcion}</td>
        <td>${rep.fecha}</td>
        <td>${rep.estado}</td>
        <td>
          <button onclick="cambiarEstado(${rep.id}, '${rep.estado}')">Cambiar Estado</button>
          <button onclick="eliminarReporte(${rep.id})">Eliminar</button>
        </td>
      `;
      tabla.appendChild(tr);
    });
  } catch (err) {
    console.error("Error cargando reportes:", err);
  }
}

document.getElementById("reporteProblemaForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const tipo = this.tipo_problema.value;
  const descripcion = this.descripcion.value.trim();

  if (!tipo || !descripcion) {
    alert("Todos los campos son obligatorios");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/api/reportes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo, descripcion })
    });

    const data = await res.json();
    if (data.status === "success") {
      alert("Reporte agregado correctamente");
      mostrarReportes();
      this.reset();
    }
  } catch (err) {
    console.error("Error enviando reporte:", err);
  }
});

async function cambiarEstado(id, estadoActual) {
  const estados = ["Pendiente", "En progreso", "Resuelto"];
  const siguiente = estados[(estados.indexOf(estadoActual) + 1) % estados.length];

  try {
    const res = await fetch(`http://localhost:3000/api/reportes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: siguiente })
    });

    const data = await res.json();
    if (data.status === "success") {
      mostrarReportes();
    }
  } catch (err) {
    console.error("Error cambiando estado:", err);
  }
}

async function eliminarReporte(id) {
  if (!confirm("¿Desea eliminar este reporte?")) return;

  try {
    const res = await fetch(`http://localhost:3000/api/reportes/${id}`, {
      method: "DELETE"
    });

    const data = await res.json();
    if (data.status === "success") {
      mostrarReportes();
    }
  } catch (err) {
    console.error("Error eliminando reporte:", err);
  }
}

document.addEventListener("DOMContentLoaded", mostrarReportes);
