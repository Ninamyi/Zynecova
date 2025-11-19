require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectMongoDB } = require("./connectionMongoDB");
const pool = require("./db/db"); 

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require("./routes/authRoutes");
const reportesRoutes = require("./routes/reportesRoutes");
const pronosticosRoutes = require("./routes/pronosticosRoutes");
const soporteRoutes = require("./routes/soporteRoutes");
const adminRoutes = require("./routes/adminRoutes");
const mapaRoutes = require("./routes/mapaRoutes");
const noticiasCRUDRouter = require("./routes/noticias"); 
const publicFeedsRouter = require("./routes/publicFeeds"); 
const notificacionRoutes = require("./routes/notificacionRoutes"); 

app.use("/api/auth", authRoutes);
app.use("/api/reportes", reportesRoutes);
app.use("/api/pronosticos", pronosticosRoutes);
app.use("/api/soporte", soporteRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/mapa", mapaRoutes);


app.use("/api", publicFeedsRouter); 
app.use("/api/noticias-admin", noticiasCRUDRouter); 
app.use("/api/notificaciones", notificacionRoutes); 

(async () => {
  try {
    await connectMongoDB();
    console.log("✅ Conectado a MongoDB correctamente.");

    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    console.log("✅ Conectado a MySQL correctamente. Resultado:", rows[0].result);
  } catch (err) {
    console.error("❌ Error en la conexión con las bases de datos:", err.message);
  }
})();


app.get("/", (req, res) => {
  res.json({
    message: "🌍 Bienvenido a la API de Zynecova",
    status: "Servidor operativo",
  });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
});