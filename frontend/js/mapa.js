const map = L.map("map").setView([4.6097, -74.0817], 6);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

let marker;

async function buscarCiudad() {
  const ciudad = document.getElementById("ciudad").value || "Bogota";

  try {
    const resp = await fetch(`http://localhost:3000/api/mapa?ciudad=${ciudad}`);
    const data = await resp.json();

    if (!data.coordenadas) {
      alert("No se encontraron datos de la ciudad");
      return;
    }

    map.setView([data.coordenadas.lat, data.coordenadas.lon], 10);

    if (marker) {
      map.removeLayer(marker);
    }

    marker = L.marker([data.coordenadas.lat, data.coordenadas.lon]).addTo(map);

    marker.bindPopup(`
      <b>${data.ciudad}</b><br>
      🌡️ Temp: ${data.temperatura}°C<br>
      💧 Humedad: ${data.humedad}%<br>
      🌬️ Viento: ${data.viento} m/s<br>
      ☁️ Clima: ${data.descripcion}<br>
      ⚠️ Estado de riesgo: <b>${data.estado_riesgo}</b>
    `).openPopup();
  } catch (err) {
    console.error("Error al obtener datos:", err);
    alert("No se pudo obtener la información del clima");
  }
}

buscarCiudad();
