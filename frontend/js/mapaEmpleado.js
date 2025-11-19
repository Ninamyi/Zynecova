const API_BASE = "http://localhost:3000/api";
const token = localStorage.getItem("token");

const map = L.map("map").setView([4.5709, -74.2973], 6);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

const iconColors = {
  Verde: "green",
  Amarillo: "yellow",
  Naranja: "orange",
  Rojo: "red",
};

function agregarMarcador(ciudad, lat, lon, temperatura, estado, descripcion, fecha) {
  const color = iconColors[estado] || "blue";

  const marker = L.circleMarker([lat, lon], {
    radius: 8,
    fillColor: color,
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8,
  }).addTo(map);

  marker.bindPopup(`
    <b>${ciudad}</b><br>
    🌡️ ${temperatura}°C<br>
    🌦️ ${descripcion}<br>
    🟢 Estado: <b>${estado}</b><br>
    📅 ${fecha}
  `);
}

async function cargarReportesAmbientales() {
  try {
    const res = await fetch(`${API_BASE}/mapa/todos`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Error al obtener datos del servidor");

    const reportes = await res.json();

    if (!Array.isArray(reportes) || reportes.length === 0) {
      console.warn("No se encontraron reportes ambientales");
      return;
    }

    reportes.forEach((r) => {
      if (r.lat && r.lon) {
        agregarMarcador(
          r.ciudad,
          r.lat,
          r.lon,
          r.temperatura || 0,
          r.estado_riesgo,
          r.descripcion || "Sin descripción",
          r.fecha || "Sin fecha"
        );
      }
    });

  } catch (err) {
    console.error("Error al cargar los reportes ambientales:", err);
  }
}

document.getElementById("registro-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const ciudad = document.getElementById("ciudad").value.trim();
  const temperatura = parseFloat(document.getElementById("temperatura").value);
  const fecha = document.getElementById("fecha").value;
  const calidadAire = document.getElementById("calidadAire").value;
  const calidadAgua = document.getElementById("calidadAgua").value;

  if (!ciudad || isNaN(temperatura)) return;

  let estado = "Verde";
  if (temperatura > 35 || calidadAire === "Mala" || calidadAgua === "Mala") estado = "Rojo";
  else if (temperatura > 30 || calidadAire === "Regular") estado = "Naranja";
  else if (temperatura > 25) estado = "Amarillo";

  const coordenadasCiudades = {
    Bogota: [4.6097, -74.0817],
    Medellin: [6.2442, -75.5812],
    Cali: [3.4516, -76.5320],
    Barranquilla: [10.9685, -74.7813],
    Cartagena: [10.3910, -75.4794],
    Bucaramanga: [7.1254, -73.1198],
    Pereira: [4.8087, -75.6906],
    SantaMarta: [11.2408, -74.1990],
    Cucuta: [7.8939, -72.5078],
  };

  const coords = coordenadasCiudades[ciudad] || [4.5709, -74.2973];

  agregarMarcador(ciudad, coords[0], coords[1], temperatura, estado, "Ingreso manual", fecha);
  map.setView(coords, 8);
});

document.addEventListener("DOMContentLoaded", () => {
  cargarReportesAmbientales();
});
