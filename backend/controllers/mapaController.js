const axios = require("axios");

const API_KEY = process.env.OPENWEATHER_API_KEY || "TU_API_KEY_OPENWEATHERMAP";

exports.getDatosCiudad = async (req, res) => {
  try {
    const ciudad = req.query.ciudad || "Bogota";

    const resp = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${API_KEY}&units=metric&lang=es`
    );

    const clima = resp.data;

    const datos = {
      ciudad: clima.name,
      temperatura: clima.main.temp,
      humedad: clima.main.humidity,
      descripcion: clima.weather[0].description,
      viento: clima.wind.speed,
      coordenadas: {
        lat: clima.coord.lat,
        lon: clima.coord.lon,
      },

      calidad_aire: "Pendiente",
      estado_riesgo:
        clima.main.temp > 35
          ? "Rojo"
          : clima.main.temp > 30
          ? "Naranja"
          : clima.main.temp > 25
          ? "Amarillo"
          : "Verde",
    };

    res.json(datos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No se pudo obtener datos del clima" });
  }
};
