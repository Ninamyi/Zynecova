require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const reportesRoutes = require('./routes/reportesRoutes');
const pronosticosRoutes = require('./routes/pronosticosRoutes');
const soporteRoutes = require('./routes/soporteRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Usar rutas con prefijo
app.use('/api/auth', authRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/pronosticos', pronosticosRoutes);
app.use('/api/soporte', soporteRoutes);
app.use('/api/admin', adminRoutes);

const mapaRoutes = require("./routes/mapaRoutes");

app.use("/api/mapa", mapaRoutes);


// Levantar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
});

const connectMongoDB = require("./mongo");
connectMongoDB();

