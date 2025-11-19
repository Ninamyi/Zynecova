import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export async function obtenerClima(ciudad) {
  try {
    const url = `${BASE_URL}?q=${ciudad}&appid=${API_KEY}&units=metric&lang=es`;
    const { data } = await axios.get(url);

    return {
      ciudad: data.name,
      temperatura: data.main.temp,
      humedad: data.main.humidity,
      descripcion: data.weather[0].description,
      viento: data.wind.speed,
      icono: data.weather[0].icon,
    };
  } catch (error) {
    console.error("❌ Error al obtener el clima:", error.response?.data || error.message);
    throw error;
  }
}
