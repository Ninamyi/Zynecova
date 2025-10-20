const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017"; 
let client;
let db;

async function connectMongoDB() {
  if (db) return db;
  try {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db("Zynecova"); 
    console.log("✅ Conectado a MongoDB local");
    return db;
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error);
  }
}

function getConnection() {
  if (!db) {
    throw new Error("No hay conexión activa a MongoDB");
  }
  return db;
}

module.exports = { connectMongoDB, getConnection };
