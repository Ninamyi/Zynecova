import { getConnection } from "./connectionMongoDB.js";

const listarZonas = async () => {
  const db = await getConnection();
  const zonas = await db.collection("Zonas").find().toArray();
  console.table(zonas);
};

const listarAlertas = async () => {
  const db = await getConnection();
  const alertas = await db.collection("Alertas").find().toArray();
  console.table(alertas);
};

const listarDatos_ambientales = async () => {
  const db = await getConnection();
  const alertas = await db.collection("Datos_ambientales").find().toArray();
  console.table(alertas);
};

const listarReportes_ambientales = async () => {
  const db = await getConnection();
  const alertas = await db.collection("Reportes_ambientales").find().toArray();
  console.table(alertas);
};

const listarSoporte = async () => {
  const db = await getConnection();
  const alertas = await db.collection("Soporte").find().toArray();
  console.table(alertas);
};

listarZonas();
listarAlertas();
listarDatos_ambientales();
listarReportes_ambientales();
listarSoporte();



/*const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/zynecova";

async function connectMongoDB() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Conectado a MongoDB Atlas");
  } catch (error) {
    console.error("Error al conectar con MongoDB:", error.message);
    process.exit(1);
  }
}

module.exports = connectMongoDB;
*/ 