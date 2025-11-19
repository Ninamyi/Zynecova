import { fakerES as faker } from "@faker-js/faker";
import { pool } from "./db.js";
import mongoose from "mongoose";

const mongoUri = "mongodb://localhost:27017/zynecova";
const collectionName = "reports";

const reportSchema = new mongoose.Schema({
  user_id: String,
  category: String,
  city: String,
  temperature: Number,
  water_level: Number,
  air_quality: Number,
  severity: String,
  description: String,
  image_url: String,
  created_at: Date,
});
const Report = mongoose.model(collectionName, reportSchema);

const TOTAL = 25000;
const BATCH_SIZE = 1000;

const categories = ["clima", "agua", "aire"];
const severities = ["verde", "amarillo", "naranja", "rojo"];

function generateRecord() {
  return {
    user_id: faker.string.uuid(),
    category: faker.helpers.arrayElement(categories),
    city: faker.location.city(),
    temperature: faker.number.float({ min: -10, max: 45, precision: 0.01 }),
    water_level: faker.number.float({ min: 0, max: 10, precision: 0.001 }),
    air_quality: faker.number.int({ min: 0, max: 500 }),
    severity: faker.helpers.arrayElement(severities),
    description: faker.lorem.sentence(12),
    image_url: faker.image.url(),
    created_at: new Date(),
  };
}

async function seedMongo() {
  await mongoose.connect(mongoUri);
  await Report.deleteMany({});
  console.log("🧹 Mongo limpio, insertando registros...");

  const batch = [];
  for (let i = 1; i <= TOTAL; i++) {
    batch.push(generateRecord());
    if (batch.length === BATCH_SIZE) {
      await Report.insertMany(batch);
      console.log(`Mongo: insertados ${i}`);
      batch.length = 0;
    }
  }
  if (batch.length) await Report.insertMany(batch);
  console.log("✅ Mongo completado");
  await mongoose.disconnect();
}

async function seedMySQL() {
  const conn = await pool.getConnection();
  await conn.query("DELETE FROM reports");
  console.log("🧹 MySQL limpio, insertando registros...");

  const insertSQL = `
    INSERT INTO reports 
    (user_id, category, city, temperature, water_level, air_quality, severity, description, image_url, created_at)
    VALUES ?
  `;

  const batch = [];
  for (let i = 1; i <= TOTAL; i++) {
    const r = generateRecord();
    batch.push([
      r.user_id,
      r.category,
      r.city,
      r.temperature,
      r.water_level,
      r.air_quality,
      r.severity,
      r.description,
      r.image_url,
      r.created_at,
    ]);
    if (batch.length === BATCH_SIZE) {
      await conn.query(insertSQL, [batch]);
      console.log(`MySQL: insertados ${i}`);
      batch.length = 0;
    }
  }
  if (batch.length) await conn.query(insertSQL, [batch]);
  console.log("✅ MySQL completado");
  conn.release();
}

async function main() {
  console.time("seed");
  await seedMongo();
  await seedMySQL();
  console.timeEnd("seed");
  process.exit();
}

main().catch(err => console.error(err));
