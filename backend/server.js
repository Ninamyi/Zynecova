require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectMongoDB } = require("./connectionMongoDB"); // ✅ usamos require en vez de import

const app = express();
app.use(cors());
app.use(express.json());

// Importar rutas
const authRoutes = require("./routes/authRoutes");
const reportesRoutes = require("./routes/reportesRoutes");
const pronosticosRoutes = require("./routes/pronosticosRoutes");
const soporteRoutes = require("./routes/soporteRoutes");
const adminRoutes = require("./routes/adminRoutes");
const mapaRoutes = require("./routes/mapaRoutes");

// Usar rutas con prefijo
app.use("/api/auth", authRoutes);
app.use("/api/reportes", reportesRoutes);
app.use("/api/pronosticos", pronosticosRoutes);
app.use("/api/soporte", soporteRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/mapa", mapaRoutes);

// Conectar a MongoDB local
connectMongoDB();

// Levantar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
});
