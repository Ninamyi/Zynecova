const API_KEY = "TU_API_KEY_AQUI"; //Reemplaza con tu propia API key de OpenWeatherMap
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
    🌡️ ${temperatura.toFixed(1)}°C<br>
    🌦️ ${descripcion}<br>
    🟢 Estado: <b>${estado}</b><br>
    📅 ${fecha}
  `);
}

async function obtenerClima(ciudad) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${API_KEY}&units=metric&lang=es`
    );
    const data = await res.json();
    if (data.cod !== 200) throw new Error("Ciudad no encontrada");

    return {
      lat: data.coord.lat,
      lon: data.coord.lon,
      temperatura: data.main.temp,
      descripcion: data.weather[0].description,
    };
  } catch (err) {
    console.warn(`Error al obtener clima de ${ciudad}:`, err.message);
    return null;
  }
}

async function cargarPronosticos() {
  try {
    const res = await fetch(`${API_BASE}/pronosticos`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const pronosticos = await res.json();

    for (const p of pronosticos) {
      const clima = await obtenerClima(p.ciudad);
      if (clima) {
        agregarMarcador(
          p.ciudad,
          clima.lat,
          clima.lon,
          clima.temperatura,
          p.estado_riesgo,
          clima.descripcion,
          p.fecha.split("T")[0]
        );
      }
    }

  } catch (err) {
    console.error("Error al cargar pronósticos:", err);
  }
}

document.getElementById("registro-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const ciudad = document.getElementById("ciudad").value.trim();

  if (!ciudad) return;

  const clima = await obtenerClima(ciudad);
  if (clima) {
    agregarMarcador(
      ciudad,
      clima.lat,
      clima.lon,
      clima.temperatura,
      "Verde",
      clima.descripcion,
      new Date().toISOString().split("T")[0]
    );
    map.setView([clima.lat, clima.lon], 8);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  cargarPronosticos();
});
