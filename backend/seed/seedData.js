const { faker } = require("@faker-js/faker");
const bcrypt = require("bcrypt");
const { pool, connectMongo } = require("../db");
const Usuario = require("../models/Usuario");
const Reporte = require("../models/Reporte");

require("dotenv").config();

async function generarUsuarios(cantidad) {
  const usuarios = [];
  for (let i = 0; i < cantidad; i++) {
    const contraseñaEncriptada = await bcrypt.hash("password123", 10);
    usuarios.push({
      nombre: faker.person.fullName(),
      correo: faker.internet.email(),
      contraseña: contraseñaEncriptada,
      rol: "usuario",
    });
  }
  return usuarios;
}

async function generarReportes(usuarios) {
  const tipos = ["Contaminación del agua", "Deforestación", "Inundación", "Sequía"];
  const reportes = [];
  for (let i = 0; i < 25000; i++) {
    const usuario = usuarios[Math.floor(Math.random() * usuarios.length)];
    reportes.push({
      usuario_id: usuario._id,
      ciudad: faker.location.city(),
      descripcion: faker.lorem.sentence(),
      tipo: tipos[Math.floor(Math.random() * tipos.length)],
      imagen: faker.image.urlPicsumPhotos({ width: 800, height: 600 }),
      video: faker.internet.url(),
      fecha: faker.date.recent({ days: 30 }),
      estado: "pendiente"
    });
  }
  return reportes;
}

(async () => {
  try {
    await connectMongo();

    console.log("🧹 Limpiando colecciones anteriores...");
    await Usuario.deleteMany({});
    await Reporte.deleteMany({});

    console.log("👤 Generando usuarios falsos...");
    const usuarios = await Usuario.insertMany(await generarUsuarios(1000));
    console.log(`✅ ${usuarios.length} usuarios insertados`);

    console.log("🌎 Generando reportes falsos...");
    const reportes = await Reporte.insertMany(await generarReportes(usuarios));
    console.log(`✅ ${reportes.length} reportes insertados`);

    console.log("✅ Proceso completado correctamente");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error al generar datos:", err);
    process.exit(1);
  }
})();
