const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",         
  password: "",         
  database: "zynecova"  
});

db.connect(err => {
  if (err) {
    console.error("❌ Error conectando a MySQL:", err);
    return;
  }
  console.log("✅ Conectado a MySQL");
});

app.get("/api/soporte", (req, res) => {
  db.query("SELECT * FROM reportes_soporte", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.post("/api/soporte", (req, res) => {
  const { tipo, descripcion, fecha, estado } = req.body;
  db.query(
    "INSERT INTO reportes_soporte (tipo, descripcion, fecha, estado) VALUES (?, ?, ?, ?)",
    [tipo, descripcion, fecha, estado],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ status: "success", id: result.insertId });
    }
  );
});

app.put("/api/soporte/:id", (req, res) => {
  const { estado } = req.body;
  const { id } = req.params;

  db.query(
    "UPDATE reportes_soporte SET estado = ? WHERE id = ?",
    [estado, id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ status: "success" });
    }
  );
});

app.delete("/api/soporte/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM reportes_soporte WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ status: "success" });
  });
});


app.get("/api/admin", (req, res) => {
  db.query("SELECT * FROM registros_admin", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.post("/api/admin", (req, res) => {
  const { nombre, rol, detalle, fecha } = req.body;
  db.query(
    "INSERT INTO registros_admin (nombre, rol, detalle, fecha) VALUES (?, ?, ?, ?)",
    [nombre, rol, detalle, fecha],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ status: "success", id: result.insertId });
    }
  );
});

app.put("/api/admin/:id", (req, res) => {
  const { nombre, detalle } = req.body;
  const { id } = req.params;

  db.query(
    "UPDATE registros_admin SET nombre = ?, detalle = ? WHERE id = ?",
    [nombre, detalle, id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ status: "success" });
    }
  );
});

app.delete("/api/admin/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM registros_admin WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ status: "success" });
  });
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
