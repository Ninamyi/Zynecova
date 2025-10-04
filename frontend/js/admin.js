// 📌 Cargar registros desde el servidor
async function mostrarDatos() {
  try {
    const res = await fetch("http://localhost:3000/api/admin");
    const registros = await res.json();

    const tablaUsuarios = document.querySelector("#tablaUsuarios tbody");
    const tablaEmpleados = document.querySelector("#tablaEmpleados tbody");
    const tablaSoporte = document.querySelector("#tablaSoporte tbody");

    tablaUsuarios.innerHTML = "";
    tablaEmpleados.innerHTML = "";
    tablaSoporte.innerHTML = "";

    registros.forEach(r => {
      const tr = document.createElement("tr");

      if (r.rol === "Usuario") {
        tr.innerHTML = `
          <td>${r.id}</td>
          <td>${r.nombre}</td>
          <td>${r.email || "-"}</td>
          <td>${r.fecha}</td>
          <td><button class="btn-eliminar" data-id="${r.id}">Eliminar</button></td>
        `;
        tablaUsuarios.appendChild(tr);

      } else if (r.rol === "Empleado") {
        tr.innerHTML = `
          <td>${r.id}</td>
          <td>${r.nombre}</td>
          <td>${r.cargo || "-"}</td>
          <td>${r.fecha}</td>
          <td>
            <button class="btn-editar" data-id="${r.id}">Editar</button>
            <button class="btn-eliminar" data-id="${r.id}">Eliminar</button>
          </td>
        `;
        tablaEmpleados.appendChild(tr);

      } else if (r.rol === "Soporte") {
        tr.innerHTML = `
          <td>${r.id}</td>
          <td>${r.rol}</td>
          <td>${r.detalle}</td>
          <td>${r.fecha}</td>
          <td>
            <button class="btn-editar" data-id="${r.id}">Editar</button>
            <button class="btn-eliminar" data-id="${r.id}">Eliminar</button>
          </td>
        `;
        tablaSoporte.appendChild(tr);
      }
    });
  } catch (err) {
    console.error("Error al cargar registros:", err);
  }
}

// 📌 Agregar registro
async function agregarRegistro() {
  const rol = prompt("Rol del registro (Empleado / Soporte):");
  if (rol !== "Empleado" && rol !== "Soporte") {
    return alert("Solo se pueden agregar registros de Empleado o Soporte");
  }

  const nombre = prompt("Nombre:");
  const detalle = prompt("Detalle o comentario:");
  const fecha = new Date().toISOString().split("T")[0];

  if (!nombre) return alert("El nombre es obligatorio.");

  try {
    const res = await fetch("http://localhost:3000/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, rol, detalle, fecha })
    });

    const data = await res.json();
    if (data.status === "success") {
      mostrarDatos();
    }
  } catch (err) {
    console.error("Error agregando registro:", err);
  }
}

// 📌 Editar registro
async function editarRegistro(id) {
  const nuevoNombre = prompt("Editar nombre:");
  const nuevoDetalle = prompt("Editar detalle:");

  try {
    const res = await fetch(`http://localhost:3000/api/admin/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre: nuevoNombre, detalle: nuevoDetalle })
    });

    const data = await res.json();
    if (data.status === "success") {
      mostrarDatos();
    }
  } catch (err) {
    console.error("Error editando registro:", err);
  }
}

// 📌 Eliminar registro
async function eliminarRegistro(id) {
  if (!confirm("¿Desea eliminar este registro?")) return;

  try {
    const res = await fetch(`http://localhost:3000/api/admin/${id}`, {
      method: "DELETE"
    });

    const data = await res.json();
    if (data.status === "success") {
      mostrarDatos();
    }
  } catch (err) {
    console.error("Error eliminando registro:", err);
  }
}

// 📌 Cambio de sección
function mostrarSeccion(seccionId) {
  document.querySelectorAll("main section").forEach(sec => sec.style.display = "none");
  document.getElementById(seccionId).style.display = "block";
}

// 📌 Inicialización
document.addEventListener("DOMContentLoaded", () => {
  mostrarDatos();

  const btnAgregar = document.getElementById("btnAgregar");
  if (btnAgregar) {
    btnAgregar.addEventListener("click", agregarRegistro);
  }

  document.body.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-editar")) {
      editarRegistro(parseInt(e.target.dataset.id));
    }
    if (e.target.classList.contains("btn-eliminar")) {
      eliminarRegistro(parseInt(e.target.dataset.id));
    }
  });
});
