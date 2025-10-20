const mysql = require("mysql2/promise");
const mongoose = require("mongoose");
require("dotenv").config();

async function testMySQL() {
  try {
    const pool = mysql.createPool({
      host: process.env.MYSQL_HOST || "localhost",
      user: process.env.MYSQL_USER || "root",
      password: process.env.MYSQL_PASSWORD || "",
      database: process.env.MYSQL_DATABASE || "zynecova",
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0
    });

    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    console.log("MySQL conectado ✅ - prueba SELECT 1+1 =>", rows[0].result);
    await pool.end();
  } catch (err) {
    console.error("MySQL ERROR ❌:", err.message || err);
    process.exitCode = 1;
  }
}

async function testMongo() {
  try {
    const uri = process.env.MONGO_URI || "mongodb://localhost:27017/zynecova";
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("MongoDB conectado ✅ - database:", mongoose.connection.name);
    await mongoose.disconnect();
  } catch (err) {
    console.error("MongoDB ERROR ❌:", err.message || err);
    process.exitCode = 1;
  }
}

(async () => {
  console.log("==== Probando conexiones ====");
  await testMySQL();
  await testMongo();
  console.log("==== Prueba finalizada ====");
})();

const mysql = require("mysql2/promise");
const mongoose = require("mongoose");
const axios = require("axios");
require("dotenv").config();

async function testMySQL() {
  try {
    const pool = mysql.createPool({
      host: process.env.MYSQL_HOST || "localhost",
      user: process.env.MYSQL_USER || "root",
      password: process.env.MYSQL_PASSWORD || "",
      database: process.env.MYSQL_DATABASE || "zynecova",
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0
    });

    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    console.log("MySQL conectado ✅ - prueba SELECT 1+1 =>", rows[0].result);
    await pool.end();
  } catch (err) {
    console.error("MySQL ERROR ❌:", err.message || err);
    process.exitCode = 1;
  }
}

async function testMongo() {
  try {
    const uri = process.env.MONGO_URI || "mongodb://localhost:27017/zynecova";
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("MongoDB conectado ✅ - database:", mongoose.connection.name);
    await mongoose.disconnect();
  } catch (err) {
    console.error("MongoDB ERROR ❌:", err.message || err);
    process.exitCode = 1;
  }
}

async function testOpenWeather() {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const city = "Bogota";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    const response = await axios.get(url);
    console.log(`OpenWeather conectado ✅ - Ciudad: ${response.data.name}, Temp: ${response.data.main.temp}°C`);
  } catch (err) {
    console.error("OpenWeather ERROR ❌:", err.message || err);
  }
}

(async () => {
  console.log("==== Probando conexiones ====");
  await testMySQL();
  await testMongo();
  await testOpenWeather();
  console.log("==== Prueba finalizada ====");
})();
